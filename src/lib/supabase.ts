import { createClient } from '@supabase/supabase-js'

// Use placeholder values when environment variables are not set
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gbxrhrgeyficcuafeqzq.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdieHJocmdleWZpY2N1YWZlcXpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4MDE4MzEsImV4cCI6MjA2NTM3NzgzMX0.L4HX82pb0vPnN_Z6nydnedQ5E1jPm8APV5bghphhjU4'

// Check if we have valid Supabase configuration
const hasValidSupabaseConfig = supabaseUrl !== 'https://placeholder.supabase.co' && supabaseAnonKey !== 'placeholder-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Member {
  id: string
  name: string
  created_at: string
  updated_at: string
}

export interface MemberPayment {
  id: string
  member_id: string
  year: number
  month: number
  amount: number
  paid: boolean
  payment_date?: string
  created_at: string
  updated_at: string
}

export interface Contribution {
  id: string
  member_name: string
  amount: number
  description: string
  date: string
  year: number
  month: number
  created_at: string
  updated_at: string
}

export interface Donation {
  id: string
  member_name: string
  amount: number
  description: string
  date: string
  year: number
  month: number
  created_at: string
  updated_at: string
}

export interface Expense {
  id: string
  amount: number
  description: string
  date: string
  year: number
  month: number
  created_at: string
  updated_at: string
}

export interface BalanceBroughtForward {
  id: string
  year: number
  amount: number
  created_at: string
  updated_at: string
}

export interface Announcement {
  id: string
  title: string
  priority: 'Low' | 'Medium' | 'High'
  event_date?: string
  venue?: string
  content: string
  sender_name: string
  attachment_urls?: string[]
  is_pinned: boolean
  created_at: string
  updated_at: string
}

