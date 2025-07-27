import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFinance } from '../context/FinanceContext';
import FinancialOverview from '../components/FinancialOverview';
import BankAccountDetails from '../components/BankAccountDetails';
import MonthlyReport from '../components/MonthlyReport';
import FinancialImages from '../components/FinancialImages';
import ContributionsSection from '../components/ContributionsSection';
import DonationsSection from '../components/DonationsSection';
import ExpensesSection from '../components/ExpensesSection';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { Users, FileText, Lock, TrendingUp, ArrowUpCircle, Eye, Shield, Crown, AlertTriangle, Ban } from 'lucide-react';

const Finance = () => {
  const { isAuthenticated, isFullAdmin, userRole } = useAuth();
  const { getYearlyTotals } = useFinance();
  const [selectedYear, setSelectedYear] = useState(2025);
  
  // Generate years starting from 2024 to 2200 for comprehensive data support
  const currentYear = new Date().getFullYear();
  const startYear = 2024; // Changed to start from 2024
  const endYear = 2200;
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => endYear - i);
  
  const yearlyTotals = getYearlyTotals(selectedYear);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header - Made Taller */}
      <section className="bg-blue-600 dark:bg-blue-800 text-white py-16 sm:py-20 lg:py-24 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">Financial Management</h1>
            <p className="text-xl sm:text-2xl opacity-90">DIGC Ushering Department Finance Portal</p>
            
            {/* Enhanced Access Status */}
            <div className="mt-6 flex justify-center">
              {isAuthenticated ? (
                <div className={`${isFullAdmin ? 'bg-purple-500/20' : 'bg-blue-500/20'} backdrop-blur-sm rounded-lg p-4 inline-block`}>
                  <div className="flex items-center space-x-3">
                    {isFullAdmin ? (
                      <Crown className="h-6 w-6 text-purple-300" />
                    ) : (
                      <Shield className="h-6 w-6 text-blue-300" />
                    )}
                    <div>
                      <p className={`${isFullAdmin ? 'text-purple-100' : 'text-blue-100'} font-medium`}>
                        {isFullAdmin ? 'Full Administrator Access' : 'View-Only Access'}
                      </p>
                      <p className={`${isFullAdmin ? 'text-purple-200' : 'text-blue-200'} text-sm`}>
                        {isFullAdmin 
                          ? 'Complete financial management capabilities' 
                          : 'Financial data viewing only'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-blue-500/20 backdrop-blur-sm rounded-lg p-4 inline-block">
                  <div className="flex items-center space-x-3">
                    <Eye className="h-6 w-6 text-blue-300" />
                    <div>
                      <p className="text-blue-100 font-medium">Public View Mode</p>
                      <p className="text-blue-200 text-sm">Financial data visible • Admin login for management</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Access Restriction Notice for Announcement Admins */}
      {isAuthenticated && !isFullAdmin && userRole === 'announcement_admin' && (
        <div className="bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-3">
              <Ban className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                  Financial Management Access Restricted
                </p>
                <p className="text-xs text-red-700 dark:text-red-300">
                  You have announcement admin privileges only. All financial management features are restricted to full administrators. You can only view financial data.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Year Selection */}
      <section className="py-8 bg-white dark:bg-gray-800 border-b dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0">Financial Overview</h2>
            <div className="flex items-center space-x-4">
              <label htmlFor="year-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Select Year:
              </label>
              <select
                id="year-select"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Financial Images */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FinancialImages />
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Financial Overview - Pass isFullAdmin to restrict editing */}
            <FinancialOverview selectedYear={selectedYear} />
            
            {/* Monthly Report - Pass isFullAdmin to restrict admin features */}
            <MonthlyReport selectedYear={selectedYear} />
            
            {/* Financial Data Sections - Now visible to all users but editing restricted */}
            <ContributionsSection />
            <DonationsSection />
            <ExpensesSection />
          </div>
          
          {/* Right Column */}
          <div className="space-y-8">
            {/* Bank Account Details */}
            <BankAccountDetails />
            
            {/* Quick Actions - Completely restricted for announcement admins */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {isFullAdmin ? (
                  <>
                    <Link
                      to="/monthly-dues-record"
                      className="flex items-center space-x-3 w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Users className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-gray-900 dark:text-white">Monthly Dues Record</span>
                    </Link>
                    <button className="flex items-center space-x-3 w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <FileText className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-gray-900 dark:text-white">Generate Report</span>
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center space-x-3 w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-600 opacity-50 bg-gray-50 dark:bg-gray-700">
                      <Users className="h-5 w-5 text-gray-400" />
                      <div>
                        <span className="font-medium text-gray-500">Monthly Dues Record</span>
                        <p className="text-xs text-gray-400">Full Admin Only</p>
                      </div>
                      <Lock className="h-4 w-4 text-gray-400 ml-auto" />
                    </div>
                    <div className="flex items-center space-x-3 w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-600 opacity-50 bg-gray-50 dark:bg-gray-700">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <div>
                        <span className="font-medium text-gray-500">Generate Report</span>
                        <p className="text-xs text-gray-400">Full Admin Only</p>
                      </div>
                      <Lock className="h-4 w-4 text-gray-400 ml-auto" />
                    </div>
                  </>
                )}
              </div>
              
              {/* Additional restriction notice for announcement admins */}
              {isAuthenticated && !isFullAdmin && userRole === 'announcement_admin' && (
                <div className="mt-4 bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-700">
                  <div className="flex items-center space-x-2">
                    <Ban className="h-4 w-4 text-red-600" />
                    <div>
                      <p className="text-xs font-medium text-red-800 dark:text-red-200">
                        Financial Management Restricted
                      </p>
                      <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                        Your access is limited to announcements only. Financial features require full admin privileges.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Enhanced Year Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{selectedYear} Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <ArrowUpCircle className="h-4 w-4 text-indigo-600" />
                    <span className="text-gray-600 dark:text-gray-300">Balance B/F</span>
                  </div>
                  <span className="font-semibold text-indigo-600">₦{yearlyTotals.balanceBroughtForward.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Current Year Income</span>
                  <span className="font-semibold text-blue-600">₦{(yearlyTotals.totalIncome - yearlyTotals.balanceBroughtForward).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Total Income</span>
                  <span className="font-semibold text-green-600">₦{yearlyTotals.totalIncome.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Total Expenses</span>
                  <span className="font-semibold text-red-600">₦{yearlyTotals.totalExpenses.toLocaleString()}</span>
                </div>
                <div className="border-t dark:border-gray-600 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-900 dark:text-white font-medium">Net Balance</span>
                    <span className={`font-bold ${yearlyTotals.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ₦{yearlyTotals.balance.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Access Information Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                {isAuthenticated ? (
                  isFullAdmin ? (
                    <Crown className="h-5 w-5 mr-2 text-purple-600" />
                  ) : (
                    <Shield className="h-5 w-5 mr-2 text-blue-600" />
                  )
                ) : (
                  <Eye className="h-5 w-5 mr-2 text-blue-600" />
                )}
                Access Information
              </h3>
              
              {isAuthenticated ? (
                <div className="space-y-3">
                  <div className={`flex items-center space-x-2 ${isFullAdmin ? 'text-purple-700 dark:text-purple-300' : 'text-blue-700 dark:text-blue-300'}`}>
                    <div className={`w-2 h-2 ${isFullAdmin ? 'bg-purple-500' : 'bg-blue-500'} rounded-full`}></div>
                    <span className="text-sm font-medium">
                      {isFullAdmin ? 'Full administrator privileges active' : 'Limited access - View-only mode'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <p className="mb-2">You have access to:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>View all financial records and reports</li>
                      <li>Access monthly and yearly summaries</li>
                      <li>View contributions, donations, and expenses</li>
                      <li>Access bank account details for payments</li>
                      {isFullAdmin ? (
                        <>
                          <li className="text-purple-600 dark:text-purple-400">✓ Add, edit, delete financial records</li>
                          <li className="text-purple-600 dark:text-purple-400">✓ Manage member dues and payments</li>
                          <li className="text-purple-600 dark:text-purple-400">✓ Generate and export reports</li>
                          <li className="text-purple-600 dark:text-purple-400">✓ Access monthly dues record</li>
                          <li className="text-purple-600 dark:text-purple-400">✓ Modify balance brought forward</li>
                        </>
                      ) : (
                        <>
                          <li className="text-red-500 dark:text-red-400">✗ Financial record management (Restricted)</li>
                          <li className="text-red-500 dark:text-red-400">✗ Member dues management (Restricted)</li>
                          <li className="text-red-500 dark:text-red-400">✗ Monthly dues record access (Restricted)</li>
                          <li className="text-red-500 dark:text-red-400">✗ Report generation (Restricted)</li>
                          <li className="text-red-500 dark:text-red-400">✗ Balance modifications (Restricted)</li>
                        </>
                      )}
                    </ul>
                    
                    {/* Special notice for announcement admins */}
                    {userRole === 'announcement_admin' && (
                      <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          <div>
                            <p className="text-xs font-medium text-yellow-800 dark:text-yellow-200">
                              Announcement Admin Notice
                            </p>
                            <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                              Your administrative privileges are limited to announcements and updates only. Financial management requires full administrator access.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-300">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium">Public view mode</span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <p className="mb-2">You can view:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Financial summaries and reports</li>
                      <li>Contributions and donations records</li>
                      <li>Expense information</li>
                      <li>Bank account details for payments</li>
                      <li>Monthly and yearly overviews</li>
                    </ul>
                    <p className="mt-3 text-xs text-blue-600 dark:text-blue-400">
                      💡 Login as full administrator via Settings (⚙️) for management access
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Finance;