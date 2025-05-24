export type ListingStatus = 'draft' | 'ready' | 'posted';

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  status: ListingStatus;
  userId: string;
  createdAt: string;
  image: string;
  url?: string;
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
}

export interface DailyPostCount {
  date: string;
  userId: string;
  count: number;
}