// Helper functions for database operations
export const dbHelpers = {
  // Members
  async getMembers() {
    if (!hasValidSupabaseConfig) {
      console.warn('Supabase not configured, returning mock data');
      return [];
    }
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .order('name');
    if (error) {
      console.error('Error fetching members:', error);
      return [];
    }
    return data;
  },

  async addMember(name: string) {
    if (!hasValidSupabaseConfig) {
      console.warn('Supabase not configured, cannot add member');
      throw new Error('Database not configured');
    }
    const { data, error } = await supabase
      .from('members')
      .insert([{ name }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateMember(id: string, name: string) {
    if (!hasValidSupabaseConfig) {
      console.warn('Supabase not configured, cannot update member');
      throw new Error('Database not configured');
    }
    const { data, error } = await supabase
      .from('members')
      .update({ name })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteMember(id: string) {
    if (!hasValidSupabaseConfig) {
      console.warn('Supabase not configured, cannot delete member');
      throw new Error('Database not configured');
    }
    const { error } = await supabase
      .from('members')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Member Payments
  async getMemberPayments(year?: number) {
    if (!hasValidSupabaseConfig) {
      console.warn('Supabase not configured, returning mock data');
      return [];
    }
    let query = supabase
      .from('member_payments')
      .select('*, members(name)');
    
    if (year) {
      query = query.eq('year', year);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching member payments:', error);
      return [];
    }
    return data;
  },

  async upsertMemberPayment(memberPayment: Partial<MemberPayment>) {
    if (!hasValidSupabaseConfig) {
      console.warn('Supabase not configured, cannot upsert member payment');
      throw new Error('Database not configured');
    }
    const { data, error } = await supabase
      .from('member_payments')
      .upsert(memberPayment, { 
        onConflict: 'member_id,year,month',
        ignoreDuplicates: false 
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Contributions
  async getContributions(year?: number) {
    if (!hasValidSupabaseConfig) {
      console.warn('Supabase not configured, returning mock data');
      return [];
    }
    let query = supabase
      .from('contributions')
      .select('*');
    
    if (year) {
      query = query.eq('year', year);
    }
    
    const { data, error } = await query.order('date', { ascending: false });
    if (error) {
      console.error('Error fetching contributions:', error);
      return [];
    }
    return data;
  },

  async addContribution(contribution: Omit<Contribution, 'id' | 'created_at' | 'updated_at'>) {
    if (!hasValidSupabaseConfig) {
      console.warn('Supabase not configured, cannot add contribution');
      throw new Error('Database not configured');
    }
    const date = new Date(contribution.date);
    const contributionWithMeta = {
      ...contribution,
      year: date.getFullYear(),
      month: date.getMonth()
    };
    
    const { data, error } = await supabase
      .from('contributions')
      .insert([contributionWithMeta])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateContribution(id: string, contribution: Omit<Contribution, 'id' | 'created_at' | 'updated_at'>) {
    if (!hasValidSupabaseConfig) {
      console.warn('Supabase not configured, cannot update contribution');
      throw new Error('Database not configured');
    }
    const date = new Date(contribution.date);
    const contributionWithMeta = {
      ...contribution,
      year: date.getFullYear(),
      month: date.getMonth()
    };
    
    const { data, error } = await supabase
      .from('contributions')
      .update(contributionWithMeta)
      .eq('id', id)
      .select();
    if (error) throw error;
    
    // Check if any rows were returned
    if (!data || data.length === 0) {
      return null;
    }
    
    return data[0];
  },

  async deleteContribution(id: string) {
    if (!hasValidSupabaseConfig) {
      console.warn('Supabase not configured, cannot delete contribution');
      throw new Error('Database not configured');
    }
    const { error } = await supabase
      .from('contributions')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Donations
  async getDonations(year?: number) {
    if (!hasValidSupabaseConfig) {
      console.warn('Supabase not configured, returning mock data');
      return [];
    }
    let query = supabase
      .from('donations')
      .select('*');
    
    if (year) {
      query = query.eq('year', year);
    }
    
    const { data, error } = await query.order('date', { ascending: false });
    if (error) {
      console.error('Error fetching donations:', error);
      return [];
    }
    return data;
  },

  async addDonation(donation: Omit<Donation, 'id' | 'created_at' | 'updated_at'>) {
    if (!hasValidSupabaseConfig) {
      console.warn('Supabase not configured, cannot add donation');
      throw new Error('Database not configured');
    }
    const date = new Date(donation.date);
    const donationWithMeta = {
      ...donation,
      year: date.getFullYear(),
      month: date.getMonth()
    };
    
    const { data, error } = await supabase
      .from('donations')
      .insert([donationWithMeta])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateDonation(id: string, donation: Omit<Donation, 'id' | 'created_at' | 'updated_at'>) {
    if (!hasValidSupabaseConfig) {
      console.warn('Supabase not configured, cannot update donation');
      throw new Error('Database not configured');
    }
    const date = new Date(donation.date);
    const donationWithMeta = {
      ...donation,
      year: date.getFullYear(),
      month: date.getMonth()
    };
    
    const { data, error } = await supabase
      .from('donations')
      .update(donationWithMeta)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteDonation(id: string) {
    if (!hasValidSupabaseConfig) {
      console.warn('Supabase not configured, cannot delete donation');
      throw new Error('Database not configured');
    }
    const { error } = await supabase
      .from('donations')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Expenses
  async getExpenses(year?: number) {
    if (!hasValidSupabaseConfig) {
      console.warn('Supabase not configured, returning mock data');
      return [];
    }
    let query = supabase
      .from('expenses')
      .select('*');
    
    if (year) {
      query = query.eq('year', year);
    }
    
    const { data, error } = await query.order('date', { ascending: false });
    if (error) {
      console.error('Error fetching expenses:', error);
      return [];
    }
    return data;
  },

  async addExpense(expense: Omit<Expense, 'id' | 'created_at' | 'updated_at'>) {
    if (!hasValidSupabaseConfig) {
      console.warn('Supabase not configured, cannot add expense');
      throw new Error('Database not configured');
    }
    const date = new Date(expense.date);
    const expenseWithMeta = {
      ...expense,
      year: date.getFullYear(),
      month: date.getMonth()
    };
    
    const { data, error } = await supabase
      .from('expenses')
      .insert([expenseWithMeta])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateExpense(id: string, expense: Omit<Expense, 'id' | 'created_at' | 'updated_at'>) {
    if (!hasValidSupabaseConfig) {
      console.warn('Supabase not configured, cannot update expense');
      throw new Error('Database not configured');
    }
    const date = new Date(expense.date);
    const expenseWithMeta = {
      ...expense,
      year: date.getFullYear(),
      month: date.getMonth()
    };
    
    const { data, error } = await supabase
      .from('expenses')
      .update(expenseWithMeta)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteExpense(id: string) {
    if (!hasValidSupabaseConfig) {
      console.warn('Supabase not configured, cannot delete expense');
      throw new Error('Database not configured');
    }
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Balances Brought Forward
  async getBalancesBroughtForward() {
    if (!hasValidSupabaseConfig) {
      console.warn('Supabase not configured, returning mock data');
      return [];
    }
    const { data, error } = await supabase
      .from('balances_brought_forward')
      .select('*')
      .order('year', { ascending: false });
    if (error) {
      console.error('Error fetching balances brought forward:', error);
      return [];
    }
    return data;
  },

  async upsertBalanceBroughtForward(year: number, amount: number) {
    if (!hasValidSupabaseConfig) {
      console.warn('Supabase not configured, cannot upsert balance brought forward');
      throw new Error('Database not configured');
    }
    const { data, error } = await supabase
      .from('balances_brought_forward')
      .upsert({ year, amount }, { 
        onConflict: 'year',
        ignoreDuplicates: false 
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Announcements
  async getAnnouncements() {
    if (!hasValidSupabaseConfig) {
      console.warn('Supabase not configured, returning mock data');
      return [];
    }
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching announcements:', error);
      return [];
    }
    return data;
  },

  async addAnnouncement(announcement: Omit<Announcement, 'id' | 'created_at' | 'updated_at'>) {
    if (!hasValidSupabaseConfig) {
      console.warn('Supabase not configured, cannot add announcement');
      throw new Error('Database not configured');
    }
    const { data, error } = await supabase
      .from('announcements')
      .insert([announcement])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateAnnouncement(id: string, announcement: Omit<Announcement, 'id' | 'created_at' | 'updated_at'>) {
    if (!hasValidSupabaseConfig) {
      console.warn('Supabase not configured, cannot update announcement');
      throw new Error('Database not configured');
    }
    const { data, error } = await supabase
      .from('announcements')
      .update(announcement)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteAnnouncement(id: string) {
    if (!hasValidSupabaseConfig) {
      console.warn('Supabase not configured, cannot delete announcement');
      throw new Error('Database not configured');
    }
    const { error } = await supabase
      .from('announcements')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  async toggleAnnouncementPin(id: string, isPinned: boolean) {
    if (!hasValidSupabaseConfig) {
      console.warn('Supabase not configured, cannot toggle announcement pin');
      throw new Error('Database not configured');
    }
    const { data, error } = await supabase
      .from('announcements')
      .update({ is_pinned: isPinned })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};