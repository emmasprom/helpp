export interface Campaign {
  id: string;
  title: string;
  shortDescription: string;
  fullStory: string;
  imageUrl: string;
  videoUrl?: string;
  targetAmount: number;
  raisedAmount: number;
  donorCount: number;
  category: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  status: 'draft' | 'published' | 'ended';
  endDate: string;
  isAiOptimized: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Donation {
  id: string;
  campaignId: string;
  donorId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'success' | 'failed';
  paystackReference?: string;
  isRecurring: boolean;
  createdAt: string;
}

export interface Donor {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  totalDonated: number;
  donationCount: number;
  lastDonationAt?: string;
  score: number;
  segment: 'new' | 'active' | 'high-value' | 'recurring' | 'inactive' | 'vip';
  createdAt: string;
}

export type AdminRole = 'Super Admin' | 'Campaign Manager' | 'Viewer';

export interface AdminUser {
  id: string;
  email?: string | null;
  role: AdminRole;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
