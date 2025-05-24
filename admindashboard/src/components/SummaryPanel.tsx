import React from 'react';
import { FileText, RefreshCw, Users } from 'lucide-react';

interface SummaryPanelProps {
  listingsToday: number;
  regenerationsToday: number;
  activeUsersToday: number;
}

const SummaryPanel: React.FC<SummaryPanelProps> = ({ 
  listingsToday, 
  regenerationsToday, 
  activeUsersToday 
}) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3">
        <div className="p-4 border-b md:border-b-0 md:border-r border-gray-200">
          <div className="flex items-center">
            <div className="p-2 rounded-md bg-blue-100 mr-3">
              <FileText size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Listings Today</p>
              <p className="text-2xl font-semibold text-gray-900">{listingsToday}</p>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-b md:border-b-0 md:border-r border-gray-200">
          <div className="flex items-center">
            <div className="p-2 rounded-md bg-orange-100 mr-3">
              <RefreshCw size={20} className="text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Regenerations</p>
              <p className="text-2xl font-semibold text-gray-900">{regenerationsToday}</p>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-md bg-green-100 mr-3">
              <Users size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Active Users</p>
              <p className="text-2xl font-semibold text-gray-900">{activeUsersToday}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryPanel;