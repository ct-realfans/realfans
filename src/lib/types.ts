export type Channel = "line" | "sms" | "email";

export type InviteStatus =
  | "draft"
  | "scheduled"
  | "sent"
  | "opened"
  | "reviewed"
  | "declined";

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  lineId?: string;
  lastVisitAt: string;
  totalSpend: number;
  visits: number;
  tags: string[];
  notes?: string;
}

export interface ReviewInvite {
  id: string;
  customerId: string;
  customerName: string;
  channel: Channel;
  message: string;
  status: InviteStatus;
  createdAt: string;
  sentAt?: string;
  reviewedAt?: string;
  rating?: number;
  platform: "google" | "facebook" | "line";
}

export interface Store {
  id: string;
  name: string;
  industry: string;
  brandVoice: string;
  googlePlaceId?: string;
  linkReview: string;
}

export interface ReviewRecord {
  id: string;
  platform: "google" | "facebook" | "line";
  author: string;
  rating: number;
  content: string;
  createdAt: string;
  repliedAt?: string;
  aiReply?: string;
  source: "organic" | "invited";
}
