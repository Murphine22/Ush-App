import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Pin, 
  PinOff, 
  Calendar, 
  User, 
  AlertCircle, 
  Download, 
  Share2, 
  Copy, 
  Upload, 
  Link, 
  X, 
  Image as ImageIcon,
  Lock,
  Shield,
  Crown,
  Ban
} from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'Low' | 'Medium' | 'High';
  event_date?: string;
  venue?: string;
  sender_name: string;
  attachment_urls?: string[];
  is_pinned?: boolean;
  created_at: string;
  updated_at: string;
}

interface AnnouncementFormData {
  title: string;
  content: string;
  priority: 'Low' | 'Medium' | 'High';
  event_date: string;
  venue: string;
  sender_name: string;
  attachment_urls: string[];
}

export default function AnnouncementManager() {
  const { isAuthenticated, isAnnouncementAdmin, isFullAdmin } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<AnnouncementFormData>({
    title: '',
    content: '',
    priority: 'Medium',
    event_date: '',
    venue: '',
    sender_name: '',
    attachment_urls: []
  });
  const [imageUrl, setImageUrl] = useState('');
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnnouncements(data || []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingId(null);
    setFormData({
      title: '',
      content: '',
      priority: 'Medium',
      event_date: '',
      venue: '',
      sender_name: '',
      attachment_urls: []
    });
    setImageUrl('');
    setUploadedFiles([]);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setUploadedFiles(Array.from(files));
    }
  };

  const uploadFilesToSupabase = async (files: File[]): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    
    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      try {
        const { data, error } = await supabase.storage
          .from('announcements')
          .upload(fileName, file);

        if (error) {
          console.error('Error uploading file:', error);
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('announcements')
          .getPublicUrl(fileName);

        uploadedUrls.push(publicUrl);
      } catch (error) {
        console.error('Storage error:', error);
        continue;
      }
    }
    
    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || (!isAnnouncementAdmin && !isFullAdmin)) return;
    
    setLoading(true);

    try {
      let attachmentUrls = [...formData.attachment_urls];

      // Add image URL if provided
      if (uploadMethod === 'url' && imageUrl.trim()) {
        attachmentUrls.push(imageUrl.trim());
      }

      // Upload files if any
      if (uploadMethod === 'file' && uploadedFiles.length > 0) {
        const uploadedUrls = await uploadFilesToSupabase(uploadedFiles);
        attachmentUrls.push(...uploadedUrls);
      }

      const announcementData = {
        ...formData,
        attachment_urls: attachmentUrls.length > 0 ? attachmentUrls : null,
        event_date: formData.event_date || null,
        venue: formData.venue || null
      };

      if (editingId) {
        const { error } = await supabase
          .from('announcements')
          .update(announcementData)
          .eq('id', editingId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('announcements')
          .insert([announcementData]);

        if (error) throw error;
      }

      await fetchAnnouncements();
      handleCancel();
    } catch (error) {
      console.error('Error saving announcement:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = async (url: string, filename?: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename || url.split('/').pop() || 'download';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      window.open(url, '_blank');
    }
  };

  const downloadAllFiles = async (urls: string[]) => {
    for (const url of urls) {
      await downloadFile(url);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const shareAnnouncement = async (announcement: Announcement) => {
    const shareData = {
      title: announcement.title,
      text: announcement.content,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        copyToClipboard(announcement);
      }
    } else {
      copyToClipboard(announcement);
    }
  };

  const copyToClipboard = async (announcement: Announcement) => {
    const text = `${announcement.title}\n\n${announcement.content}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const handleEdit = (announcement: Announcement) => {
    if (!isAuthenticated || (!isAnnouncementAdmin && !isFullAdmin)) return;
    
    setEditingId(announcement.id);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority,
      event_date: announcement.event_date || '',
      venue: announcement.venue || '',
      sender_name: announcement.sender_name,
      attachment_urls: announcement.attachment_urls || []
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!isAuthenticated || (!isAnnouncementAdmin && !isFullAdmin)) return;
    if (!confirm('Are you sure you want to delete this announcement?')) return;

    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchAnnouncements();
    } catch (error) {
      console.error('Error deleting announcement:', error);
    }
  };

  const togglePin = async (id: string, currentPinStatus: boolean) => {
    if (!isAuthenticated || (!isAnnouncementAdmin && !isFullAdmin)) return;
    
    try {
      const { error } = await supabase
        .from('announcements')
        .update({ is_pinned: !currentPinStatus })
        .eq('id', id);

      if (error) throw error;
      await fetchAnnouncements();
    } catch (error) {
      console.error('Error toggling pin:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-700 dark:text-red-400';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-700 dark:text-yellow-400';
      case 'Low': return 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700 dark:text-green-400';
      default: return 'text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-700 dark:text-gray-400';
    }
  };

  const isImage = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
  };

  const getFileIcon = (url: string) => {
    const extension = url.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return '📄';
      case 'doc':
      case 'docx': return '📝';
      case 'xls':
      case 'xlsx': return '📊';
      case 'ppt':
      case 'pptx': return '📋';
      default: return '📎';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">News & Updates</h2>
          <p className="text-gray-600 dark:text-gray-300">Stay informed with the latest announcements and events</p>
        </div>
        
        {/* Admin-only Add Button */}
        {isAuthenticated && (isAnnouncementAdmin || isFullAdmin) ? (
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <Plus className="w-5 h-5" />
            Add Announcement
          </button>
        ) : isAuthenticated ? (
          <div className="flex items-center space-x-2 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-xl border border-red-200 dark:border-red-700">
            <Ban className="h-5 w-5 text-red-600" />
            <span className="text-sm text-red-700 dark:text-red-300">Admin Access Required</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-xl">
            <Lock className="h-5 w-5 text-gray-500" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Login Required</span>
          </div>
        )}
      </div>

      {copySuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in">
          Copied to clipboard!
        </div>
      )}

      {/* Admin Form Modal */}
      {showAddForm && isAuthenticated && (isAnnouncementAdmin || isFullAdmin) && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">
                    {editingId ? 'Edit Announcement' : 'Add New Announcement'}
                  </h2>
                  <p className="text-blue-100 text-sm mt-1">Create engaging content for the community</p>
                </div>
                <button
                  onClick={handleCancel}
                  className="bg-white/20 hover:bg-white/30 rounded-xl p-2 transition-all duration-300 transform hover:scale-110 hover:rotate-90"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300"
                  placeholder="Enter announcement title..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300"
                  placeholder="Write your announcement content..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'Low' | 'Medium' | 'High' })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sender Name</label>
                  <input
                    type="text"
                    value={formData.sender_name}
                    onChange={(e) => setFormData({ ...formData, sender_name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300"
                    placeholder="Your name..."
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Event Date (Optional)</label>
                  <input
                    type="date"
                    value={formData.event_date}
                    onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Venue (Optional)</label>
                  <input
                    type="text"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300"
                    placeholder="Event location..."
                  />
                </div>
              </div>

              {/* Enhanced Image/File Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Add Images or Files</label>
                
                {/* Upload Method Toggle */}
                <div className="flex gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setUploadMethod('url')}
                    className={`px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-300 font-medium ${
                      uploadMethod === 'url' 
                        ? 'bg-blue-600 text-white shadow-lg transform scale-105' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <Link className="w-5 h-5" />
                    Image URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadMethod('file')}
                    className={`px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-300 font-medium ${
                      uploadMethod === 'file' 
                        ? 'bg-blue-600 text-white shadow-lg transform scale-105' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <Upload className="w-5 h-5" />
                    Upload File
                  </button>
                </div>

                {/* URL Input */}
                {uploadMethod === 'url' && (
                  <div className="space-y-4">
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300"
                    />
                    {imageUrl && (
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 bg-gray-50 dark:bg-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 font-medium">Preview:</p>
                        <img 
                          src={imageUrl} 
                          alt="Preview" 
                          className="max-w-full h-48 object-cover rounded-xl shadow-lg"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* File Upload */}
                {uploadMethod === 'file' && (
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 bg-gray-50 dark:bg-gray-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300">
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        multiple
                        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                        className="w-full text-sm text-gray-600 dark:text-gray-400 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:bg-blue-50 dark:file:bg-blue-900/30 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/50 file:font-medium file:transition-all file:duration-300"
                      />
                    </div>
                    {uploadedFiles.length > 0 && (
                      <div className="border border-gray-200 dark:border-gray-600 rounded-xl p-4 bg-white dark:bg-gray-800">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 font-medium">Selected files:</p>
                        <div className="space-y-2">
                          {uploadedFiles.map((file, index) => (
                            <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <span className="text-lg">{getFileIcon(file.name)}</span>
                              <span className="flex-1 text-sm font-medium text-gray-900 dark:text-white">{file.name}</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full">
                                {(file.size / 1024).toFixed(1)} KB
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 disabled:transform-none shadow-lg"
                >
                  {loading ? 'Saving...' : editingId ? 'Update' : 'Create'} Announcement
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modern Announcement Grid - 2 per row on desktop, 1 on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {announcements.map((announcement, index) => (
          <div
            key={announcement.id}
            className={`group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200 dark:border-gray-700 transform hover:-translate-y-2 animate-fade-in ${
              announcement.is_pinned ? 'ring-2 ring-blue-500/50 shadow-blue-100 dark:shadow-blue-900/20' : ''
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Featured Image */}
            {announcement.attachment_urls && announcement.attachment_urls.some(url => isImage(url)) && (
              <div className="relative h-48 overflow-hidden">
                <img
                  src={announcement.attachment_urls.find(url => isImage(url))}
                  alt={announcement.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                
                {/* Pinned Badge */}
                {announcement.is_pinned && (
                  <div className="absolute top-4 right-4 bg-blue-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 shadow-lg">
                    <Pin className="w-3 h-3" />
                    Pinned
                  </div>
                )}
                
                {/* Priority Badge */}
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${getPriorityColor(announcement.priority)}`}>
                  {announcement.priority} Priority
                </div>
              </div>
            )}

            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      {announcement.title}
                    </h3>
                    {!announcement.attachment_urls?.some(url => isImage(url)) && (
                      <>
                        {announcement.is_pinned && (
                          <Pin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        )}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border flex-shrink-0 ${getPriorityColor(announcement.priority)}`}>
                          {announcement.priority}
                        </span>
                      </>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {announcement.sender_name}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(announcement.created_at).toLocaleDateString()}
                    </div>
                    {announcement.event_date && (
                      <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium">
                        <AlertCircle className="w-4 h-4" />
                        Event: {new Date(announcement.event_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  {/* Public Actions */}
                  <button
                    onClick={() => shareAnnouncement(announcement)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all duration-300 transform hover:scale-110"
                    title="Share"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => copyToClipboard(announcement)}
                    className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-xl transition-all duration-300 transform hover:scale-110"
                    title="Copy"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  
                  {/* Admin-only Actions */}
                  {isAuthenticated && (isAnnouncementAdmin || isFullAdmin) && (
                    <>
                      <button
                        onClick={() => togglePin(announcement.id, announcement.is_pinned || false)}
                        className={`p-2 rounded-xl transition-all duration-300 transform hover:scale-110 ${
                          announcement.is_pinned 
                            ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50' 
                            : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30'
                        }`}
                        title={announcement.is_pinned ? 'Unpin' : 'Pin'}
                      >
                        {announcement.is_pinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleEdit(announcement)}
                        className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 rounded-xl transition-all duration-300 transform hover:scale-110"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(announcement.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all duration-300 transform hover:scale-110"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="prose max-w-none mb-6">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {announcement.content}
                </p>
              </div>

              {/* Venue */}
              {announcement.venue && (
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
                  <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                    📍 <strong>Venue:</strong> {announcement.venue}
                  </p>
                </div>
              )}

              {/* File Attachments */}
              {announcement.attachment_urls && announcement.attachment_urls.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-blue-600" />
                      Attachments ({announcement.attachment_urls.length})
                    </h4>
                    {announcement.attachment_urls.length > 1 && (
                      <button
                        onClick={() => downloadAllFiles(announcement.attachment_urls!)}
                        className="text-sm bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium"
                      >
                        <Download className="w-4 h-4" />
                        Download All
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {announcement.attachment_urls.map((url, index) => (
                      <div key={index} className="group/file">
                        {isImage(url) ? (
                          <div className="relative overflow-hidden rounded-xl">
                            <img
                              src={url}
                              alt={`Attachment ${index + 1}`}
                              className="w-full h-32 object-cover border border-gray-200 dark:border-gray-600 group-hover/file:shadow-lg transition-all duration-300"
                            />
                            <button
                              onClick={() => downloadFile(url)}
                              className="absolute inset-0 bg-black/0 group-hover/file:bg-black/40 flex items-center justify-center opacity-0 group-hover/file:opacity-100 transition-all duration-300 rounded-xl"
                            >
                              <div className="bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-lg flex items-center gap-2 font-medium shadow-lg transform scale-90 group-hover/file:scale-100 transition-all duration-300">
                                <Download className="w-4 h-4" />
                                Download
                              </div>
                            </button>
                          </div>
                        ) : (
                          <div className="border border-gray-200 dark:border-gray-600 rounded-xl p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 group-hover/file:shadow-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{getFileIcon(url)}</span>
                                <div>
                                  <span className="text-sm font-medium text-gray-900 dark:text-white block">
                                    {url.split('/').pop() || 'Download'}
                                  </span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    Click to download
                                  </span>
                                </div>
                              </div>
                              <button
                                onClick={() => downloadFile(url)}
                                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all duration-300 transform hover:scale-110"
                              >
                                <Download className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {announcements.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
            <AlertCircle className="w-12 h-12 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No announcements yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Stay tuned for the latest news, updates, and important announcements from our department
          </p>
          {isAuthenticated && (isAnnouncementAdmin || isFullAdmin) && (
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl flex items-center gap-3 mx-auto transition-all duration-300 transform hover:scale-105 shadow-lg font-medium"
            >
              <Plus className="w-5 h-5" />
              Create First Announcement
            </button>
          )}
        </div>
      )}

      {/* Access Information for Non-Admins */}
      {!isAuthenticated && (
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
          <div className="flex items-center space-x-3">
            <Lock className="h-6 w-6 text-blue-600" />
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100">Administrator Access Required</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                To create, edit, pin, or delete announcements, please log in as an administrator via the Settings button (⚙️).
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}