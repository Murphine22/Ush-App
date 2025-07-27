import React, { useState } from 'react';
import { Building, Copy, Check, CreditCard, Shield, Clock, Smartphone } from 'lucide-react';

const BankAccountDetails = () => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const accountDetails = {
    bankName: 'Standard Chartered Bank',
    accountName: 'Arome and Rosemary',
    accountNumber: '0004926342',
    accountType: 'Current Account'
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const paymentMethods = [
    { icon: <Smartphone className="h-5 w-5" />, name: 'Mobile Transfer', color: 'text-blue-600' },
    { icon: <CreditCard className="h-5 w-5" />, name: 'Online Banking', color: 'text-green-600' },
    { icon: <Building className="h-5 w-5" />, name: 'Bank Branch', color: 'text-purple-600' }
  ];

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-3 rounded-xl shadow-lg">
            <Building className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Payment Details</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Secure bank transfer</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">
          <Shield className="h-4 w-4 text-green-600" />
          <span className="text-xs font-medium text-green-700 dark:text-green-400">Verified</span>
        </div>
      </div>
      
      {/* Monthly Dues Alert */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 mb-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-lg">Monthly Dues</p>
              <p className="text-blue-100 text-sm">Pay ₦500 monthly</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">₦500</p>
              <p className="text-blue-100 text-xs">per month</p>
            </div>
          </div>
        </div>
      </div>

      {/* Account Details Cards */}
      <div className="space-y-3 mb-6">
        {/* Bank Name */}
        <div className="group bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-md">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Bank Name</p>
              <p className="font-bold text-gray-900 dark:text-white text-lg">{accountDetails.bankName}</p>
            </div>
            <button
              onClick={() => copyToClipboard(accountDetails.bankName, 'bankName')}
              className="ml-3 p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-300 group-hover:scale-110"
            >
              {copiedField === 'bankName' ? 
                <Check className="h-4 w-4 text-green-600" /> : 
                <Copy className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              }
            </button>
          </div>
        </div>

        {/* Account Name */}
        <div className="group bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-md">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Account Name</p>
              <p className="font-bold text-gray-900 dark:text-white text-lg">{accountDetails.accountName}</p>
            </div>
            <button
              onClick={() => copyToClipboard(accountDetails.accountName, 'accountName')}
              className="ml-3 p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-300 group-hover:scale-110"
            >
              {copiedField === 'accountName' ? 
                <Check className="h-4 w-4 text-green-600" /> : 
                <Copy className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              }
            </button>
          </div>
        </div>

        {/* Account Number - Highlighted */}
        <div className="group bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 border-2 border-blue-200 dark:border-blue-600 hover:border-blue-400 dark:hover:border-blue-400 transition-all duration-300 hover:shadow-lg">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">Account Number</p>
              <p className="font-bold text-gray-900 dark:text-white text-2xl tracking-wider">{accountDetails.accountNumber}</p>
            </div>
            <button
              onClick={() => copyToClipboard(accountDetails.accountNumber, 'accountNumber')}
              className="ml-3 p-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition-all duration-300 group-hover:scale-110 shadow-lg"
            >
              {copiedField === 'accountNumber' ? 
                <Check className="h-5 w-5 text-white" /> : 
                <Copy className="h-5 w-5 text-white" />
              }
            </button>
          </div>
        </div>

        {/* Account Type */}
        <div className="group bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-md">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Account Type</p>
              <p className="font-bold text-gray-900 dark:text-white text-lg">{accountDetails.accountType}</p>
            </div>
            <button
              onClick={() => copyToClipboard(accountDetails.accountType, 'accountType')}
              className="ml-3 p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-300 group-hover:scale-110"
            >
              {copiedField === 'accountType' ? 
                <Check className="h-4 w-4 text-green-600" /> : 
                <Copy className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="mb-6">
        <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center">
          <Clock className="h-4 w-4 mr-2 text-blue-600" />
          Payment Methods
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {paymentMethods.map((method, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-600 text-center hover:shadow-md transition-all duration-300 hover:scale-105">
              <div className={`${method.color} mb-2 flex justify-center`}>
                {method.icon}
              </div>
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{method.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Important Note */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <div className="bg-amber-500 p-1 rounded-full flex-shrink-0 mt-0.5">
            <Clock className="h-3 w-3 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-1">Payment Reference</p>
            <p className="text-xs text-amber-700 dark:text-amber-300">
              Please include your <strong>full name</strong> in the payment reference for easy identification and faster processing.
            </p>
          </div>
        </div>
      </div>

      {/* Copy Success Feedback */}
      {copiedField && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce-in">
          <div className="flex items-center space-x-2">
            <Check className="h-4 w-4" />
            <span className="text-sm font-medium">Copied to clipboard!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BankAccountDetails;