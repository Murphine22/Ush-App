import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Search, User, Calendar, DollarSign, TrendingUp, Gift, Receipt } from 'lucide-react';

const MemberSearchPortal = () => {
  const { members, contributions, donations, expenses } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState<any>(null);

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getMemberData = (memberName: string) => {
    const member = members.find(m => m.name === memberName);
    if (!member) return null;

    const memberContributions = contributions.filter(c => c.memberName === memberName);
    const memberDonations = donations.filter(d => d.memberName === memberName);
    
    // Find expenses that might be related to this member (support provided)
    const memberSupport = expenses.filter(e => 
      e.description.toLowerCase().includes(memberName.toLowerCase()) ||
      e.description.toLowerCase().includes('support') ||
      e.description.toLowerCase().includes('assistance')
    );

    const totalContributions = memberContributions.reduce((sum, c) => sum + c.amount, 0);
    const totalDonations = memberDonations.reduce((sum, d) => sum + d.amount, 0);
    const totalSupport = memberSupport.reduce((sum, e) => sum + e.amount, 0);
    const monthsPaid = member.payments.filter(Boolean).length;
    const totalDues = monthsPaid * 500;

    return {
      member,
      contributions: memberContributions,
      donations: memberDonations,
      support: memberSupport,
      totals: {
        contributions: totalContributions,
        donations: totalDonations,
        support: totalSupport,
        dues: totalDues,
        monthsPaid
      }
    };
  };

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300">
      <div className="flex items-center space-x-3 mb-6">
        <Search className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Member Search Portal</h3>
      </div>

      {/* Search Input */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search for your name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-300"
        />
      </div>

      {/* Search Results */}
      {searchTerm && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Search Results:</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {filteredMembers.map((member) => (
              <button
                key={member.id}
                onClick={() => setSelectedMember(getMemberData(member.name))}
                className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 transform hover:scale-[1.02]"
              >
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="font-medium text-gray-900 dark:text-white">{member.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Member Details */}
      {selectedMember && (
        <div className="space-y-6 animate-fade-in">
          {/* Member Header */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 text-white rounded-full p-3">
                <User className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedMember.member.name}</h3>
                <p className="text-gray-600 dark:text-gray-300">Member Financial Summary</p>
              </div>
            </div>
          </div>

          {/* Financial Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center space-x-3">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-600">Monthly Dues</p>
                  <p className="text-xl font-bold text-green-900 dark:text-green-100">₦{selectedMember.totals.dues.toLocaleString()}</p>
                  <p className="text-xs text-green-700 dark:text-green-300">{selectedMember.totals.monthsPaid}/12 months</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-600">Contributions</p>
                  <p className="text-xl font-bold text-blue-900 dark:text-blue-100">₦{selectedMember.totals.contributions.toLocaleString()}</p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">{selectedMember.contributions.length} contributions</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center space-x-3">
                <Gift className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-purple-600">Donations</p>
                  <p className="text-xl font-bold text-purple-900 dark:text-purple-100">₦{selectedMember.totals.donations.toLocaleString()}</p>
                  <p className="text-xs text-purple-700 dark:text-purple-300">{selectedMember.donations.length} donations</p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center space-x-3">
                <Receipt className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-sm font-medium text-orange-600">Support Received</p>
                  <p className="text-xl font-bold text-orange-900 dark:text-orange-100">₦{selectedMember.totals.support.toLocaleString()}</p>
                  <p className="text-xs text-orange-700 dark:text-orange-300">{selectedMember.support.length} instances</p>
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Dues Payment Status */}
          <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              Monthly Dues Payment Status
            </h4>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
              {months.map((month, index) => (
                <div
                  key={month}
                  className={`text-center p-2 rounded-lg transition-all duration-300 ${
                    selectedMember.member.payments[index]
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 transform scale-105'
                      : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <div className="text-xs font-medium">{month}</div>
                  <div className="text-lg">
                    {selectedMember.member.payments[index] ? '✓' : '○'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Records */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Contributions */}
            {selectedMember.contributions.length > 0 && (
              <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contributions</h4>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {selectedMember.contributions.map((contribution: any) => (
                    <div key={contribution.id} className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-r-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{contribution.description}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{new Date(contribution.date).toLocaleDateString()}</p>
                        </div>
                        <span className="font-bold text-blue-600">₦{contribution.amount.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Donations */}
            {selectedMember.donations.length > 0 && (
              <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Donations</h4>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {selectedMember.donations.map((donation: any) => (
                    <div key={donation.id} className="border-l-4 border-purple-500 pl-4 py-2 bg-purple-50 dark:bg-purple-900/20 rounded-r-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{donation.description}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{new Date(donation.date).toLocaleDateString()}</p>
                        </div>
                        <span className="font-bold text-purple-600">₦{donation.amount.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Support Received */}
            {selectedMember.support.length > 0 && (
              <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-sm lg:col-span-2">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Support Received</h4>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {selectedMember.support.map((support: any) => (
                    <div key={support.id} className="border-l-4 border-orange-500 pl-4 py-2 bg-orange-50 dark:bg-orange-900/20 rounded-r-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{support.description}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{new Date(support.date).toLocaleDateString()}</p>
                        </div>
                        <span className="font-bold text-orange-600">₦{support.amount.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* No Member Selected State */}
      {!selectedMember && !searchTerm && (
        <div className="text-center py-12">
          <Search className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Search for Your Records</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Enter your name above to view your payment history, contributions, donations, and any support received.
          </p>
        </div>
      )}
    </div>
  );
};

export default MemberSearchPortal;