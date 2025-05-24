import React from 'react';
import { Search, Filter } from 'lucide-react';
import { ListingStatus, User } from '../types/listing';

interface FilterPanelProps {
  statusFilter: ListingStatus | '';
  setStatusFilter: (status: ListingStatus | '') => void;
  userFilter: string | '';
  setUserFilter: (userId: string | '') => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  users: User[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  statusFilter,
  setStatusFilter,
  userFilter,
  setUserFilter,
  searchTerm,
  setSearchTerm,
  users,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-col md:flex-row gap-4">
      <div className="flex-1 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Search listings..."
        />
      </div>

      <div className="flex gap-4">
        <div className="relative">
          <div className="flex items-center">
            <Filter size={18} className="mr-2 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ListingStatus | '')}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">All Statuses</option>
              <option value="posted">Posted</option>
              <option value="ready">Ready</option>
            </select>
          </div>
        </div>

        <div className="relative">
          <select
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">All Users</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;