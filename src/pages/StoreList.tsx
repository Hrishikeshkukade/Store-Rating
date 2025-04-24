import React, { useState, useEffect } from 'react';
import { Store as StoreIcon, Search, MapPin } from 'lucide-react';
import { getAllStores, Store, getStoreRatings } from '../services/firestore-service';
import { filterBySearchTerm } from '../utils/helpers';
import StoreCard from '../components/store/StoreCard';
import Input from '../components/shared/Input';
import Spinner from '../components/shared/Spinner';

const StoreList: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [storeRatings, setStoreRatings] = useState<Record<string, number[]>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        const storesData = await getAllStores();
        
        setStores(storesData);
        
        // Fetch ratings for each store
        const ratingsPromises = storesData.map(async (store) => {
          const ratings = await getStoreRatings(store.id);
          return { storeId: store.id, ratings: ratings.map(r => r.value) };
        });
        
        const ratingsResults = await Promise.all(ratingsPromises);
        
        const ratingsMap: Record<string, number[]> = {};
        ratingsResults.forEach(({ storeId, ratings }) => {
          ratingsMap[storeId] = ratings;
        });
        
        setStoreRatings(ratingsMap);
      } catch (error) {
        console.error('Error fetching stores:', error);
        setError('Failed to load stores. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStores();
  }, []);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const filteredStores = searchTerm 
    ? filterBySearchTerm(stores, searchTerm, ['name', 'address'])
    : stores;
  
  const handleRatingSubmit = async () => {
    // Refresh the ratings for all stores
    const ratingsPromises = stores.map(async (store) => {
      const ratings = await getStoreRatings(store.id);
      return { storeId: store.id, ratings: ratings.map(r => r.value) };
    });
    
    const ratingsResults = await Promise.all(ratingsPromises);
    
    const ratingsMap: Record<string, number[]> = {};
    ratingsResults.forEach(({ storeId, ratings }) => {
      ratingsMap[storeId] = ratings;
    });
    
    setStoreRatings(ratingsMap);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="container-fluid">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <StoreIcon className="mr-2 h-8 w-8 text-primary-600" />
              Browse Stores
            </h1>
            <p className="mt-2 text-gray-600">
              Discover and rate stores in your area
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 w-full md:w-auto md:min-w-[300px]">
            <Input
              placeholder="Search by name or address..."
              value={searchTerm}
              onChange={handleSearch}
              leftAddon={<Search className="h-5 w-5 text-gray-400" />}
              fullWidth
            />
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-error-600">{error}</p>
          </div>
        ) : filteredStores.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <StoreIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No stores found</h3>
            <p className="mt-1 text-gray-500">
              {searchTerm
                ? `No stores match "${searchTerm}". Try a different search term.`
                : 'There are no stores available at the moment.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStores.map((store) => (
              <StoreCard
                key={store.id}
                store={store}
                ratings={storeRatings[store.id] || []}
                onRatingSubmit={handleRatingSubmit}
              />
            ))}
          </div>
        )}
        
        {!loading && !error && filteredStores.length > 0 && (
          <div className="mt-8 text-center text-gray-500 text-sm">
            Showing {filteredStores.length} of {stores.length} stores
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreList;