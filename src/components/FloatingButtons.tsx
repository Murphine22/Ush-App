import React, { useState } from 'react';
import { MessageCircle, Bot, Settings, HelpCircle, X, Phone, Mail, Lock, Loader2, Send, User, Calendar, DollarSign, Users, FileText, TrendingUp, Gift, Receipt, Building, Star, Shield, Crown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFinance } from '../context/FinanceContext';
import SupportPage from '../pages/Support';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  message: string;
  timestamp: Date;
}

const FloatingButtons = () => {
  const [showSupport, setShowSupport] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '', accessLevel: 'announcement_admin' as 'announcement_admin' | 'full_admin' });
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      message: 'Hello! I\'m your DIGC Ushering Department AI Assistant. I can help you with information about members, monthly records, financial summaries, and everything about our department. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const { isAuthenticated, isAnnouncementAdmin, isFullAdmin, login, logout, loading, userRole, userEmail } = useAuth();
  const { members, getYearlyTotals, getMonthlyReport, getTotalMemberCount } = useFinance();

  const handleWhatsApp = () => {
    window.open('https://chat.whatsapp.com/CSPnPAoDbRMDvr5JQ6d4po', '_blank');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    
    try {
      const success = await login(loginData.email, loginData.password, loginData.accessLevel);
      if (success) {
        setShowLoginModal(false);
        setShowSettings(false);
        setLoginData({ email: '', password: '', accessLevel: 'announcement_admin' });
      } else {
        setLoginError('Invalid credentials for the selected access level');
      }
    } catch (error) {
      setLoginError('An error occurred during login. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setShowSettings(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSupportClick = () => {
    setShowSupport(true);
  };

  const handleAccessLevelChange = (level: 'announcement_admin' | 'full_admin') => {
    setLoginData(prev => ({ ...prev, accessLevel: level }));
    
    // Auto-fill email based on access level
    if (level === 'announcement_admin') {
      setLoginData(prev => ({ ...prev, email: 'digcusheringdepartment@gmail.com', password: '' }));
    } else {
      setLoginData(prev => ({ ...prev, email: 'elishaejimofor@gmail.com', password: '' }));
    }
    setLoginError('');
  };

  const generateBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const yearlyTotals = getYearlyTotals(currentYear);
    const monthlyReport = getMonthlyReport(currentYear, currentMonth);
    const totalMembers = getTotalMemberCount();

    // Enhanced member-related queries with detailed information
    if (message.includes('member') || message.includes('how many')) {
      if (message.includes('total') || message.includes('count') || message.includes('how many')) {
        const paidThisMonth = members.reduce((count, member) => 
          count + (member.payments[currentMonth] ? 1 : 0), 0
        );
        const totalPaidThisYear = members.reduce((total, member) => 
          total + member.payments.filter(Boolean).length, 0
        );
        
        return `📊 **Member Statistics:**\n\n👥 **Total Active Members:** ${totalMembers}\n💰 **Paid This Month:** ${paidThisMonth} members\n📅 **Total Payments This Year:** ${totalPaidThisYear} payments\n💵 **Average Payment Rate:** ${totalMembers > 0 ? Math.round((totalPaidThisYear / (totalMembers * 12)) * 100) : 0}%\n\n🏢 **Department Structure:**\n• 8 Specialized Units\n• Each member pays ₦500 monthly\n• Organized leadership structure\n• Regular training programs`;
      }
      
      if (message.includes('list') || message.includes('names')) {
        const memberList = members.slice(0, 10).map((member, index) => {
          const paidMonths = member.payments.filter(Boolean).length;
          const status = paidMonths >= 6 ? '✅' : paidMonths >= 3 ? '⚠️' : '❌';
          return `${index + 1}. ${member.name} ${status} (${paidMonths}/12 months)`;
        }).join('\n');
        
        return `👥 **Member List** (Top 10):\n\n${memberList}\n\n${totalMembers > 10 ? `\n...and ${totalMembers - 10} more members` : ''}\n\n**Legend:**\n✅ Good standing (6+ months)\n⚠️ Partial payment (3-5 months)\n❌ Needs attention (<3 months)`;
      }
      
      return `👥 **Member Overview:**\n\n**Total Members:** ${totalMembers}\n**Department Units:** 8 specialized units\n**Monthly Dues:** ₦500 per member\n**Payment Structure:** Monthly contributions\n\n**Member Categories:**\n🏆 Unit Heads & Assistants\n👥 Active serving members\n🆕 New members in training\n\nEach member is assigned to one of our 8 units: Welfare, Accounts, Training, Secretariat, Prayer, Visitation, Uniform, and Technical.`;
    }

    // Enhanced financial queries with detailed breakdowns
    if (message.includes('finance') || message.includes('money') || message.includes('dues') || message.includes('payment')) {
      if (message.includes('monthly') || message.includes('dues')) {
        const expectedMonthly = totalMembers * 500;
        const collectionRate = expectedMonthly > 0 ? Math.round((monthlyReport.monthlyDues / expectedMonthly) * 100) : 0;
        
        return `💰 **Monthly Dues Analysis:**\n\n📅 **This Month (${new Date().toLocaleDateString('en-US', { month: 'long' })}):**\n• Collected: ₦${monthlyReport.monthlyDues.toLocaleString()}\n• Expected: ₦${expectedMonthly.toLocaleString()}\n• Collection Rate: ${collectionRate}%\n\n📊 **${currentYear} Total Dues:**\n• Total Collected: ₦${yearlyTotals.monthlyDues.toLocaleString()}\n• Expected Annual: ₦${(totalMembers * 500 * 12).toLocaleString()}\n\n💡 **Payment Details:**\n• Amount: ₦500 per member\n• Frequency: Monthly\n• Bank: Standard Chartered Bank\n• Account: Arome and Rosemary`;
      }
      
      if (message.includes('total') || message.includes('summary')) {
        return `📊 **Complete Financial Summary (${currentYear}):**\n\n💰 **INCOME BREAKDOWN:**\n• Balance B/F: ₦${yearlyTotals.balanceBroughtForward.toLocaleString()}\n• Monthly Dues: ₦${yearlyTotals.monthlyDues.toLocaleString()}\n• Contributions: ₦${yearlyTotals.contributions.toLocaleString()}\n• Donations: ₦${yearlyTotals.donations.toLocaleString()}\n• **Total Income: ₦${yearlyTotals.totalIncome.toLocaleString()}**\n\n💸 **EXPENSES:**\n• Total Expenses: ₦${yearlyTotals.totalExpenses.toLocaleString()}\n\n📈 **NET POSITION:**\n• **Current Balance: ₦${yearlyTotals.balance.toLocaleString()}**\n• Status: ${yearlyTotals.balance >= 0 ? '✅ Surplus' : '⚠️ Deficit'}\n\n📊 **Key Metrics:**\n• Members: ${totalMembers}\n• Avg. Monthly Income: ₦${Math.round(yearlyTotals.totalIncome / 12).toLocaleString()}`;
      }
      
      if (message.includes('bank') || message.includes('account')) {
        return `🏦 **Payment Information:**\n\n**Bank Details:**\n• Bank: Standard Chartered Bank\n• Account Name: Arome and Rosemary\n• Account Number: 0004926342\n• Account Type: Current Account\n\n💰 **Payment Instructions:**\n• Monthly Dues: ₦500\n• Include your full name in reference\n• Payment methods: Mobile transfer, Online banking, Branch visit\n\n📱 **Quick Payment:**\n• Mobile Banking: Use account number\n• USSD: *822*0004926342*500#\n• Branch: Visit any Standard Chartered branch`;
      }
      
      return `💰 **Financial Overview:**\n\nOur department maintains transparent financial records with monthly reporting. Members contribute ₦500 monthly, and we receive additional contributions and donations for special projects.\n\n**Current Status:**\n• Total Income: ₦${yearlyTotals.totalIncome.toLocaleString()}\n• Net Balance: ₦${yearlyTotals.balance.toLocaleString()}\n• Active Members: ${totalMembers}\n\nAll financial activities are recorded and available for review by members.`;
    }

    // Enhanced monthly records with detailed analytics
    if (message.includes('monthly') || message.includes('record') || message.includes('this month')) {
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const currentMonthName = monthNames[currentMonth];
      const paidThisMonth = members.reduce((count, member) => 
        count + (member.payments[currentMonth] ? 1 : 0), 0
      );
      const unpaidThisMonth = totalMembers - paidThisMonth;
      
      return `📅 **${currentMonthName} ${currentYear} Detailed Report:**\n\n💰 **FINANCIAL SUMMARY:**\n• Monthly Dues: ₦${monthlyReport.monthlyDues.toLocaleString()}\n• Contributions: ₦${monthlyReport.contributions.toLocaleString()}\n• Donations: ₦${monthlyReport.donations.toLocaleString()}\n• Total Income: ₦${monthlyReport.income.toLocaleString()}\n• Expenses: ₦${monthlyReport.expenses.toLocaleString()}\n• **Net Balance: ₦${monthlyReport.balance.toLocaleString()}**\n\n👥 **MEMBER PAYMENTS:**\n• Paid: ${paidThisMonth} members\n• Unpaid: ${unpaidThisMonth} members\n• Payment Rate: ${totalMembers > 0 ? Math.round((paidThisMonth / totalMembers) * 100) : 0}%\n\n📊 **PERFORMANCE:**\n• Status: ${monthlyReport.balance >= 0 ? '✅ Positive' : '⚠️ Deficit'}\n• vs Last Month: ${monthlyReport.income > monthlyReport.expenses ? '📈 Improved' : '📉 Needs attention'}`;
    }

    // Enhanced year summary with trends and projections
    if (message.includes('year') || message.includes('annual') || message.includes('yearly')) {
      const avgMonthlyIncome = yearlyTotals.totalIncome / 12;
      const avgMonthlyExpenses = yearlyTotals.totalExpenses / 12;
      const projectedYearEnd = yearlyTotals.balance + (avgMonthlyIncome - avgMonthlyExpenses) * (12 - new Date().getMonth() - 1);
      
      return `📊 **${currentYear} Annual Performance Dashboard:**\n\n💰 **FINANCIAL OVERVIEW:**\n• Opening Balance: ₦${yearlyTotals.balanceBroughtForward.toLocaleString()}\n• Total Income: ₦${yearlyTotals.totalIncome.toLocaleString()}\n• Total Expenses: ₦${yearlyTotals.totalExpenses.toLocaleString()}\n• **Current Position: ₦${yearlyTotals.balance.toLocaleString()}**\n\n📈 **PERFORMANCE METRICS:**\n• Avg Monthly Income: ₦${Math.round(avgMonthlyIncome).toLocaleString()}\n• Avg Monthly Expenses: ₦${Math.round(avgMonthlyExpenses).toLocaleString()}\n• Net Monthly Avg: ₦${Math.round(avgMonthlyIncome - avgMonthlyExpenses).toLocaleString()}\n\n🎯 **PROJECTIONS:**\n• Projected Year-end: ₦${Math.round(projectedYearEnd).toLocaleString()}\n• Growth Rate: ${yearlyTotals.balanceBroughtForward > 0 ? Math.round(((yearlyTotals.balance - yearlyTotals.balanceBroughtForward) / yearlyTotals.balanceBroughtForward) * 100) : 'N/A'}%\n\n👥 **MEMBERSHIP:**\n• Active Members: ${totalMembers}\n• Department Units: 8`;
    }

    // Enhanced services and units information
    if (message.includes('service') || message.includes('unit') || message.includes('department')) {
      return `🏢 **DIGC Ushering Department Structure:**\n\n**8 SPECIALIZED UNITS:**\n\n💝 **Welfare Unit**\n• Head: Bro. Abraham (+234 803 634 7730)\n• Assistant: Sis. Juliet (+234 806 735 2573)\n• Focus: Member support & assistance programs\n\n💼 **Accounts Unit**\n• Head: Bro. Ojeifo Kenneth (+234 803 629 9913)\n• Assistant: Sis. Christy Osuagwu (+234 703 493 7183)\n• Focus: Financial management & reporting\n\n📚 **Training Unit**\n• Head: Bro. John Amara (+234 803 626 5630)\n• Assistant: Sis. Ige (+234 803 315 5759)\n• Focus: Skill development & capacity building\n\n📋 **Secretariat Unit**\n• Head: Bro. Uche Nworie (+234 803 781 2417)\n• Assistant: Sis. Henry (+234 803 436 1731)\n• Focus: Documentation & administrative duties\n\n🙏 **Prayer Unit**\n• Head: Bro. Sunday (+234 814 910 6700)\n• Assistant: Sis. Charity (+234 814 828 3663)\n• Focus: Spiritual support & prayer coordination\n\n👁️ **Visitation Unit**\n• Head: Bro. Harrison (+234 803 361 2530)\n• Assistant: Sis. Elizabeth (+234 805 658 1982)\n• Focus: Member outreach & visitation programs\n\n👔 **Uniform Unit**\n• Head: Bro. Tony (+234 803 651 6964)\n• Assistant: Sis. Maureen (+234 806 461 5882)\n• Focus: Uniform distribution & maintenance\n\n💻 **Technical Unit**\n• Head: Bro. Odion (+234 810 494 2027)\n• Assistant: Sis. Faith (+234 805 583 9341)\n• Focus: Technical support & equipment management`;
    }

    // Enhanced contact and support information
    if (message.includes('contact') || message.includes('phone') || message.includes('email') || message.includes('support')) {
      return `📞 **Complete Contact Directory:**\n\n👨‍💼 **LEADERSHIP:**\n• Head of Department: Engr Abraham Oshiomah\n• Phone: +234 803 634 7730\n• Location: DIGC Headquarters\n\n🏢 **DEPARTMENT CONTACTS:**\n• Emergency Line: +234 803 781 2417\n• Email: digcusheringdepartment@gmail.com\n• WhatsApp Group: Available via floating button\n• Location: Dunamis HQ, Abuja\n• Availability: 24/7 Support\n\n📱 **QUICK CONTACT OPTIONS:**\n• Voice Call: Direct phone calls\n• SMS: Text messaging\n• WhatsApp: Group chat available\n• Email: Official correspondence\n• In-Person: Visit during service times\n\n🆘 **EMERGENCY CONTACTS:**\n• Primary: +234 803 781 2417\n• Secondary: +234 803 634 7730\n• For urgent matters: Call immediately\n• For general inquiries: Use email or WhatsApp\n\n💡 **BEST CONTACT TIMES:**\n• Weekdays: 9 AM - 5 PM\n• Sundays: Before/after service\n• Emergency: Anytime 24/7`;
    }

    // Enhanced about and mission information
    if (message.includes('about') || message.includes('mission') || message.includes('vision') || message.includes('what')) {
      return `🏛️ **About DIGC Ushering Department:**\n\n**OUR MISSION:**\nTo create a welcoming and orderly worship environment while serving with excellence, walking in love, and growing in faith.\n\n**OUR VISION:**\nTo be a model ushering department that sets the standard for excellence in hospitality ministry, creating an atmosphere where every person experiences the love of Christ.\n\n🎯 **CORE VALUES:**\n• **Excellence** - Highest standards in service\n• **Integrity** - Honesty and transparency\n• **Unity** - Working as one body\n• **Compassion** - Genuine care for all\n• **Faithfulness** - Steadfast commitment\n• **Innovation** - Embracing new methods\n• **Partnership** - Collaborative ministry\n\n📈 **ACHIEVEMENTS:**\n• ${totalMembers} dedicated members\n• 8 specialized units\n• Transparent financial management\n• Regular training programs\n• 24/7 support system\n• Strong leadership structure\n\n🎯 **OUR SERVICES:**\n• Warm welcome & orientation\n• Guidance & assistance\n• Event coordination\n• Accessibility support\n• Community connection\n• Pastoral care support`;
    }

    // Enhanced training and development information
    if (message.includes('training') || message.includes('development') || message.includes('learn')) {
      return `📚 **Comprehensive Training & Development Program:**\n\n**CORE TRAINING MODULES:**\n\n🎯 **Customer Service Excellence**\n• Monthly training sessions\n• Practical workshops\n• Role-playing exercises\n• Service standards\n• Conflict resolution\n\n🙏 **Spiritual Development**\n• Leadership workshops\n• Biblical foundations\n• Prayer training\n• Character development\n• Ministry ethics\n\n📅 **Event Management**\n• Coordination skills\n• Crowd control\n• Emergency procedures\n• Communication protocols\n• Team leadership\n\n👥 **New Member Program**\n• Orientation sessions\n• Mentorship pairing\n• Department overview\n• Unit assignments\n• Gradual integration\n\n📊 **TRAINING SCHEDULE:**\n• Monthly department meetings\n• Quarterly skill workshops\n• Annual leadership retreat\n• Ongoing mentorship\n• Special event training\n\n🏆 **CERTIFICATION LEVELS:**\n• Basic Member\n• Unit Assistant\n• Unit Head\n• Department Leadership\n\n💡 **DEVELOPMENT OPPORTUNITIES:**\n• Leadership roles\n• Special project assignments\n• Inter-unit collaboration\n• External training programs`;
    }

    // Enhanced events and activities information
    if (message.includes('event') || message.includes('activity') || message.includes('schedule')) {
      return `📅 **Department Events & Activities Calendar:**\n\n⛪ **REGULAR ACTIVITIES:**\n• Sunday worship services\n• Wednesday prayer meetings\n• Friday night services\n• Special church programs\n• Monthly department meetings\n\n🎉 **SPECIAL EVENTS:**\n• Annual conferences\n• Leadership retreats\n• Training workshops\n• Fellowship gatherings\n• Community outreach\n• Fundraising activities\n\n📋 **MONTHLY SCHEDULE:**\n• 1st Sunday: Department meeting\n• 2nd Sunday: Unit meetings\n• 3rd Sunday: Training session\n• 4th Sunday: Fellowship time\n• Weekdays: Special assignments\n\n🎯 **UPCOMING ACTIVITIES:**\n• Check announcements section\n• WhatsApp group updates\n• Email notifications\n• Notice board updates\n\n📊 **ANNUAL EVENTS:**\n• Department anniversary\n• Leadership installation\n• Awards ceremony\n• Year-end celebration\n• Planning retreat\n\n💡 **PARTICIPATION:**\n• All members encouraged\n• Unit-specific activities\n• Voluntary special projects\n• Leadership development\n• Community service`;
    }

    // Enhanced joining information
    if (message.includes('join') || message.includes('become') || message.includes('member') || message.includes('how to')) {
      return `🤝 **Join the DIGC Ushering Department:**\n\n**STEP-BY-STEP PROCESS:**\n\n1️⃣ **Express Interest**\n• Contact any unit head\n• Speak with Acting Leader\n• Visit during service\n• Call: +234 803 786 5842\n\n2️⃣ **Orientation Program**\n• Department overview\n• Values and mission\n• Service expectations\n• Unit introductions\n\n3️⃣ **Registration**\n• Complete membership form\n• Provide contact details\n• Emergency contacts\n• Unit preference\n\n4️⃣ **Training Program**\n• Basic service training\n• Department procedures\n• Communication protocols\n• Spiritual foundation\n\n5️⃣ **Unit Assignment**\n• Based on skills/interest\n• Mentorship pairing\n• Gradual responsibilities\n• Regular evaluation\n\n💰 **FINANCIAL COMMITMENT:**\n• Monthly dues: ₦500\n• Payment methods available\n• Financial assistance if needed\n• Transparent usage\n\n🎯 **REQUIREMENTS:**\n• Born-again Christian\n• Regular church attendance\n• Commitment to service\n• Team player attitude\n• Willingness to learn\n\n📞 **CONTACT FOR JOINING:**\n• Deacon Chinedu: +234 803 786 5842\n• Email: digcusheringdepartment@gmail.com\n• Visit: Sundays after service\n• WhatsApp: Available via button`;
    }

    // Default responses for common greetings and general queries
    if (message.includes('hello') || message.includes('hi') || message.includes('good')) {
      return `👋 **Hello and Welcome!**\n\nI'm your DIGC Ushering Department AI Assistant, equipped with comprehensive information about our ministry.\n\n**I can help you with:**\n• 👥 Member information and statistics\n• 💰 Financial records and analysis\n• 📊 Monthly and yearly reports\n• 🏢 Department services and units\n• 📞 Contact information\n• 🎯 Training and development\n• 📅 Events and activities\n• 💳 Payment details and procedures\n• 🤝 How to join our department\n\n**Quick Start:**\nTry asking "How many members?" or "Financial summary" or click the quick question buttons above!\n\nWhat would you like to know about our department?`;
    }

    if (message.includes('help') || message.includes('assist')) {
      return `🆘 **AI Assistant Help Guide:**\n\n**I'M YOUR COMPREHENSIVE RESOURCE FOR:**\n\n👥 **MEMBER INFORMATION:**\n• Total member count\n• Member list and status\n• Payment records\n• Unit assignments\n\n💰 **FINANCIAL DATA:**\n• Monthly dues collection\n• Annual financial summaries\n• Budget and expenses\n• Payment procedures\n\n📊 **REPORTS & ANALYTICS:**\n• Monthly performance reports\n• Yearly trend analysis\n• Collection rates\n• Financial projections\n\n🏢 **DEPARTMENT SERVICES:**\n• 8 specialized units\n• Leadership contacts\n• Service descriptions\n• Training programs\n\n📞 **CONTACT DIRECTORY:**\n• Leadership contacts\n• Unit head information\n• Emergency numbers\n• Communication channels\n\n🎯 **ACTIVITIES & EVENTS:**\n• Regular schedules\n• Special events\n• Training sessions\n• Fellowship activities\n\n💡 **HOW TO USE:**\n• Type natural questions\n• Use quick question buttons\n• Ask for specific details\n• Request explanations\n\n**EXAMPLE QUESTIONS:**\n• "Show me member payment status"\n• "What's our financial position?"\n• "Who leads the Training Unit?"\n• "How do I join the department?"\n\nJust ask me anything about the DIGC Ushering Department!`;
    }

    // Fallback response with comprehensive options
    return `🤖 **I'm here to help with DIGC Ushering Department information!**\n\n**POPULAR TOPICS:**\n\n👥 **Members:** "How many members?", "Member list", "Payment status"\n💰 **Finances:** "Financial summary", "Monthly dues", "Bank details"\n📊 **Reports:** "Monthly report", "Year summary", "Collection rates"\n🏢 **Services:** "Department units", "What services?", "Unit contacts"\n📞 **Contacts:** "Phone numbers", "Email", "Leadership contacts"\n🎯 **Training:** "Training programs", "How to join?", "Development"\n📅 **Events:** "Activities", "Schedule", "Upcoming events"\n\n**TRY ASKING:**\n• "Show me this month's financial report"\n• "Who are the unit heads?"\n• "What's our current balance?"\n• "How do I pay my dues?"\n• "What training is available?"\n\n**OR USE THE QUICK QUESTION BUTTONS ABOVE!**\n\nWhat specific information would you like about our department?`;
  };

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: currentMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        message: generateBotResponse(currentMessage),
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    { text: "How many members?", icon: <Users className="h-4 w-4" /> },
    { text: "Financial summary", icon: <DollarSign className="h-4 w-4" /> },
    { text: "Monthly report", icon: <Calendar className="h-4 w-4" /> },
    { text: "Contact information", icon: <Phone className="h-4 w-4" /> },
    { text: "How to join?", icon: <User className="h-4 w-4" /> },
    { text: "Department services", icon: <Star className="h-4 w-4" /> }
  ];

  return (
    <>
      {/* Support Button - Bottom Left */}
      <div className="fixed bottom-6 left-6 z-50">
        <button
          onClick={handleSupportClick}
          className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 animate-pulse-glow"
        >
          <HelpCircle className="h-6 w-6" />
        </button>
      </div>

      {/* Right Side Buttons - Bottom Right */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3">
        {/* WhatsApp Button */}
        <button
          onClick={handleWhatsApp}
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
        >
          <MessageCircle className="h-6 w-6" />
        </button>

        {/* AI Chatbot Button */}
        <button
          onClick={() => setShowChatbot(!showChatbot)}
          className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
        >
          <Bot className="h-6 w-6" />
        </button>

        {/* Settings Button */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="bg-gray-600 hover:bg-gray-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
        >
          <Settings className="h-6 w-6" />
        </button>
      </div>

      {/* Support Page Modal */}
      {showSupport && (
        <SupportPage onClose={() => setShowSupport(false)} />
      )}

      {/* Enhanced Chatbot Modal */}
      {showChatbot && (
        <div className="fixed bottom-24 right-6 z-50 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-96 h-[600px] border dark:border-gray-700 flex flex-col animate-bounce-in">
          {/* Chat Header */}
          <div className="flex justify-between items-center p-6 border-b dark:border-gray-700 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-2xl">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-full">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">DIGC AI Assistant</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm opacity-90">Online</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowChatbot(false)}
              className="text-white/80 hover:text-white bg-white/20 hover:bg-white/30 rounded-full p-2 transition-all duration-300 transform hover:scale-110 hover:rotate-90"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Quick Questions */}
          <div className="p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-3">Quick Questions:</p>
            <div className="grid grid-cols-2 gap-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentMessage(question.text);
                    setTimeout(() => handleSendMessage(), 100);
                  }}
                  className="flex items-center space-x-2 text-xs bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-gray-200 dark:border-gray-600 rounded-lg p-2 transition-all duration-300 transform hover:scale-105"
                >
                  {question.icon}
                  <span className="truncate">{question.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                  } shadow-lg`}
                >
                  <p className="text-sm whitespace-pre-line leading-relaxed">{message.message}</p>
                  <p className={`text-xs mt-2 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-2xl shadow-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-2xl">
            <div className="flex items-center space-x-3">
              <input
                type="text"
                placeholder="Ask me anything about DIGC Ushering..."
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white text-sm transition-all duration-300"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!currentMessage.trim() || isTyping}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white p-3 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
              Press Enter to send • AI responses are based on current data
            </p>
          </div>
        </div>
      )}

      {/* Enhanced Settings Modal */}
      {showSettings && (
        <div className="fixed bottom-24 right-6 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 w-80 border dark:border-gray-700">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">Settings</h3>
            <button
              onClick={() => setShowSettings(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-3">
            {/* Admin Login/Logout */}
            {loading ? (
              <div className="flex items-center justify-center py-2">
                <Loader2 className="animate-spin h-4 w-4 text-gray-500" />
              </div>
            ) : isAuthenticated ? (
              <div className="space-y-3">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-700">
                  <div className="flex items-center space-x-2 mb-2">
                    {userRole === 'announcement_admin' ? (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    ) : (
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    )}
                    <span className="text-sm font-medium text-green-700 dark:text-green-300">
                      {userRole === 'announcement_admin' ? 'Announcement Admin' : 'Full Administrator'}
                    </span>
                  </div>
                  <p className="text-xs text-green-600 dark:text-green-400">{userEmail}</p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    {userRole === 'announcement_admin' 
                      ? 'Access: Announcements & Updates only'
                      : 'Access: Full system administration'
                    }
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="w-full bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center justify-center space-x-2"
              >
                <Lock className="h-4 w-4" />
                <span>Admin Login</span>
              </button>
            )}
            
            <div className="border-t dark:border-gray-600 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Notifications</span>
                <input type="checkbox" className="rounded" defaultChecked />
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-gray-700 dark:text-gray-300">Auto-save</span>
                <input type="checkbox" className="rounded" defaultChecked />
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-gray-700 dark:text-gray-300">Sound</span>
                <input type="checkbox" className="rounded" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Admin Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Administrator Login</h2>
            
            {/* Access Level Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Select Access Level:
              </label>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleAccessLevelChange('announcement_admin')}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-all duration-300 ${
                    loginData.accessLevel === 'announcement_admin'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Shield className={`h-5 w-5 ${loginData.accessLevel === 'announcement_admin' ? 'text-blue-600' : 'text-gray-400'}`} />
                    <div>
                      <p className={`font-medium ${loginData.accessLevel === 'announcement_admin' ? 'text-blue-900 dark:text-blue-200' : 'text-gray-900 dark:text-white'}`}>
                        Announcement Admin
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Manage announcements and updates only
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleAccessLevelChange('full_admin')}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-all duration-300 ${
                    loginData.accessLevel === 'full_admin'
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Crown className={`h-5 w-5 ${loginData.accessLevel === 'full_admin' ? 'text-purple-600' : 'text-gray-400'}`} />
                    <div>
                      <p className={`font-medium ${loginData.accessLevel === 'full_admin' ? 'text-purple-900 dark:text-purple-200' : 'text-gray-900 dark:text-white'}`}>
                        Full Administrator
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Complete access to all system features
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  disabled={isLoggingIn}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  disabled={isLoggingIn}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                />
              </div>
              
              {/* Access Level Information */}
              <div className="mb-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-700">
                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                  Selected: {loginData.accessLevel === 'announcement_admin' ? 'Announcement Admin' : 'Full Administrator'}
                </h4>
                <div className="text-xs text-blue-700 dark:text-blue-300">
                  {loginData.accessLevel === 'announcement_admin' ? (
                    <div>
                      <p>• Access to announcements and updates management</p>
                      <p>• View-only access to financial data</p>
                      <p>• Cannot modify financial records or member dues</p>
                    </div>
                  ) : (
                    <div>
                      <p>• Complete administrative access</p>
                      <p>• Full financial management capabilities</p>
                      <p>• Member dues and payment management</p>
                      <p>• All announcement and update features</p>
                    </div>
                  )}
                </div>
              </div>
              
              {loginError && (
                <div className="mb-4 text-red-600 text-sm">{loginError}</div>
              )}
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Logging in...
                    </>
                  ) : (
                    <>
                      {loginData.accessLevel === 'announcement_admin' ? (
                        <Shield className="h-4 w-4 mr-2" />
                      ) : (
                        <Crown className="h-4 w-4 mr-2" />
                      )}
                      Login
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowLoginModal(false);
                    setLoginData({ email: '', password: '', accessLevel: 'announcement_admin' });
                    setLoginError('');
                  }}
                  disabled={isLoggingIn}
                  className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingButtons;