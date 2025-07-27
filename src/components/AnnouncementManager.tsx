import React, { useState } from 'react';
import { useAnnouncements, Announcement } from '../context/AnnouncementContext';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit, Trash2, Save, X, Pin, PinOff, Upload, AlertTriangle, Info, CheckCircle, Download, FileText, Image, Video, Paperclip, ExternalLink, Shield, Crown } from 'lucide-react';

const AnnouncementManager = () => {
  const { announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement, togglePin, loading, error } = useAnnouncements();
  const { isAnnouncementAdmin, isFullAdmin, userRole, userEmail } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    priority: 'Medium' as 'Low' | 'Medium' | 'High',
    eventDate: '',
    venue: '',
    content: '',
    senderName: '',
    isPinned: false,
    attachments: [] as File[],
    attachmentUrls: [] as string[]
  });
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAnnouncementAdmin) return;
    
    setUploading(true);
    
    try {
      if (editingId) {
        await updateAnnouncement(editingId, formData);
        setEditingId(null);
      } else {
        await addAnnouncement(formData);
      }
      
      setFormData({
        title: '',
        priority: 'Medium',
        eventDate: '',
        venue: '',
        content: '',
        senderName: '',
        isPinned: false,
        attachments: [],
        attachmentUrls: []
      });
      setShowAddForm(false);
    } catch (err) {
      console.error('Error saving announcement:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (announcement: Announcement) => {
    if (!isAnnouncementAdmin) return;
    
    setFormData({
      title: announcement.title,
      priority: announcement.priority,
      eventDate: announcement.eventDate || '',
      venue: announcement.venue || '',
      content: announcement.content,
      senderName: announcement.senderName,
      isPinned: announcement.isPinned,
      attachments: [],
      attachmentUrls: announcement.attachmentUrls || []
    });
    setEditingId(announcement.id);
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingId(null);
    setFormData({
      title: '',
      priority: 'Medium',
      eventDate: '',
      venue: '',
      content: '',
      senderName: '',
      isPinned: false,
      attachments: [],
      attachmentUrls: []
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData({ ...formData, attachments: [...formData.attachments, ...files] });
  };

  const removeAttachment = (index: number) => {
    const newAttachments = formData.attachments.filter((_, i) => i !== index);
    setFormData({ ...formData, attachments: newAttachments });
  };

  const removeAttachmentUrl = (index: number) => {
    const newUrls = formData.attachmentUrls.filter((_, i) => i !== index);
    setFormData({ ...formData, attachmentUrls: newUrls });
  };

  const getFileIcon = (file: File | string) => {
    let type = '';
    if (typeof file === 'string') {
      const extension = file.split('.').pop()?.toLowerCase() || '';
      if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) type = 'image/';
      else if (['mp4', 'avi', 'mov', 'wmv'].includes(extension)) type = 'video/';
      else if (['pdf', 'doc', 'docx'].includes(extension)) type = 'document';
    } else {
      type = file.type;
    }
    
    if (type.startsWith('image/')) return <Image className="h-4 w-4 text-blue-500" />;
    if (type.startsWith('video/')) return <Video className="h-4 w-4 text-purple-500" />;
    if (type.includes('pdf') || type.includes('document')) return <FileText className="h-4 w-4 text-red-500" />;
    return <Paperclip className="h-4 w-4 text-gray-500" />;
  };

  const downloadFile = (file: File) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const openAttachment = (url: string) => {
    window.open(url, '_blank');
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'High':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'Medium':
        return <Info className="h-4 w-4 text-yellow-500" />;
      case 'Low':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'border-l-red-500 bg-red-50 dark:bg-red-900/20';
      case 'Medium':
        return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'Low':
        return 'border-l-green-500 bg-green-50 dark:bg-green-900/20';
      default:
        return 'border-l-gray-500 bg-gray-50 dark:bg-gray-800';
    }
  };

  const sortedAnnouncements = [...announcements].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    
    const priorityOrder = { High: 3, Medium: 2, Low: 1 };
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) return priorityDiff;
    
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors duration-300">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Announcements & Updates</h3>
        
        {/* Admin Access Indicator */}
        {isAnnouncementAdmin && (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full">
              {userRole === 'announcement_admin' ? (
                <Shield className="h-4 w-4 text-blue-600" />
              ) : (
                <Crown className="h-4 w-4 text-purple-600" />
              )}
              <span className="text-xs font-medium text-blue-700 dark:text-blue-400">
                {userRole === 'announcement_admin' ? 'Announcement Admin' : 'Full Admin'}
              </span>
            </div>
            
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              disabled={uploading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center space-x-2 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4" />
              <span>Add Announcement</span>
            </button>
          </div>
        )}
      </div>

      {/* Access Level Information */}
      {isAnnouncementAdmin && (
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
          <div className="flex items-center space-x-3">
            {userRole === 'announcement_admin' ? (
              <Shield className="h-5 w-5 text-blue-600" />
            ) : (
              <Crown className="h-5 w-5 text-purple-600" />
            )}
            <div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Welcome, {userEmail}
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                {userRole === 'announcement_admin' 
                  ? 'You have access to manage announcements and updates only.'
                  : 'You have full administrative access to all features.'
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
        </div>
      )}

      {showAddForm && isAnnouncementAdmin && (
        <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mb-6 animate-fade-in">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                required
                disabled={uploading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'Low' | 'Medium' | 'High' })}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                disabled={uploading}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Event Date</label>
              <input
                type="date"
                value={formData.eventDate}
                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                disabled={uploading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Venue</label>
              <input
                type="text"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                placeholder="Optional"
                disabled={uploading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sender Name</label>
              <input
                type="text"
                value={formData.senderName}
                onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                required
                disabled={uploading}
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPinned"
                checked={formData.isPinned}
                onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={uploading}
              />
              <label htmlFor="isPinned" className="ml-2 text-sm text-gray-700 dark:text-gray-300">Pin this announcement</label>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                rows={3}
                required
                disabled={uploading}
              />
            </div>
            
            {/* File Upload Section */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Attachments (Documents, Images, Videos)
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.mp4,.mov,.avi"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  disabled={uploading}
                />
                <label
                  htmlFor="file-upload"
                  className={`cursor-pointer flex flex-col items-center justify-center space-y-2 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Upload className="h-8 w-8 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Click to upload files or drag and drop
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    PDF, DOC, Images, Videos (Max 10MB each)
                  </span>
                </label>
              </div>
              
              {/* Display existing attachment URLs */}
              {formData.attachmentUrls.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Existing Attachments:</p>
                  {formData.attachmentUrls.map((url, index) => (
                    <div key={index} className="flex items-center justify-between bg-blue-100 dark:bg-blue-900/30 rounded-lg p-2">
                      <div className="flex items-center space-x-2">
                        {getFileIcon(url)}
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {url.split('/').pop()?.split('-').slice(1).join('-') || 'Attachment'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => openAttachment(url)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeAttachmentUrl(index)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          disabled={uploading}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Display new uploaded files */}
              {formData.attachments.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">New Files to Upload:</p>
                  {formData.attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-100 dark:bg-gray-600 rounded-lg p-2">
                      <div className="flex items-center space-x-2">
                        {getFileIcon(file)}
                        <span className="text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
                        <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        disabled={uploading}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-3 mt-6">
            <button
              type="submit"
              disabled={uploading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center space-x-2 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              <span>{uploading ? 'Saving...' : (editingId ? 'Update' : 'Post')} Announcement</span>
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={uploading}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-all duration-300 flex items-center space-x-2 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {sortedAnnouncements.map((announcement) => (
          <div
            key={announcement.id}
            className={`border-l-4 rounded-lg p-6 ${getPriorityColor(announcement.priority)} transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-3">
                  {getPriorityIcon(announcement.priority)}
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{announcement.title}</h4>
                  {announcement.isPinned && <Pin className="h-4 w-4 text-blue-600" />}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{announcement.content}</p>
                
                {/* Attachments Display */}
                {announcement.attachmentUrls && announcement.attachmentUrls.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Attachments:</p>
                    <div className="flex flex-wrap gap-2">
                      {announcement.attachmentUrls.map((url, index) => (
                        <button
                          key={index}
                          onClick={() => openAttachment(url)}
                          className="flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-sm"
                        >
                          {getFileIcon(url)}
                          <span>{url.split('/').pop()?.split('-').slice(1).join('-') || 'Attachment'}</span>
                          <ExternalLink className="h-3 w-3" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>By: {announcement.senderName}</span>
                  {announcement.eventDate && <span>Event: {new Date(announcement.eventDate).toLocaleDateString()}</span>}
                  {announcement.venue && <span>Venue: {announcement.venue}</span>}
                  <span>Posted: {new Date(announcement.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              {isAnnouncementAdmin && (
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => togglePin(announcement.id)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    disabled={uploading}
                  >
                    {announcement.isPinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => handleEdit(announcement)}
                    className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                    disabled={uploading}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteAnnouncement(announcement.id)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                    disabled={uploading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {sortedAnnouncements.length === 0 && !loading && (
          <div className="text-center py-12">
            <Info className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Announcements Yet</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {isAnnouncementAdmin ? 'Click "Add Announcement" to create your first announcement.' : 'Check back later for updates and announcements.'}
            </p>
          </div>
        )}
      </div>

      {/* Non-admin message */}
      {!isAnnouncementAdmin && (
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
          <div className="flex items-center space-x-3">
            <Shield className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Administrator Access Required</p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                To add, edit, or delete announcements, please log in as an administrator via the Settings button.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementManager;