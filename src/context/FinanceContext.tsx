import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, dbHelpers } from '../lib/supabase';

interface Member {
  id: string;
  name: string;
  payments: boolean[]; // 12 months - derived from database
}

interface Contribution {
  id: string;
  memberName: string;
  amount: number;
  description: string;
  date: string;
}

interface Donation {
  id: string;
  memberName: string;
  amount: number;
  description: string;
  date: string;
}

interface Expense {
  id: string;
  amount: number;
  description: string;
  date: string;
}

interface BalanceBroughtForward {
  year: number;
  amount: number;
}

interface FinanceContextType {
  members: Member[];
  contributions: Contribution[];
  donations: Donation[];
  expenses: Expense[];
  balancesBroughtForward: BalanceBroughtForward[];
  loading: boolean;
  error: string | null;
  addMember: (name: string) => Promise<void>;
  updateMember: (id: string, name: string) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  toggleMemberPayment: (memberId: string, monthIndex: number, year: number) => Promise<void>;
  addContribution: (contribution: Omit<Contribution, 'id'>) => Promise<void>;
  updateContribution: (id: string, contribution: Omit<Contribution, 'id'>) => Promise<void>;
  deleteContribution: (id: string) => Promise<void>;
  addDonation: (donation: Omit<Donation, 'id'>) => Promise<void>;
  updateDonation: (id: string, donation: Omit<Donation, 'id'>) => Promise<void>;
  deleteDonation: (id: string) => Promise<void>;
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  updateExpense: (id: string, expense: Omit<Expense, 'id'>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  updateBalanceBroughtForward: (year: number, amount: number) => Promise<void>;
  getTotalMemberCount: () => number;
  getYearlyTotals: (year: number) => {
    balanceBroughtForward: number;
    monthlyDues: number;
    contributions: number;
    donations: number;
    totalIncome: number;
    totalExpenses: number;
    balance: number;
  };
  getMonthlyReport: (year: number, month: number) => {
    monthlyDues: number;
    contributions: number;
    donations: number;
    income: number;
    expenses: number;
    balance: number;
  };
  refreshData: () => Promise<void>;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

interface FinanceProviderProps {
  children: ReactNode;
}

export const FinanceProvider: React.FC<FinanceProviderProps> = ({ children }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [balancesBroughtForward, setBalancesBroughtForward] = useState<BalanceBroughtForward[]>([]);
  const [memberPayments, setMemberPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data from Supabase
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        membersData,
        contributionsData,
        donationsData,
        expensesData,
        balancesData,
        paymentsData
      ] = await Promise.all([
        dbHelpers.getMembers(),
        dbHelpers.getContributions(),
        dbHelpers.getDonations(),
        dbHelpers.getExpenses(),
        dbHelpers.getBalancesBroughtForward(),
        dbHelpers.getMemberPayments()
      ]);

      // Transform members data to include payment status
      const transformedMembers = membersData.map(member => {
        const currentYear = new Date().getFullYear();
        const payments = new Array(12).fill(false);
        
        // Fill in payment status from database
        paymentsData
          .filter(payment => payment.member_id === member.id && payment.year === currentYear)
          .forEach(payment => {
            if (payment.month >= 0 && payment.month < 12) {
              payments[payment.month] = payment.paid;
            }
          });

        return {
          id: member.id,
          name: member.name,
          payments
        };
      });

      setMembers(transformedMembers);
      setContributions(contributionsData);
      setDonations(donationsData);
      setExpenses(expensesData);
      setBalancesBroughtForward(balancesData);
      setMemberPayments(paymentsData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const refreshData = async () => {
    await loadData();
  };

  const addMember = async (name: string) => {
    try {
      const newMember = await dbHelpers.addMember(name);
      const memberWithPayments = {
        id: newMember.id,
        name: newMember.name,
        payments: new Array(12).fill(false)
      };
      setMembers(prev => [...prev, memberWithPayments]);
    } catch (err) {
      console.error('Error adding member:', err);
      setError(err instanceof Error ? err.message : 'Failed to add member');
    }
  };

  const updateMember = async (id: string, name: string) => {
    try {
      await dbHelpers.updateMember(id, name);
      setMembers(prev => prev.map(member => 
        member.id === id ? { ...member, name } : member
      ));
    } catch (err) {
      console.error('Error updating member:', err);
      setError(err instanceof Error ? err.message : 'Failed to update member');
    }
  };

  const deleteMember = async (id: string) => {
    try {
      await dbHelpers.deleteMember(id);
      setMembers(prev => prev.filter(member => member.id !== id));
    } catch (err) {
      console.error('Error deleting member:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete member');
    }
  };

  const toggleMemberPayment = async (memberId: string, monthIndex: number, year: number = new Date().getFullYear()) => {
    try {
      const currentPayment = memberPayments.find(
        p => p.member_id === memberId && p.year === year && p.month === monthIndex
      );

      const newPaidStatus = !currentPayment?.paid;
      
      await dbHelpers.upsertMemberPayment({
        member_id: memberId,
        year,
        month: monthIndex,
        amount: 500,
        paid: newPaidStatus,
        payment_date: newPaidStatus ? new Date().toISOString().split('T')[0] : null
      });

      // Update local state
      setMembers(prev => prev.map(member => {
        if (member.id === memberId) {
          const updatedPayments = [...member.payments];
          updatedPayments[monthIndex] = newPaidStatus;
          return { ...member, payments: updatedPayments };
        }
        return member;
      }));

      // Refresh payment data
      const updatedPayments = await dbHelpers.getMemberPayments();
      setMemberPayments(updatedPayments);
    } catch (err) {
      console.error('Error toggling payment:', err);
      setError(err instanceof Error ? err.message : 'Failed to update payment');
    }
  };

  const addContribution = async (contribution: Omit<Contribution, 'id'>) => {
    try {
      const newContribution = await dbHelpers.addContribution({
        member_name: contribution.memberName,
        amount: contribution.amount,
        description: contribution.description,
        date: contribution.date,
        year: new Date(contribution.date).getFullYear(),
        month: new Date(contribution.date).getMonth()
      });
      
      setContributions(prev => [newContribution, ...prev]);
    } catch (err) {
      console.error('Error adding contribution:', err);
      setError(err instanceof Error ? err.message : 'Failed to add contribution');
    }
  };

  const updateContribution = async (id: string, contribution: Omit<Contribution, 'id'>) => {
    try {
      const updatedContribution = await dbHelpers.updateContribution(id, {
        member_name: contribution.memberName,
        amount: contribution.amount,
        description: contribution.description,
        date: contribution.date,
        year: new Date(contribution.date).getFullYear(),
        month: new Date(contribution.date).getMonth()
      });
      
      // Only update state if the contribution was found and updated
      if (updatedContribution) {
        setContributions(prev => prev.map(c => 
          c.id === id ? updatedContribution : c
        ));
      }
    } catch (err) {
      console.error('Error updating contribution:', err);
      setError(err instanceof Error ? err.message : 'Failed to update contribution');
    }
  };

  const deleteContribution = async (id: string) => {
    try {
      await dbHelpers.deleteContribution(id);
      setContributions(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('Error deleting contribution:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete contribution');
    }
  };

  const addDonation = async (donation: Omit<Donation, 'id'>) => {
    try {
      const newDonation = await dbHelpers.addDonation({
        member_name: donation.memberName,
        amount: donation.amount,
        description: donation.description,
        date: donation.date,
        year: new Date(donation.date).getFullYear(),
        month: new Date(donation.date).getMonth()
      });
      
      setDonations(prev => [newDonation, ...prev]);
    } catch (err) {
      console.error('Error adding donation:', err);
      setError(err instanceof Error ? err.message : 'Failed to add donation');
    }
  };

  const updateDonation = async (id: string, donation: Omit<Donation, 'id'>) => {
    try {
      const updatedDonation = await dbHelpers.updateDonation(id, {
        member_name: donation.memberName,
        amount: donation.amount,
        description: donation.description,
        date: donation.date,
        year: new Date(donation.date).getFullYear(),
        month: new Date(donation.date).getMonth()
      });
      
      setDonations(prev => prev.map(d => 
        d.id === id ? updatedDonation : d
      ));
    } catch (err) {
      console.error('Error updating donation:', err);
      setError(err instanceof Error ? err.message : 'Failed to update donation');
    }
  };

  const deleteDonation = async (id: string) => {
    try {
      await dbHelpers.deleteDonation(id);
      setDonations(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      console.error('Error deleting donation:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete donation');
    }
  };

  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    try {
      const newExpense = await dbHelpers.addExpense({
        amount: expense.amount,
        description: expense.description,
        date: expense.date,
        year: new Date(expense.date).getFullYear(),
        month: new Date(expense.date).getMonth()
      });
      
      setExpenses(prev => [newExpense, ...prev]);
    } catch (err) {
      console.error('Error adding expense:', err);
      setError(err instanceof Error ? err.message : 'Failed to add expense');
    }
  };

  const updateExpense = async (id: string, expense: Omit<Expense, 'id'>) => {
    try {
      const updatedExpense = await dbHelpers.updateExpense(id, {
        amount: expense.amount,
        description: expense.description,
        date: expense.date,
        year: new Date(expense.date).getFullYear(),
        month: new Date(expense.date).getMonth()
      });
      
      setExpenses(prev => prev.map(e => 
        e.id === id ? updatedExpense : e
      ));
    } catch (err) {
      console.error('Error updating expense:', err);
      setError(err instanceof Error ? err.message : 'Failed to update expense');
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      await dbHelpers.deleteExpense(id);
      setExpenses(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      console.error('Error deleting expense:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete expense');
    }
  };

  const updateBalanceBroughtForward = async (year: number, amount: number) => {
    try {
      await dbHelpers.upsertBalanceBroughtForward(year, amount);
      setBalancesBroughtForward(prev => {
        const existingIndex = prev.findIndex(b => b.year === year);
        if (existingIndex >= 0) {
          return prev.map(b => b.year === year ? { ...b, amount } : b);
        } else {
          return [...prev, { year, amount }];
        }
      });
    } catch (err) {
      console.error('Error updating balance brought forward:', err);
      setError(err instanceof Error ? err.message : 'Failed to update balance');
    }
  };

  const getTotalMemberCount = () => {
    return members.length;
  };

  const getYearlyTotals = (year: number) => {
    const balanceBroughtForward = balancesBroughtForward.find(b => b.year === year)?.amount || 0;
    
    // Calculate monthly dues from member payments - synchronized with database
    const yearPayments = memberPayments.filter(p => p.year === year && p.paid);
    const monthlyDues = yearPayments.reduce((total, payment) => total + (payment.amount || 500), 0);
    
    const yearContributions = contributions
      .filter(c => new Date(c.date).getFullYear() === year)
      .reduce((total, c) => total + c.amount, 0);
    
    const yearDonations = donations
      .filter(d => new Date(d.date).getFullYear() === year)
      .reduce((total, d) => total + d.amount, 0);
    
    const yearExpenses = expenses
      .filter(e => new Date(e.date).getFullYear() === year)
      .reduce((total, e) => total + e.amount, 0);
    
    // Current year income = monthly dues + contributions + donations (excluding balance B/F)
    const currentYearIncome = monthlyDues + yearContributions + yearDonations;
    const totalIncome = balanceBroughtForward + monthlyDues + yearContributions + yearDonations;
    const balance = totalIncome - yearExpenses;
    
    return {
      balanceBroughtForward,
      monthlyDues,
      currentYearIncome,
      contributions: yearContributions,
      donations: yearDonations,
      totalIncome,
      totalExpenses: yearExpenses,
      balance
    };
  };

  const getMonthlyReport = (year: number, month: number) => {
    // Calculate monthly dues from member payments - synchronized with database
    const monthPayments = memberPayments.filter(p => 
      p.year === year && p.month === month && p.paid
    );
    const monthlyDues = monthPayments.reduce((total, payment) => total + (payment.amount || 500), 0);
    
    const monthContributions = contributions
      .filter(c => {
        const date = new Date(c.date);
        return date.getFullYear() === year && date.getMonth() === month;
      })
      .reduce((total, c) => total + c.amount, 0);
    
    const monthDonations = donations
      .filter(d => {
        const date = new Date(d.date);
        return date.getFullYear() === year && date.getMonth() === month;
      })
      .reduce((total, d) => total + d.amount, 0);
    
    const monthExpenses = expenses
      .filter(e => {
        const date = new Date(e.date);
        return date.getFullYear() === year && date.getMonth() === month;
      })
      .reduce((total, e) => total + e.amount, 0);
    
    const income = monthlyDues + monthContributions + monthDonations;
    const balance = income - monthExpenses;
    
    return {
      monthlyDues,
      contributions: monthContributions,
      donations: monthDonations,
      income,
      expenses: monthExpenses,
      balance
    };
  };

  return (
    <FinanceContext.Provider value={{
      members,
      contributions,
      donations,
      expenses,
      balancesBroughtForward,
      loading,
      error,
      addMember,
      updateMember,
      deleteMember,
      toggleMemberPayment,
      addContribution,
      updateContribution,
      deleteContribution,
      addDonation,
      updateDonation,
      deleteDonation,
      addExpense,
      updateExpense,
      deleteExpense,
      updateBalanceBroughtForward,
      getTotalMemberCount,
      getYearlyTotals,
      getMonthlyReport,
      refreshData
    }}>
      {children}
    </FinanceContext.Provider>
  );
};