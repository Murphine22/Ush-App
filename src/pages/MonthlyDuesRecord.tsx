import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFinance } from '../context/FinanceContext';
import LoginForm from '../components/LoginForm';
import { ArrowLeft, Plus, Edit, Save, X, Trash2, Printer, Download, Calendar, Home, FileText, Share, AlertCircle, Shield, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';

const MonthlyDuesRecord = () => {
  const { isAuthenticated, isFullAdmin, userRole } = useAuth();
  const { 
    members, 
    addMember, 
    updateMember, 
    deleteMember, 
    toggleMemberPayment,
    loading,
    error,
    refreshData
  } = useFinance();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [editingMember, setEditingMember] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Generate years starting from 2024
  const currentYear = new Date().getFullYear();
  const startYear = 2024;
  const endYear = currentYear + 5;
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => endYear - i);

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    }
  }, [isAuthenticated, selectedYear]);

  // Redirect if not full admin
  if (!isAuthenticated || !isFullAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
            <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Access Restricted</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              This page requires full administrator privileges. Monthly dues record management is restricted to full administrators only.
            </p>
            {!isAuthenticated ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Please log in with full administrator credentials to access this feature.
              </p>
            ) : (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 mb-6 border border-yellow-200 dark:border-yellow-700">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      Current Access: {userRole === 'announcement_admin' ? 'Announcement Admin' : 'Limited User'}
                    </p>
                    <p className="text-xs text-yellow-700 dark:text-yellow-300">
                      You need full administrator privileges to manage monthly dues records.
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="space-y-3">
              <Link
                to="/finance"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors inline-block"
              >
                Go to Finance Page
              </Link>
              <Link
                to="/"
                className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors inline-block"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleAddMember = async () => {
    if (newMemberName.trim()) {
      try {
        await addMember(newMemberName.trim());
        setNewMemberName('');
        setShowAddForm(false);
      } catch (err) {
        console.error('Error adding member:', err);
      }
    }
  };

  const handleEditMember = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    if (member) {
      setEditingMember(memberId);
      setEditName(member.name);
    }
  };

  const handleSaveEdit = async () => {
    if (editingMember && editName.trim()) {
      try {
        await updateMember(editingMember, editName.trim());
        setEditingMember(null);
        setEditName('');
      } catch (err) {
        console.error('Error updating member:', err);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingMember(null);
    setEditName('');
  };

  const handleDeleteMember = async (memberId: string) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        await deleteMember(memberId);
      } catch (err) {
        console.error('Error deleting member:', err);
      }
    }
  };

  const handleTogglePayment = async (memberId: string, monthIndex: number) => {
    try {
      await toggleMemberPayment(memberId, monthIndex, selectedYear);
    } catch (err) {
      console.error('Error toggling payment:', err);
    }
  };

  const handlePrint = () => {
    const printContent = document.getElementById('dues-record-table');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Monthly Dues Record - ${selectedYear}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .header h1 { color: #1e40af; margin-bottom: 5px; }
                .header h2 { color: #374151; margin-bottom: 10px; }
                .header p { color: #6b7280; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #d1d5db; padding: 8px; text-align: center; }
                th { background-color: #f3f4f6; font-weight: bold; }
                .member-name { text-align: left; }
                .total-amount { font-weight: bold; color: #059669; }
                .summary { margin-top: 30px; padding: 20px; background-color: #f9fafb; border-radius: 8px; }
                .summary h3 { color: #1e40af; margin-bottom: 15px; }
                .summary-item { display: flex; justify-content: space-between; margin-bottom: 10px; }
                .summary-value { font-weight: bold; }
                @media print {
                  body { margin: 0; }
                  .no-print { display: none; }
                }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>DIGC Ushering Department</h1>
                <h2>Monthly Dues Record - ${selectedYear}</h2>
                <p>Generated on ${new Date().toLocaleDateString()}</p>
              </div>
              ${printContent.outerHTML}
              <div class="summary">
                <h3>Summary</h3>
                <div class="summary-item">
                  <span>Total Members:</span>
                  <span class="summary-value">${members.length}</span>
                </div>
                <div class="summary-item">
                  <span>Total Collected:</span>
                  <span class="summary-value">₦${members.reduce((total, member) => 
                    total + (member.payments.filter(Boolean).length * 500), 0
                  ).toLocaleString()}</span>
                </div>
                <div class="summary-item">
                  <span>Expected Total:</span>
                  <span class="summary-value">₦${(members.length * 12 * 500).toLocaleString()}</span>
                </div>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const handleDownloadCSV = () => {
    const csvContent = [
      ['S/N', 'Name', ...months, 'Total (₦)'].join(','),
      ...members.map((member, index) => [
        index + 1,
        `"${member.name}"`,
        ...member.payments.map(paid => paid ? 'Paid' : 'Unpaid'),
        member.payments.filter(Boolean).length * 500
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `monthly-dues-record-${selectedYear}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Monthly Dues Record - ${selectedYear}`,
          text: `DIGC Ushering Department Monthly Dues Record for ${selectedYear}`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading member data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Enhanced Header */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 text-white py-8 sm:py-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Link 
                  to="/finance" 
                  className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-all duration-300 transform hover:scale-110"
                  title="Back to Finance"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Link>
                <Link 
                  to="/" 
                  className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-all duration-300 transform hover:scale-110"
                  title="Home"
                >
                  <Home className="h-5 w-5" />
                </Link>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Monthly Dues Record</h1>
                <p className="text-blue-100 mt-1">Manage member dues payments and records for {selectedYear}</p>
                
                {/* Full Admin Badge */}
                <div className="flex items-center space-x-2 mt-2">
                  <Crown className="h-4 w-4 text-yellow-300" />
                  <span className="text-xs bg-purple-500/30 px-2 py-1 rounded-full">Full Administrator Access</span>
                </div>
              </div>
            </div>
            
            {/* Year Selector */}
            <div className="flex items-center space-x-4 bg-white/20 backdrop-blur-sm rounded-lg p-3">
              <Calendar className="h-5 w-5 text-yellow-300" />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="bg-transparent text-white border border-white/30 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-300 focus:border-yellow-300"
              >
                {years.map(year => (
                  <option key={year} value={year} className="text-gray-900">{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Error Display */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4 flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Enhanced Action Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 transition-colors duration-300">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Member Management</h2>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <span>Year: {selectedYear}</span>
                <span>•</span>
                <span>{members.length} Members</span>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center space-x-2 transform hover:scale-105"
              >
                <Plus className="h-4 w-4" />
                <span>Add Member</span>
              </button>
              
              <button
                onClick={handlePrint}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-300 flex items-center space-x-2 transform hover:scale-105"
              >
                <Printer className="h-4 w-4" />
                <span>Print</span>
              </button>
              
              <button
                onClick={handleDownloadCSV}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all duration-300 flex items-center space-x-2 transform hover:scale-105"
              >
                <Download className="h-4 w-4" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={handleShare}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-all duration-300 flex items-center space-x-2 transform hover:scale-105"
              >
                <Share className="h-4 w-4" />
                <span>Share</span>
              </button>
            </div>
          </div>

          {showAddForm && (
            <div className="border-t dark:border-gray-700 pt-4 mt-4 animate-fade-in">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <input
                  type="text"
                  placeholder="Enter member name"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-300"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddMember()}
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleAddMember}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setNewMemberName('');
                    }}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Dues Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-colors duration-300">
          <div className="overflow-x-auto">
            <table id="dues-record-table" className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    S/N
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  {months.map(month => (
                    <th key={month} className="px-1 sm:px-2 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {month}
                    </th>
                  ))}
                  <th className="px-3 sm:px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Total (₦)
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider no-print">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {members.map((member, index) => (
                  <tr 
                    key={member.id} 
                    className={`${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'} hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-300`}
                  >
                    <td className="px-3 sm:px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {index + 1}
                    </td>
                    <td className="px-3 sm:px-4 py-4 whitespace-nowrap member-name">
                      {editingMember === member.id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="text-sm text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded px-2 py-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 transition-all duration-300"
                            onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                          />
                          <button
                            onClick={handleSaveEdit}
                            className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors duration-300"
                          >
                            <Save className="h-4 w-4" />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-300"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-900 dark:text-white font-medium">{member.name}</span>
                      )}
                    </td>
                    {months.map((month, monthIndex) => (
                      <td key={month} className="px-1 sm:px-2 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={member.payments[monthIndex] || false}
                          onChange={() => handleTogglePayment(member.id, monthIndex)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded transition-all duration-300 transform hover:scale-110"
                        />
                      </td>
                    ))}
                    <td className="px-3 sm:px-4 py-4 text-center text-sm font-bold text-green-600 dark:text-green-400 total-amount">
                      ₦{(member.payments.filter(Boolean).length * 500).toLocaleString()}
                    </td>
                    <td className="px-3 sm:px-4 py-4 text-center no-print">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleEditMember(member.id)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-all duration-300 transform hover:scale-110"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMember(member.id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-all duration-300 transform hover:scale-110"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Enhanced Summary */}
        <div className="mt-6 sm:mt-8 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-xl shadow-lg p-6 transition-colors duration-300">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <FileText className="h-6 w-6 mr-2 text-blue-600" />
            Summary for {selectedYear}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-lg">
              <div className="text-center">
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-2">Total Members</p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{members.length}</p>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">Active members</p>
              </div>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-lg">
              <div className="text-center">
                <p className="text-sm text-green-600 dark:text-green-400 font-medium mb-2">Total Collected</p>
                <p className="text-3xl font-bold text-green-900 dark:text-green-100">
                  ₦{members.reduce((total, member) => 
                    total + (member.payments.filter(Boolean).length * 500), 0
                  ).toLocaleString()}
                </p>
                <p className="text-xs text-green-700 dark:text-green-300 mt-1">Payments received</p>
              </div>
            </div>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-lg">
              <div className="text-center">
                <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium mb-2">Expected Total</p>
                <p className="text-3xl font-bold text-yellow-900 dark:text-yellow-100">
                  ₦{(members.length * 12 * 500).toLocaleString()}
                </p>
                <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">Full year target</p>
              </div>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-lg">
              <div className="text-center">
                <p className="text-sm text-purple-600 dark:text-purple-400 font-medium mb-2">Collection Rate</p>
                <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                  {members.length > 0 ? Math.round((members.reduce((total, member) => 
                    total + (member.payments.filter(Boolean).length * 500), 0
                  ) / (members.length * 12 * 500)) * 100) : 0}%
                </p>
                <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">Completion rate</p>
              </div>
            </div>
          </div>

          {/* Monthly Breakdown */}
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Collection Breakdown</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12 gap-3">
              {months.map((month, index) => {
                const monthlyCollection = members.reduce((total, member) => 
                  total + (member.payments[index] ? 500 : 0), 0
                );
                const expectedMonthly = members.length * 500;
                const percentage = expectedMonthly > 0 ? (monthlyCollection / expectedMonthly) * 100 : 0;
                
                return (
                  <div key={month} className="text-center">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 hover:shadow-md transition-all duration-300">
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{month}</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">₦{monthlyCollection.toLocaleString()}</p>
                      <div className="mt-2 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{Math.round(percentage)}%</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyDuesRecord;