import React, { useState } from 'react';
import { useAnnouncements, Announcement } from '../context/AnnouncementContext';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit, Trash2, Save, X, Pin, PinOff, Upload, AlertTriangle, Info, CheckCircle, Download, FileText, Image, Video, Paperclip, ExternalLink, Shield, Crown, Calendar, MapPin, User, Clock, Sparkles, Star, Zap, Heart, Bell, Share, Eye, ChevronRight, ChevronDown, MessageCircle, Facebook, Twitter, Copy } from 'lucide-react';

const AnnouncementManager = () => {
  const { announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement, togglePin, loading, error } = useAnnouncements();
  const { isAnnouncementAdmin, isFullAdmin, userRole, userEmail } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedPosts, setExpandedPosts] = useState<string[]>([]);
  const [displayCount, setDisplayCount] = useState(6);
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
    if (!isAnnouncementAdmin) return; // Only admins can upload
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
        return 'border-l-red-500 bg-gradient-to-br from-red-50 via-pink-50 to-red-100 dark:from-red-900/20 dark:via-pink-900/20 dark:to-red-800/20';
      case 'Medium':
        return 'border-l-yellow-500 bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-100 dark:from-yellow-900/20 dark:via-amber-900/20 dark:to-yellow-800/20';
      case 'Low':
        return 'border-l-green-500 bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-green-800/20';
      default:
        return 'border-l-gray-500 bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 dark:from-gray-800 dark:via-slate-800 dark:to-gray-700';
    }
  };

  const getPriorityGlow = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'shadow-red-500/20 hover:shadow-red-500/40';
      case 'Medium':
        return 'shadow-yellow-500/20 hover:shadow-yellow-500/40';
      case 'Low':
        return 'shadow-green-500/20 hover:shadow-green-500/40';
      default:
        return 'shadow-gray-500/20 hover:shadow-gray-500/40';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const toggleExpanded = (postId: string) => {
    setExpandedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const sharePost = async (announcement: Announcement) => {
    const shareData = {
      title: `DIGC Announcement: ${announcement.title}`,
      text: announcement.content.substring(0, 100) + '...',
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Error sharing:', error);
        copyToClipboard(shareData.url);
      }
    } else {
      copyToClipboard(shareData.url);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
    alert('Link copied to clipboard!');
  };

  const shareToSocial = (platform: string, announcement: Announcement) => {
    const text = encodeURIComponent(`DIGC Announcement: ${announcement.title}`);
    const url = encodeURIComponent(window.location.href);
    
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${text}%20${url}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const sortedAnnouncements = [...announcements].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    
    const priorityOrder = { High: 3, Medium: 2, Low: 1 };
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) return priorityDiff;
    
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const displayedAnnouncements = sortedAnnouncements.slice(0, displayCount);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors duration-300">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="grid md:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/10 dark:via-purple-900/10 dark:to-pink-900/10 opacity-50"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-pink-400/10 to-yellow-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8 transition-all duration-500 hover:shadow-3xl">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-4 rounded-2xl shadow-lg transform hover:scale-110 transition-all duration-300">
                <Bell className="h-8 w-8 text-white animate-pulse" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-bounce flex items-center justify-center">
                  <span className="text-xs text-white font-bold">{announcements.length}</span>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur-lg opacity-30 animate-pulse"></div>
            </div>
            <div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                News & Updates
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1 flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-yellow-500" />
                <span>Stay connected with the latest announcements</span>
              </p>
            </div>
          </div>
        
          {/* Admin Access Indicator */}
          {isAnnouncementAdmin && (
            <div className="flex items-center space-x-4 animate-fade-in">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 px-4 py-2 rounded-full border border-blue-200 dark:border-blue-700 shadow-lg backdrop-blur-sm">
                {userRole === 'announcement_admin' ? (
                  <Shield className="h-4 w-4 text-blue-600 animate-pulse" />
                ) : (
                  <Crown className="h-4 w-4 text-purple-600 animate-pulse" />
                )}
                <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                  {userRole === 'announcement_admin' ? 'Announcement Admin' : 'Full Admin'}
                </span>
              </div>
              
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                disabled={uploading}
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-6 py-3 rounded-2xl hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center space-x-2 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed animate-pulse-glow"
              >
                <Plus className="h-5 w-5" />
                <span className="font-semibold">Create Post</span>
              </button>
            </div>
          )}
        </div>

        {/* Access Level Information */}
        {isAnnouncementAdmin && (
          <div className="mb-8 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-700 shadow-lg backdrop-blur-sm animate-fade-in">
            <div className="flex items-center space-x-3">
              {userRole === 'announcement_admin' ? (
                <div className="bg-blue-600 p-2 rounded-xl">
                  <Shield className="h-5 w-5 text-white" />
                </div>
              ) : (
                <div className="bg-purple-600 p-2 rounded-xl">
                  <Crown className="h-5 w-5 text-white" />
                </div>
              )}
              <div>
                <p className="text-base font-semibold text-blue-800 dark:text-blue-200">
                  Welcome, {userEmail}
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  {userRole === 'announcement_admin' 
                    ? 'You can create posts and upload files for announcements.'
                    : 'You have full administrative access to all features.'
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-8 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-700 rounded-2xl p-6 shadow-lg animate-bounce-in">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <p className="text-red-800 dark:text-red-200 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Admin-only Create Form */}
        {showAddForm && isAnnouncementAdmin && (
          <form onSubmit={handleSubmit} className="bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-700 dark:via-blue-900/20 dark:to-purple-900/20 rounded-3xl p-8 mb-8 animate-bounce-in border border-gray-200 dark:border-gray-600 shadow-xl backdrop-blur-sm">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Post</h4>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Title</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border-2 border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                  required
                  disabled={uploading}
                  placeholder="Enter post title..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-2">
                  <Star className="h-4 w-4" />
                  <span>Priority</span>
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'Low' | 'Medium' | 'High' })}
                  className="w-full border-2 border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                  disabled={uploading}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Event Date</span>
                </label>
                <input
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  className="w-full border-2 border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                  disabled={uploading}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Venue</span>
                </label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  className="w-full border-2 border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                  placeholder="Optional"
                  disabled={uploading}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Author</span>
                </label>
                <input
                  type="text"
                  value={formData.senderName}
                  onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                  className="w-full border-2 border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                  required
                  disabled={uploading}
                  placeholder="Your name..."
                />
              </div>
              <div className="flex items-center space-x-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                <Pin className="h-5 w-5 text-blue-600" />
                <input
                  type="checkbox"
                  id="isPinned"
                  checked={formData.isPinned}
                  onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-lg"
                  disabled={uploading}
                />
                <label htmlFor="isPinned" className="text-sm font-medium text-gray-700 dark:text-gray-300">Pin to top</label>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Content</span>
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full border-2 border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                  rows={4}
                  required
                  disabled={uploading}
                  placeholder="Write your post content here..."
                />
              </div>
              
              {/* File Upload Section - Admin Only */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center space-x-2">
                  <Upload className="h-4 w-4" />
                  <span>Attachments (Admin Only)</span>
                </label>
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  Upload files that all users can download
                </div>
                <div className="border-2 border-dashed border-blue-300 dark:border-blue-600 rounded-xl p-6 bg-blue-50/50 dark:bg-blue-900/10 hover:bg-blue-100/50 dark:hover:bg-blue-900/20 transition-all duration-300">
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
                    className={`cursor-pointer flex flex-col items-center justify-center space-y-3 ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 transition-transform duration-300'}`}
                  >
                    <div className="bg-blue-600 p-3 rounded-xl">
                      <Upload className="h-8 w-8 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Click to upload files or drag and drop
                    </span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      PDF, DOC, Images, Videos (Max 10MB each)
                    </span>
                  </label>
                </div>
                
                {/* Display existing attachment URLs */}
                {formData.attachmentUrls.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center space-x-2">
                      <Paperclip className="h-4 w-4" />
                      <span>Existing Attachments:</span>
                    </p>
                    {formData.attachmentUrls.map((url, index) => (
                      <div key={index} className="flex items-center justify-between bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl p-3 border border-blue-200 dark:border-blue-700 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="flex items-center space-x-2">
                          {getFileIcon(url)}
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {url.split('/').pop()?.split('-').slice(1).join('-') || 'Attachment'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => openAttachment(url)}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-all duration-300 transform hover:scale-110"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeAttachmentUrl(index)}
                            className="text-red-500 hover:text-red-700 transition-all duration-300 transform hover:scale-110"
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
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center space-x-2">
                      <Upload className="h-4 w-4" />
                      <span>New Files to Upload:</span>
                    </p>
                    {formData.attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gradient-to-r from-gray-100 to-blue-100 dark:from-gray-600 dark:to-blue-900/30 rounded-xl p-3 border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="flex items-center space-x-2">
                          {getFileIcon(file)}
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{file.name}</span>
                          <span className="text-xs text-gray-500 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAttachment(index)}
                          className="text-red-500 hover:text-red-700 transition-all duration-300 transform hover:scale-110"
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
            <div className="flex items-center space-x-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
              <button
                type="submit"
                disabled={uploading}
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-8 py-3 rounded-2xl hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center space-x-2 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                <Save className="h-5 w-5" />
                <span>{uploading ? 'Publishing...' : (editingId ? 'Update' : 'Publish')} Post</span>
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={uploading}
                className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-8 py-3 rounded-2xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 flex items-center space-x-2 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                <X className="h-5 w-5" />
                <span>Cancel</span>
              </button>
            </div>
          </form>
        )}

        {/* Blog/News Feed Layout - 2 Columns, Max 6 Posts */}
        <div className="grid md:grid-cols-2 gap-8">
          {displayedAnnouncements.map((announcement, index) => (
            <div
              key={announcement.id}
              className={`relative overflow-hidden border-l-4 rounded-3xl p-6 ${getPriorityColor(announcement.priority)} ${getPriorityGlow(announcement.priority)} transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-2 hover:scale-[1.02] animate-fade-in group`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform duration-500"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full -ml-8 -mb-8 group-hover:scale-110 transition-transform duration-500"></div>
              
              {/* Pinned Badge */}
              {announcement.isPinned && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1 shadow-lg animate-pulse z-10">
                  <Pin className="h-3 w-3" />
                  <span>FEATURED</span>
                </div>
              )}
              
              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 bg-white/50 dark:bg-gray-800/50 p-2 rounded-xl shadow-lg backdrop-blur-sm">
                      {getPriorityIcon(announcement.priority)}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                      announcement.priority === 'High' ? 'bg-red-500 text-white' :
                      announcement.priority === 'Medium' ? 'bg-yellow-500 text-white' :
                      'bg-green-500 text-white'
                    } shadow-lg`}>
                      {announcement.priority}
                    </span>
                  </div>
                  
                  {/* Admin Actions */}
                  {isAnnouncementAdmin && (
                    <div className="flex space-x-1">
                      <button
                        onClick={() => togglePin(announcement.id)}
                        className={`p-2 rounded-lg transition-all duration-300 transform hover:scale-110 shadow-md ${
                          announcement.isPinned 
                            ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                        disabled={uploading}
                        title={announcement.isPinned ? 'Unpin post' : 'Pin post'}
                      >
                        {announcement.isPinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => handleEdit(announcement)}
                        className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-110 shadow-md"
                        disabled={uploading}
                        title="Edit post"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteAnnouncement(announcement.id)}
                        className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-110 shadow-md"
                        disabled={uploading}
                        title="Delete post"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Title */}
                <h4 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 mb-3 line-clamp-2">
                  {announcement.title}
                </h4>
                
                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-4">
                  <div className="flex items-center space-x-1 bg-white/50 dark:bg-gray-800/50 px-2 py-1 rounded-full backdrop-blur-sm">
                    <User className="h-3 w-3 text-blue-600" />
                    <span className="font-medium">{announcement.senderName}</span>
                  </div>
                  <div className="flex items-center space-x-1 bg-white/50 dark:bg-gray-800/50 px-2 py-1 rounded-full backdrop-blur-sm">
                    <Clock className="h-3 w-3 text-green-600" />
                    <span>{formatDate(announcement.createdAt)}</span>
                  </div>
                  {announcement.eventDate && (
                    <div className="flex items-center space-x-1 bg-white/50 dark:bg-gray-800/50 px-2 py-1 rounded-full backdrop-blur-sm">
                      <Calendar className="h-3 w-3 text-purple-600" />
                      <span>{new Date(announcement.eventDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  {announcement.venue && (
                    <div className="flex items-center space-x-1 bg-white/50 dark:bg-gray-800/50 px-2 py-1 rounded-full backdrop-blur-sm">
                      <MapPin className="h-3 w-3 text-orange-600" />
                      <span>{announcement.venue}</span>
                    </div>
                  )}
                </div>
                
                {/* Content Preview/Full */}
                <div className="bg-white/30 dark:bg-gray-800/30 rounded-2xl p-4 mb-4 backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                    {expandedPosts.includes(announcement.id) 
                      ? announcement.content 
                      : truncateContent(announcement.content)
                    }
                  </p>
                  
                  {announcement.content.length > 150 && (
                    <button
                      onClick={() => toggleExpanded(announcement.id)}
                      className="mt-3 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-sm flex items-center space-x-1 transition-all duration-300 transform hover:scale-105"
                    >
                      {expandedPosts.includes(announcement.id) ? (
                        <>
                          <span>Show Less</span>
                          <ChevronDown className="h-4 w-4" />
                        </>
                      ) : (
                        <>
                          <span>Read More</span>
                          <ChevronRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>
                
                {/* Attachments - Public Download */}
                {announcement.attachmentUrls && announcement.attachmentUrls.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-2">
                      <Paperclip className="h-4 w-4" />
                      <span>Downloads:</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {announcement.attachmentUrls.map((url, index) => (
                        <button
                          key={index}
                          onClick={() => openAttachment(url)}
                          className="flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 px-3 py-2 rounded-xl hover:from-blue-200 hover:to-purple-200 dark:hover:from-blue-900/50 dark:hover:to-purple-900/50 transition-all duration-300 text-xs font-medium shadow-sm hover:shadow-md transform hover:scale-105"
                        >
                          {getFileIcon(url)}
                          <span className="truncate max-w-20">{url.split('/').pop()?.split('-').slice(1).join('-') || 'File'}</span>
                          <Download className="h-3 w-3" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Action Bar */}
                <div className="flex items-center justify-between pt-4 border-t border-white/20 dark:border-gray-700/20">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => sharePost(announcement)}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md text-sm font-medium"
                    >
                      <Share className="h-4 w-4" />
                      <span>Share</span>
                    </button>
                    
                    {/* Social Share Buttons */}
                    <div className="flex space-x-1">
                      <button
                        onClick={() => shareToSocial('whatsapp', announcement)}
                        className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-110 shadow-md"
                        title="Share on WhatsApp"
                      >
                        <MessageCircle className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => shareToSocial('facebook', announcement)}
                        className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-110 shadow-md"
                        title="Share on Facebook"
                      >
                        <Facebook className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => shareToSocial('twitter', announcement)}
                        className="bg-sky-500 text-white p-2 rounded-lg hover:bg-sky-600 transition-all duration-300 transform hover:scale-110 shadow-md"
                        title="Share on Twitter"
                      >
                        <Twitter className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                    <Eye className="h-3 w-3" />
                    <span>{Math.floor(Math.random() * 500) + 50} views</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Load More Button */}
        {announcements.length > displayCount && (
          <div className="text-center mt-8">
            <button
              onClick={() => setDisplayCount(prev => prev + 6)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold flex items-center space-x-2 mx-auto"
            >
              <Plus className="h-5 w-5" />
              <span>Load More Posts</span>
            </button>
          </div>
        )}
        
        {sortedAnnouncements.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 p-8 rounded-3xl mx-auto w-fit">
                <Bell className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto animate-pulse" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-3xl blur-xl"></div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 mt-6">No Posts Yet</h3>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              {isAnnouncementAdmin ? 'Click "Create Post" to publish your first announcement.' : 'Check back later for updates and announcements.'}
            </p>
          </div>
        )}

        {/* Non-admin message */}
        {!isAnnouncementAdmin && (
          <div className="mt-8 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-700 shadow-lg backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-xl">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-base font-semibold text-blue-800 dark:text-blue-200">Administrator Access Required</p>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  To create, edit, or delete posts, please log in as an administrator via the Settings button. All users can read posts and download attachments.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementManager;