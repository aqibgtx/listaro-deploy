import React, { useState } from 'react';
import { AlertTriangle, ExternalLink, RefreshCw } from 'lucide-react';
import { Listing } from '../types/listing';
import StatusBadge from './StatusBadge';
import { formatDate, formatPrice, truncateText, hasDuplicateTitle, hasEmptyTitle } from '../utils/formatters';
import DescriptionModal from './DescriptionModal';

interface ListingCardProps {
  listing: Listing;
  allListings: Listing[];
  onRegenerateTitle: (id: string) => void;
  onRegenerateDescription: (id: string) => void;
}

const ListingCard: React.FC<ListingCardProps> = ({ 
  listing, 
  allListings,
  onRegenerateTitle, 
  onRegenerateDescription 
}) => {
  const [showModal, setShowModal] = useState(false);
  const isDuplicate = hasDuplicateTitle(listing, allListings);
  const isEmpty = hasEmptyTitle(listing);
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden mb-4">
      <div className="relative h-48 w-full">
        <img 
          src={listing.images[0] || 'https://via.placeholder.com/400'} 
          alt={listing.title} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 mr-2 flex items-center">
            {listing.title}
            {(isDuplicate || isEmpty) && (
              <AlertTriangle size={16} className="ml-1 text-yellow-500" />
            )}
          </h3>
          <span className="font-bold text-gray-900">
            {formatPrice(listing.price)}
          </span>
        </div>
        
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <span className="font-medium">@{listing.user_id || 'Unknown'}</span>
          <span className="mx-1">•</span>
          <StatusBadge status={listing.status} />
          <span className="mx-1">•</span>
          <span>{formatDate(listing.created_at)}</span>
        </div>
        
        <p className="text-gray-700 mb-3">
          {truncateText(listing.description, 80)}
          {listing.description.length > 80 && (
            <button 
              className="ml-1 text-blue-600 hover:text-blue-800"
              onClick={() => setShowModal(true)}
            >
              View more
            </button>
          )}
        </p>
        
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => onRegenerateTitle(listing.id)}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-sm text-gray-700 flex items-center"
          >
            <RefreshCw size={14} className="mr-1" />
            Title
          </button>
          
          <button 
            onClick={() => onRegenerateDescription(listing.id)}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-sm text-gray-700 flex items-center"
          >
            <RefreshCw size={14} className="mr-1" />
            Description
          </button>
          
          {listing.fb_url && (
            <a 
              href={listing.fb_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded text-sm text-blue-700 flex items-center"
            >
              <ExternalLink size={14} className="mr-1" />
              View
            </a>
          )}
        </div>
      </div>
      
      <DescriptionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={listing.title}
        description={listing.description}
      />
    </div>
  );
};

export default ListingCard;