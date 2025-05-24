import React, { useState, useEffect } from 'react';
import { supabase, initializeSupabase } from './lib/supabase';
import { ListingStatus } from './types/listing';
import SummaryPanel from './components/SummaryPanel';
import ConsistencyChart from './components/ConsistencyChart';
import FilterPanel from './components/FilterPanel';
import ListingsTable from './components/ListingsTable';
import ListingCard from './components/ListingCard';
import Login from './pages/Login';
import { LogOut } from 'lucide-react';
import type { Database } from './types/supabase';

type Listing = Database['public']['Tables']['listings']['Row'];

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [shopName, setShopName] = useState<string>('');
  const [listings, setListings] = useState<Listing[]>([]);
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
  const [consistencyData, setConsistencyData] = useState<{ date: string; userId: string; count: number }[]>([]);
  const [statusFilter, setStatusFilter] = useState<ListingStatus | ''>('');
  const [userFilter, setUserFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewConsistencyChart, setViewConsistencyChart] = useState<boolean>(window.innerWidth >= 768);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem('branchManager');
      if (auth) {
        const { authenticated, shopName } = JSON.parse(auth);
        if (authenticated && shopName) {
          initializeSupabase(shopName);
          setShopName(shopName);
          setIsAuthenticated(true);
        }
      }
    };
    checkAuth();
  }, []);
  
  useEffect(() => {
    if (isAuthenticated) {
      fetchListings();
      fetchConsistencyData();
    }
  }, [isAuthenticated]);

  const fetchListings = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('branch', shopName)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Filter out duplicates based on original_id
      const uniqueListings = data?.reduce((acc: Listing[], current) => {
        const isDuplicate = current.original_id && acc.some(item => 
          item.original_id === current.original_id
        );
        if (!isDuplicate) {
          acc.push(current);
        }
        return acc;
      }, []) || [];
      
      setListings(uniqueListings);
      
      const uniqueUsers = Array.from(new Set(uniqueListings?.map(listing => listing.user_id)))
        .filter((id): id is string => id !== null)
        .map(id => ({ id, name: id }));
      
      setUsers(uniqueUsers);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching listings:', error);
      setLoading(false);
    }
  };

  const fetchConsistencyData = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('user_id, created_at')
        .eq('branch', shopName)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;

      const processedData = data.reduce((acc: any[], listing) => {
        if (!listing.user_id || !listing.created_at) return acc;
        
        const date = new Date(listing.created_at).toISOString().split('T')[0];
        const existingEntry = acc.find(entry => 
          entry.date === date && entry.userId === listing.user_id
        );

        if (existingEntry) {
          existingEntry.count += 1;
        } else {
          acc.push({ date, userId: listing.user_id, count: 1 });
        }

        return acc;
      }, []);

      setConsistencyData(processedData);
    } catch (error) {
      console.error('Error fetching consistency data:', error);
    }
  };
  
  const filteredListings = listings.filter(listing => {
    if (statusFilter && listing.status !== statusFilter) {
      return false;
    }
    
    if (userFilter && listing.user_id !== userFilter) {
      return false;
    }
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const titleMatch = listing.title.toLowerCase().includes(searchLower);
      const descMatch = listing.description.toLowerCase().includes(searchLower);
      
      if (!titleMatch && !descMatch) {
        return false;
      }
    }
    
    return true;
  });
  
  const handleRegenerateTitle = async (id: string) => {
    try {
      const { error } = await supabase
        .from('listings')
        .update({ prompt_title: 'Regenerating...' })
        .eq('id', id)
        .eq('branch', shopName);

      if (error) throw error;
      
      fetchListings();
    } catch (error) {
      console.error('Error regenerating title:', error);
    }
  };
  
  const handleRegenerateDescription = async (id: string) => {
    try {
      const { error } = await supabase
        .from('listings')
        .update({ prompt_desc: 'Regenerating...' })
        .eq('id', id)
        .eq('branch', shopName);

      if (error) throw error;
      
      fetchListings();
    } catch (error) {
      console.error('Error regenerating description:', error);
    }
  };
  
  const handleUserSelect = (userId: string) => {
    setUserFilter(userId);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('branchManager');
    setIsAuthenticated(false);
    setShopName('');
  };
  
  const toggleConsistencyChart = () => {
    setViewConsistencyChart(!viewConsistencyChart);
  };
  
  const isMobile = () => window.innerWidth < 768;
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && !viewConsistencyChart) {
        setViewConsistencyChart(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [viewConsistencyChart]);

  const getListingStats = () => {
    const today = new Date().toISOString().split('T')[0];
    
    const listingsToday = listings.filter(
      listing => listing.created_at?.split('T')[0] === today
    ).length;
    
    const regenerationsToday = listings.filter(
      listing => 
        listing.created_at?.split('T')[0] === today &&
        (listing.prompt_title !== null || listing.prompt_desc !== null)
    ).length;
    
    const activeUsersToday = new Set(
      listings
        .filter(listing => listing.created_at?.split('T')[0] === today)
        .map(listing => listing.user_id)
    ).size;
    
    return {
      listingsToday,
      regenerationsToday,
      activeUsersToday
    };
  };

  const stats = getListingStats();

  if (!isAuthenticated) {
    return <Login onLogin={(shop) => {
      setShopName(shop);
      setIsAuthenticated(true);
    }} />;
  }
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">
            {shopName} Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <SummaryPanel 
          listingsToday={stats.listingsToday}
          regenerationsToday={stats.regenerationsToday}
          activeUsersToday={stats.activeUsersToday}
        />
        
        <div className="md:hidden mb-4">
          <button
            onClick={toggleConsistencyChart}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md flex justify-center items-center"
          >
            {viewConsistencyChart ? 'Hide' : 'View'} Consistency Chart
          </button>
        </div>
        
        {viewConsistencyChart && (
          <ConsistencyChart 
            data={consistencyData} 
            users={users}
            shopName={shopName}
            onUserSelect={handleUserSelect}
          />
        )}
        
        <FilterPanel 
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          userFilter={userFilter}
          setUserFilter={setUserFilter}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          users={users}
        />
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Listings ({filteredListings.length})</h2>
          
          {isMobile() ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredListings.map(listing => (
                <ListingCard 
                  key={listing.id}
                  listing={listing}
                  allListings={listings}
                  onRegenerateTitle={handleRegenerateTitle}
                  onRegenerateDescription={handleRegenerateDescription}
                />
              ))}
            </div>
          ) : (
            <ListingsTable 
              listings={filteredListings}
              onRegenerateTitle={handleRegenerateTitle}
              onRegenerateDescription={handleRegenerateDescription}
            />
          )}
          
          {filteredListings.length === 0 && (
            <div className="flex justify-center items-center p-8 bg-white rounded-lg shadow">
              <p className="text-gray-500">No listings match your filters.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;