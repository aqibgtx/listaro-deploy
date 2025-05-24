import React, { useState } from 'react';
import { AlertTriangle, ExternalLink, RefreshCw } from 'lucide-react';
import { Listing } from '../types/listing';
import StatusBadge from './StatusBadge';
import { formatDate, formatPrice, truncateText, hasDuplicateTitle, hasEmptyTitle } from '../utils/formatters';
import DescriptionModal from './DescriptionModal';

interface ListingsTableProps {
  listings: Listing[];
  onRegenerateTitle: (id: string) => void;
  onRegenerateDescription: (id: string) => void;
}

const ListingsTable: React.FC<ListingsTableProps> = ({ 
  listings, 
  onRegenerateTitle, 
  onRegenerateDescription 
}) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  
  return (
    <div className="overflow-x-auto shadow rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Image
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Posted By
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {listings.map((listing) => {
            const isDuplicate = hasDuplicateTitle(listing, listings);
            const isEmpty = hasEmptyTitle(listing);
            
            return (
              <tr key={listing.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="h-12 w-12 rounded overflow-hidden">
                    <img 
                      src={listing.images[0] || 'https://via.placeholder.com/400'} 
                      alt={listing.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900">{listing.title}</span>
                    {(isDuplicate || isEmpty) && (
                      <AlertTriangle size={16} className="ml-1 text-yellow-500" title="Warning: Duplicate or empty title" />
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-gray-900">
                    {truncateText(listing.description, 60)}
                    {listing.description.length > 60 && (
                      <button 
                        className="ml-1 text-blue-600 hover:text-blue-800"
                        onClick={() => setActiveModal(listing.id)}
                      >
                        View full
                      </button>
                    )}
                    <DescriptionModal
                      isOpen={activeModal === listing.id}
                      onClose={() => setActiveModal(null)}
                      title={listing.title}
                      description={listing.description}
                    />
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-gray-900">{formatPrice(listing.price)}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">@{listing.user_id || 'Unknown'}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{formatDate(listing.created_at)}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <StatusBadge status={listing.status} />
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => onRegenerateTitle(listing.id)}
                      className="text-gray-600 hover:text-gray-900"
                      title="Regenerate Title"
                    >
                      <RefreshCw size={16} />
                    </button>
                    <button
                      onClick={() => onRegenerateDescription(listing.id)}
                      className="text-gray-600 hover:text-gray-900 ml-1"
                      title="Regenerate Description"
                    >
                      <RefreshCw size={16} />
                    </button>
                    {listing.fb_url && (
                      <a
                        href={listing.fb_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-900 ml-1"
                        title="View on Facebook"
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ListingsTable;