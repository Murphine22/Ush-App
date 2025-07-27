import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../context/AuthContext';
import { Calendar, TrendingUp, TrendingDown, DollarSign, Printer, Download, Share, Lock, Ban } from 'lucide-react';

interface MonthlyReportProps {
  selectedYear: number;
}

const MonthlyReport = ({ selectedYear }: MonthlyReportProps) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const { getMonthlyReport } = useFinance();
  const { isFullAdmin, userRole } = useAuth();
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const report = getMonthlyReport(selectedYear, selectedMonth);

  const handlePrintReport = () => {
    if (!isFullAdmin) return; // Prevent announcement admins from printing
    
    const printContent = document.getElementById('monthly-report-content');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Monthly Report - ${months[selectedMonth]} ${selectedYear}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .header h1 { color: #1e40af; margin-bottom: 5px; }
                .header h2 { color: #374151; margin-bottom: 10px; }
                .header p { color: #6b7280; }
                .report-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 20px 0; }
                .report-card { background: #f9fafb; padding: 20px; border-radius: 8px; text-align: center; }
                .report-card h3 { color: #374151; margin-bottom: 10px; }
                .report-card .amount { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
                .income { color: #059669; }
                .expense { color: #dc2626; }
                .balance { color: #1e40af; }
                .summary { margin-top: 30px; padding: 20px; background-color: #f9fafb; border-radius: 8px; }
                .summary h3 { color: #1e40af; margin-bottom: 15px; }
                .summary-item { display: flex; justify-content: space-between; margin-bottom: 10px; padding: 5px 0; border-bottom: 1px solid #e5e7eb; }
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
                <h2>Monthly Financial Report</h2>
                <p>${months[selectedMonth]} ${selectedYear} - Generated on ${new Date().toLocaleDateString()}</p>
              </div>
              ${printContent.outerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const handleDownloadReport = () => {
    if (!isFullAdmin) return; // Prevent announcement admins from downloading
    
    const csvContent = [
      ['DIGC Ushering Department - Monthly Report'],
      [`${months[selectedMonth]} ${selectedYear}`],
      [''],
      ['Category', 'Amount (₦)'],
      ['Monthly Dues', report.monthlyDues],
      ['Contributions', report.contributions],
      ['Donations', report.donations],
      ['Total Income', report.income],
      ['Total Expenses', report.expenses],
      ['Net Balance', report.balance]
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `monthly-report-${months[selectedMonth].toLowerCase()}-${selectedYear}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleShareReport = async () => {
    if (!isFullAdmin) return; // Prevent announcement admins from sharing
    
    const reportText = `DIGC Ushering Department Monthly Report - ${months[selectedMonth]} ${selectedYear}\n\nTotal Income: ₦${report.income.toLocaleString()}\nTotal Expenses: ₦${report.expenses.toLocaleString()}\nNet Balance: ₦${report.balance.toLocaleString()}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Monthly Report - ${months[selectedMonth]} ${selectedYear}`,
          text: reportText,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(reportText);
      alert('Report details copied to clipboard!');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <Calendar className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Monthly Report</h3>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            {months.map((month, index) => (
              <option key={index} value={index}>{month}</option>
            ))}
          </select>
          
          {/* Admin-only action buttons */}
          {isFullAdmin ? (
            <div className="flex space-x-2">
              <button
                onClick={handlePrintReport}
                className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-all duration-300 flex items-center space-x-1 text-sm transform hover:scale-105"
              >
                <Printer className="h-4 w-4" />
                <span>Print</span>
              </button>
              
              <button
                onClick={handleDownloadReport}
                className="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-all duration-300 flex items-center space-x-1 text-sm transform hover:scale-105"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
              
              <button
                onClick={handleShareReport}
                className="bg-orange-600 text-white px-3 py-2 rounded-lg hover:bg-orange-700 transition-all duration-300 flex items-center space-x-1 text-sm transform hover:scale-105"
              >
                <Share className="h-4 w-4" />
                <span>Share</span>
              </button>
            </div>
          ) : userRole === 'announcement_admin' ? (
            <div className="flex items-center space-x-2 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg border border-red-200 dark:border-red-700">
              <Ban className="h-4 w-4 text-red-600" />
              <span className="text-xs text-red-700 dark:text-red-300">Actions Restricted</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg">
              <Lock className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Admin Only</span>
            </div>
          )}
        </div>
      </div>

      <div id="monthly-report-content">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Total Income</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">₦{report.income.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center space-x-3">
              <TrendingDown className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-400">Total Expenses</p>
                <p className="text-2xl font-bold text-red-900 dark:text-red-100">₦{report.expenses.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center space-x-3">
              <DollarSign className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Net Balance</p>
                <p className={`text-2xl font-bold ${report.balance >= 0 ? 'text-blue-900 dark:text-blue-100' : 'text-red-900 dark:text-red-100'}`}>
                  ₦{report.balance.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4 text-lg">
            {months[selectedMonth]} {selectedYear} Detailed Summary
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
              <span className="text-gray-600 dark:text-gray-300 font-medium">Monthly Dues Collected</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">₦{report.monthlyDues.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
              <span className="text-gray-600 dark:text-gray-300">Special Contributions</span>
              <span className="font-semibold text-green-600 dark:text-green-400">₦{report.contributions.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
              <span className="text-gray-600 dark:text-gray-300">Donations Received</span>
              <span className="font-semibold text-purple-600 dark:text-purple-400">₦{report.donations.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
              <span className="text-gray-600 dark:text-gray-300 font-medium">Total Income</span>
              <span className="font-bold text-green-600 dark:text-green-400 text-lg">₦{report.income.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
              <span className="text-gray-600 dark:text-gray-300">Department Expenses</span>
              <span className="font-semibold text-red-600 dark:text-red-400">₦{report.expenses.toLocaleString()}</span>
            </div>
            <div className="border-t-2 border-gray-300 dark:border-gray-600 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900 dark:text-white">Net Balance</span>
                <span className={`text-xl font-bold ${report.balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  ₦{report.balance.toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 text-right">
                {report.balance >= 0 ? 'Surplus for the month' : 'Deficit for the month'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Access restriction notice for announcement admins */}
      {userRole === 'announcement_admin' && (
        <div className="mt-6 bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-700">
          <div className="flex items-center space-x-3">
            <Ban className="h-5 w-5 text-red-600" />
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-200">Report Management Restricted</p>
              <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                You can view monthly reports but cannot print, export, or share them. These features require full administrator privileges.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Non-admin message for public users */}
      {!isFullAdmin && userRole !== 'announcement_admin' && (
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
          <div className="flex items-center space-x-3">
            <Lock className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Administrator Access Required</p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                Print, export, and share functionality is available to administrators only. Please log in via the Settings button to access these features.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyReport;