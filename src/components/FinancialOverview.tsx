import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, TrendingDown, DollarSign, PiggyBank, ArrowUpCircle, Edit, Save, X, Lock, Ban } from 'lucide-react';

interface FinancialOverviewProps {
  selectedYear: number;
}

const FinancialOverview = ({ selectedYear }: FinancialOverviewProps) => {
  const { getYearlyTotals, members, updateBalanceBroughtForward, balancesBroughtForward } = useFinance();
  const { isFullAdmin, userRole } = useAuth();
  const [editingBalance, setEditingBalance] = useState(false);
  const [newBalance, setNewBalance] = useState('');
  
  const totals = getYearlyTotals(selectedYear);
  const currentBalance = balancesBroughtForward.find(b => b.year === selectedYear)?.amount || 0;

  const handleUpdateBalance = () => {
    if (!isFullAdmin) return; // Prevent announcement admins from updating
    
    const amount = parseFloat(newBalance);
    if (!isNaN(amount)) {
      updateBalanceBroughtForward(selectedYear, amount);
      setEditingBalance(false);
      setNewBalance('');
    }
  };

  const startEditBalance = () => {
    if (!isFullAdmin) return; // Prevent announcement admins from editing
    
    setEditingBalance(true);
    setNewBalance(currentBalance.toString());
  };

  const cancelEditBalance = () => {
    setEditingBalance(false);
    setNewBalance('');
  };

  const stats = [
    {
      title: 'Balance Brought Forward',
      value: totals.balanceBroughtForward,
      icon: <ArrowUpCircle className="h-8 w-8 text-indigo-600" />,
      color: 'indigo',
      description: `From ${selectedYear - 1}`
    },
    {
      title: 'Monthly Dues Received',
      value: totals.monthlyDues,
      icon: <DollarSign className="h-8 w-8 text-blue-600" />,
      color: 'blue',
      description: 'Current year dues'
    },
    {
      title: 'Contributions',
      value: totals.contributions,
      icon: <TrendingUp className="h-8 w-8 text-green-600" />,
      color: 'green',
      description: 'Special contributions'
    },
    {
      title: 'Donations',
      value: totals.donations,
      icon: <PiggyBank className="h-8 w-8 text-purple-600" />,
      color: 'purple',
      description: 'Voluntary donations'
    },
    {
      title: 'Expenses',
      value: totals.totalExpenses,
      icon: <TrendingDown className="h-8 w-8 text-red-600" />,
      color: 'red',
      description: 'Total expenditure'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors duration-300">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedYear} Financial Overview</h2>
        {isFullAdmin ? (
          <button
            onClick={startEditBalance}
            className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors flex items-center space-x-2"
          >
            <Edit className="h-4 w-4" />
            <span className="text-sm">Edit Balance B/F</span>
          </button>
        ) : userRole === 'announcement_admin' ? (
          <div className="flex items-center space-x-2 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-lg border border-red-200 dark:border-red-700">
            <Ban className="h-4 w-4 text-red-600" />
            <span className="text-xs text-red-700 dark:text-red-300">Edit Restricted</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg">
            <Lock className="h-4 w-4 text-gray-500" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Admin Only</span>
          </div>
        )}
      </div>
      
      {/* Edit Balance Modal - Only for full admins */}
      {editingBalance && isFullAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Edit Balance Brought Forward for {selectedYear}
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Amount (₦)
              </label>
              <input
                type="number"
                value={newBalance}
                onChange={(e) => setNewBalance(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter amount"
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleUpdateBalance}
                className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Save</span>
              </button>
              <button
                onClick={cancelEditBalance}
                className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className={`bg-${stat.color}-50 dark:bg-${stat.color}-900/20 rounded-xl p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex-shrink-0">
                {stat.icon}
              </div>
              {stat.title === 'Balance Brought Forward' && (
                <div className="flex items-center space-x-1">
                  {isFullAdmin ? (
                    <button
                      onClick={startEditBalance}
                      className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  ) : (
                    <div className="text-gray-400">
                      <Lock className="h-4 w-4" />
                    </div>
                  )}
                </div>
              )}
            </div>
            <div>
              <p className={`text-sm font-medium text-${stat.color}-600 dark:text-${stat.color}-400 mb-1`}>
                {stat.title}
              </p>
              <p className={`text-2xl font-bold text-${stat.color}-900 dark:text-${stat.color}-100 mb-1`}>
                ₦{stat.value.toLocaleString()}
              </p>
              <p className={`text-xs text-${stat.color}-700 dark:text-${stat.color}-300`}>
                {stat.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Balance Summary */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-700 dark:to-blue-900/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <DollarSign className="h-5 w-5 mr-2 text-blue-600" />
          Financial Summary for {selectedYear}
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
            <span className="text-gray-600 dark:text-gray-300 font-medium">Balance Brought Forward</span>
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">₦{totals.balanceBroughtForward.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
            <span className="text-gray-600 dark:text-gray-300">Monthly Dues</span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">₦{totals.monthlyDues.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
            <span className="text-gray-600 dark:text-gray-300">Contributions</span>
            <span className="font-semibold text-green-600 dark:text-green-400">₦{totals.contributions.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
            <span className="text-gray-600 dark:text-gray-300">Donations</span>
            <span className="font-semibold text-purple-600 dark:text-purple-400">₦{totals.donations.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
            <span className="text-gray-600 dark:text-gray-300 font-medium">Total Income</span>
            <span className="font-semibold text-green-600 dark:text-green-400 text-lg">₦{totals.totalIncome.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
            <span className="text-gray-600 dark:text-gray-300">Total Expenses</span>
            <span className="font-semibold text-red-600 dark:text-red-400">₦{totals.totalExpenses.toLocaleString()}</span>
          </div>
          <div className="border-t-2 border-gray-300 dark:border-gray-600 pt-3">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900 dark:text-white">Net Balance</span>
              <span className={`text-2xl font-bold ${totals.balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                ₦{totals.balance.toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {totals.balance >= 0 ? 'Surplus for the year' : 'Deficit for the year'}
            </p>
          </div>
        </div>
      </div>

      {/* Access restriction notice for announcement admins */}
      {userRole === 'announcement_admin' && (
        <div className="mt-6 bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-700">
          <div className="flex items-center space-x-3">
            <Ban className="h-5 w-5 text-red-600" />
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-200">Financial Management Restricted</p>
              <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                You can view all financial data but cannot modify any financial records. Your administrative privileges are limited to announcements only.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialOverview;