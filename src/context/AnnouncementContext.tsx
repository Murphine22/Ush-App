import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, dbHelpers } from '../lib/supabase';

export interface Announcement {
  id: string;
  title: string;
  priority: 'Low' | 'Medium' | 'High';
  eventDate?: string;
  venue?: string;
  content: string;
  senderName: string;
  attachments?: File[];
  attachmentUrls?: string[];
  isPinned: boolean;
  createdAt: string;
}

interface AnnouncementContextType {
  announcements: Announcement[];
  loading: boolean;
  error: string | null;
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'createdAt'>) => Promise<void>;
  updateAnnouncement: (id: string, announcement: Omit<Announcement, 'id' | 'createdAt'>) => Promise<void>;
  deleteAnnouncement: (id: string) => Promise<void>;
  togglePin: (id: string) => Promise<void>;
  uploadAttachment: (file: File) => Promise<string>;
}

const AnnouncementContext = createContext<AnnouncementContextType | undefined>(undefined);

export const useAnnouncements = () => {
  const context = useContext(AnnouncementContext);
  if (!context) {
    throw new Error('useAnnouncements must be used within an AnnouncementProvider');
  }
  return context;
};

interface AnnouncementProviderProps {
  children: ReactNode;
}

export const AnnouncementProvider: React.FC<AnnouncementProviderProps> = ({ children }) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load announcements from Supabase
  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await dbHelpers.getAnnouncements();
      
      const transformedAnnouncements = data.map(announcement => ({
        id: announcement.id,
        title: announcement.title,
        priority: announcement.priority,
        eventDate: announcement.event_date,
        venue: announcement.venue,
        content: announcement.content,
        senderName: announcement.sender_name,
        attachmentUrls: announcement.attachment_urls || [],
        isPinned: announcement.is_pinned,
        createdAt: announcement.created_at
      }));
      
      setAnnouncements(transformedAnnouncements);
    } catch (err) {
      console.error('Error loading announcements:', err);
      setError(err instanceof Error ? err.message : 'Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  // Upload file to Supabase Storage
  const uploadAttachment = async (file: File): Promise<string> => {
    try {
      // Check if storage is available
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      if (bucketsError) {
        console.warn('Storage not available:', bucketsError);
        throw new Error('File storage is not available');
      }
      
      const attachmentsBucket = buckets.find(bucket => bucket.name === 'attachments');
      if (!attachmentsBucket) {
        console.warn('Attachments bucket not found');
        throw new Error('File storage bucket not configured');
      }
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `announcements/${fileName}`;

      const { data, error } = await supabase.storage
        .from('attachments')
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('attachments')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (err) {
      console.error('Error uploading file:', err);
      throw new Error(err instanceof Error ? err.message : 'Failed to upload file');
    }
  };

  const addAnnouncement = async (announcement: Omit<Announcement, 'id' | 'createdAt'>) => {
    try {
      setError(null);
      
      // Upload attachments if any
      let attachmentUrls: string[] = [];
      if (announcement.attachments && announcement.attachments.length > 0) {
        try {
          attachmentUrls = await Promise.all(
            announcement.attachments.map(file => uploadAttachment(file))
          );
        } catch (uploadError) {
          console.warn('File upload failed, proceeding without attachments:', uploadError);
          // Continue without attachments if upload fails
          attachmentUrls = [];
        }
      }

      const newAnnouncement = await dbHelpers.addAnnouncement({
        title: announcement.title,
        priority: announcement.priority,
        event_date: announcement.eventDate,
        venue: announcement.venue,
        content: announcement.content,
        sender_name: announcement.senderName,
        attachment_urls: attachmentUrls,
        is_pinned: announcement.isPinned
      });

      const transformedAnnouncement = {
        id: newAnnouncement.id,
        title: newAnnouncement.title,
        priority: newAnnouncement.priority,
        eventDate: newAnnouncement.event_date,
        venue: newAnnouncement.venue,
        content: newAnnouncement.content,
        senderName: newAnnouncement.sender_name,
        attachmentUrls: newAnnouncement.attachment_urls || [],
        isPinned: newAnnouncement.is_pinned,
        createdAt: newAnnouncement.created_at
      };

      setAnnouncements(prev => [transformedAnnouncement, ...prev]);
    } catch (err) {
      console.error('Error adding announcement:', err);
      setError(err instanceof Error ? err.message : 'Failed to add announcement');
      throw err;
    }
  };

  const updateAnnouncement = async (id: string, announcement: Omit<Announcement, 'id' | 'createdAt'>) => {
    try {
      setError(null);
      
      // Upload new attachments if any
      let attachmentUrls: string[] = announcement.attachmentUrls || [];
      if (announcement.attachments && announcement.attachments.length > 0) {
        try {
          const newUrls = await Promise.all(
            announcement.attachments.map(file => uploadAttachment(file))
          );
          attachmentUrls = [...attachmentUrls, ...newUrls];
        } catch (uploadError) {
          console.warn('File upload failed, proceeding with existing attachments:', uploadError);
          // Continue with existing attachments if new upload fails
        }
      }

      const updatedAnnouncement = await dbHelpers.updateAnnouncement(id, {
        title: announcement.title,
        priority: announcement.priority,
        event_date: announcement.eventDate,
        venue: announcement.venue,
        content: announcement.content,
        sender_name: announcement.senderName,
        attachment_urls: attachmentUrls,
        is_pinned: announcement.isPinned
      });

      const transformedAnnouncement = {
        id: updatedAnnouncement.id,
        title: updatedAnnouncement.title,
        priority: updatedAnnouncement.priority,
        eventDate: updatedAnnouncement.event_date,
        venue: updatedAnnouncement.venue,
        content: updatedAnnouncement.content,
        senderName: updatedAnnouncement.sender_name,
        attachmentUrls: updatedAnnouncement.attachment_urls || [],
        isPinned: updatedAnnouncement.is_pinned,
        createdAt: updatedAnnouncement.created_at
      };

      setAnnouncements(prev => prev.map(a => 
        a.id === id ? transformedAnnouncement : a
      ));
    } catch (err) {
      console.error('Error updating announcement:', err);
      setError(err instanceof Error ? err.message : 'Failed to update announcement');
      throw err;
    }
  };

  const deleteAnnouncement = async (id: string) => {
    try {
      setError(null);
      await dbHelpers.deleteAnnouncement(id);
      setAnnouncements(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error('Error deleting announcement:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete announcement');
      throw err;
    }
  };

  const togglePin = async (id: string) => {
    try {
      setError(null);
      const announcement = announcements.find(a => a.id === id);
      if (!announcement) return;

      await dbHelpers.toggleAnnouncementPin(id, !announcement.isPinned);
      
      setAnnouncements(prev => prev.map(a => 
        a.id === id ? { ...a, isPinned: !a.isPinned } : a
      ));
    } catch (err) {
      console.error('Error toggling pin:', err);
      setError(err instanceof Error ? err.message : 'Failed to toggle pin');
      throw err;
    }
  };

  return (
    <AnnouncementContext.Provider value={{
      announcements,
      loading,
      error,
      addAnnouncement,
      updateAnnouncement,
      deleteAnnouncement,
      togglePin,
      uploadAttachment
    }}>
      {children}
    </AnnouncementContext.Provider>
  );
};