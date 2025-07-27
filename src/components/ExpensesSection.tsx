import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit, Trash2, Save, X, Lock, TrendingDown, Ban } from 'lucide-react';

const ExpensesSection = () => {
  const { expenses, addExpense, updateExpense, deleteExpense } = useFinance();
  const { isFullAdmin, userRole } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFullAdmin) return; // Block announcement admins
    
    if (editingId) {
      updateExpense(editingId, {
        amount: Number(formData.amount),
        description: formData.description,
        date: formData.date
      });
      setEditingId(null);
    } else {
      addExpense({
        amount: Number(formData.amount),
        description: formData.description,
        date: formData.date
      });
    }
    setFormData({ amount: '', description: '', date: new Date().toISOString().split('T')[0] });
    setShowAddForm(false);
  };

  const handleEdit = (expense: any) => {
    if (!isFullAdmin) return; // Block announcement admins
    
    setFormData({
      amount: expense.amount.toString(),
      description: expense.description,
      date: expense.date
    });
    setEditingId(expense.id);
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingId(null);
    setFormData({ amount: '', description: '', date: new Date().toISOString().split('T')[0] });
  };

  const handleDelete = (id: string) => {
    if (!isFullAdmin) return; // Block announcement admins
    if (window.confirm('Are you sure you want to delete this expense?')) {
      deleteExpense(id);
    }
  };

  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <TrendingDown className="h-6 w-6 text-red-600" />
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Expenses</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total: ₦{totalExpenses.toLocaleString()} • {expenses.length} records
            </p>
          </div>
        </div>
        
        {isFullAdmin ? (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-300 flex items-center space-x-2 transform hover:scale-105"
          >
            <Plus className="h-4 w-4" />
            <span>Add Expense</span>
          </button>
        ) : userRole === 'announcement_admin' ? (
          <div className="flex items-center space-x-2 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg border border-red-200 dark:border-red-700">
            <Ban className="h-4 w-4 text-red-600" />
            <span className="text-sm text-red-700 dark:text-red-300">Management Restricted</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
            <Lock className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Admin Only</span>
          </div>
        )}
      </div>

      {/* Access restriction notice for announcement admins */}
      {userRole === 'announcement_admin' && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-700">
          <div className="flex items-center space-x-3">
            <Ban className="h-5 w-5 text-red-600" />
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-200">Financial Management Restricted</p>
              <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                You can view expense records but cannot add, edit, or delete them. Your administrative privileges are limited to announcements only.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Admin-only Add Form */}
      {showAddForm && isFullAdmin && (
        <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6 animate-fade-in">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount (₦)</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-800 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-800 dark:text-white"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-800 dark:text-white"
                placeholder="Purpose of expense"
                required
              />
            </div>
          </div>
          <div className="flex items-center space-x-3 mt-4">
            <button
              type="submit"
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{editingId ? 'Update' : 'Add'} Expense</span>
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
          </div>
        </form>
      )}

      {/* Expenses Table - Visible to All */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Description
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Date
              </th>
              {isFullAdmin && (
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {expenses.map((expense) => (
              <tr key={expense.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-red-600 dark:text-red-400">
                  ₦{expense.amount.toLocaleString()}
                </td>
                <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                  {expense.description}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {new Date(expense.date).toLocaleDateString()}
                </td>
                {isFullAdmin && (
                  <td className="px-4 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEdit(expense)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        
        {expenses.length === 0 && (
          <div className="text-center py-8">
            <TrendingDown className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No expenses recorded yet</p>
          </div>
        )}
      </div>

      {/* Non-admin notice */}
      {!isFullAdmin && userRole !== 'announcement_admin' && (
        <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
          <div className="flex items-center space-x-3">
            <Lock className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Administrator Access Required</p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                To add, edit, or delete expenses, please log in as an administrator via the Settings button.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpensesSection;