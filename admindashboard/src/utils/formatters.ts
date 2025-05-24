import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { ListingStatus } from '../types/listing';
import type { Database } from '../types/supabase';

type Listing = Database['public']['Tables']['listings']['Row'];

export const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'N/A';
  
  try {
    const date = parseISO(dateString);
    
    if (isToday(date)) {
      return 'Today';
    }
    
    if (isYesterday(date)) {
      return 'Yesterday';
    }
    
    return format(date, 'MMM d, yyyy');
  } catch (error) {
    console.error('Error parsing date:', error);
    return 'Invalid date';
  }
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-MY', {
    style: 'currency',
    currency: 'MYR',
    maximumFractionDigits: 0,
  }).format(price);
};

export const getUserName = (userId: string | null): string => {
  return userId ? userId : 'Unknown';
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const getStatusColor = (status: ListingStatus): string => {
  switch (status) {
    case 'draft':
      return 'bg-gray-200 text-gray-800';
    case 'ready':
      return 'bg-blue-100 text-blue-800';
    case 'posted':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-200 text-gray-800';
  }
};

export const hasDuplicateTitle = (listing: Listing, allListings: Listing[]): boolean => {
  return allListings.filter(l => 
    l.id !== listing.id && 
    l.title.toLowerCase() === listing.title.toLowerCase()
  ).length > 0;
};

export const hasEmptyTitle = (listing: Listing): boolean => {
  return !listing.title || listing.title.trim() === '';
};