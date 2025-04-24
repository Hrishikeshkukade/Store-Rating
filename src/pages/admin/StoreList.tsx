import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Store as StoreIcon, Search, Edit, ArrowUp, ArrowDown, Filter, Star } from 'lucide-react';
import { getAllStores, Store, getStoreRatings } from '../../services/firestore-service';
import { filterBySearchTerm, sortByKey, calculateAverageRating } from '../../utils/helpers';
import Input from '../../components/shared/Input';
import Button from '../../components/shared/Button';
import Spinner from '../../components/shared/Spinner';
import StarRating from '../../components/shared/StarRating';

interface StoreWithRating extends Store {
  averageRating: number;
  ratingCount: number;
}

const AdminStoreList: React.FC = () => {
  const [stores, setStores] = useState<StoreWithRating[]>([]);
  const [filteredStores, setFilteredStores] = useState<StoreWithRating[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Sorting
  const [sortField, setSortField] = useState<keyof StoreWithRating>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Filters
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        const storesData = await getAllStores();
        
        // Fetch ratings for each store
        const storesWithRatings = await Promise.all(
          storesData.map(async (store) => {
            const ratings = await getStoreRatings(store.id);
            const ratingValues = ratings.map(r => r.value);
            
            return {
              ...store,
              averageRating: calculateAverageRating(ratingValues),
              ratingCount: ratingValues.length
            };
          })
        );
        
        setStores(storesWithRatings);
        setFilteredStores(storesWithRatings);
      } catch (error) {
        console.error('Error fetching stores:', error);
        setError('Failed to load stores. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStores();
  }, []);
  
  // Apply filters and search whenever stores, searchTerm, or filters change
  useEffect(() => {
    let result = [...stores];
    
    // Apply rating filter
    if (ratingFilter !== null) {
      const minRating = ratingFilter;
      const maxRating = ratingFilter + 1;
      result = result.filter(store => 
        store.averageRating >= minRating && 
        store.averageRating < maxRating
      );
    }
    
    // Apply search term filter
    if (searchTerm) {
      result = filterBySearchTerm(result, searchTerm, ['name', 'email', 'address']);
    }
    
    // Apply sorting
    result = sortByKey(result, sortField, sortOrder);
    
    setFilteredStores(result);
  }, [stores, searchTerm, ratingFilter, sortField, sortOrder]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleSort = (field: keyof StoreWithRating) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  const clearFilters = () => {
    setRatingFilter(null);
    setSearchTerm('');
    setShowFilters(false);
  };
  
  const renderSortIcon = (field: keyof StoreWithRating) => {
    if (field !== sortField) return null;
    
    return sortOrder === 'asc' ? (
      <ArrowUp className="h-4 w-4 ml-1" />
    ) : (
      <ArrowDown className="h-4 w-4 ml-1" />
    );
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container-fluid py-16 text-center">
        <h2 className="text-2xl font-bold text-error-600 mb-4">{error}</h2>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 py-8">
      <div className="container-fluid">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <StoreIcon className="mr-2 h-8 w-8 text-secondary-600" />
              Store Management
            </h1>
            <p className="mt-2 text-gray-600">
              View and manage all stores in the system
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline"
              leftIcon={<Filter className="h-4 w-4" />}
              onClick={toggleFilters}
            >
              Filters
            </Button>
          </div>
        </div>
        
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="w-full md:w-96">
              <Input
                label="Search Stores"
                placeholder="Search by name, email, address..."
                value={searchTerm}
                onChange={handleSearch}
                leftAddon={<Search className="h-5 w-5 text-gray-400" />}
                fullWidth
              />
            </div>
            
            {showFilters && (
              <div className="flex flex-col sm:flex-row gap-4 items-end flex-grow">
                <div className="w-full sm:w-auto">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Filter by Rating
                  </label>
                  <select 
                    className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition duration-200 w-full sm:w-auto"
                    value={ratingFilter === null ? '' : ratingFilter}
                    onChange={(e) => setRatingFilter(e.target.value === '' ? null : Number(e.target.value))}
                  >
                    <option value="">All Ratings</option>
                    <option value="0">0 - 1 Stars</option>
                    <option value="1">1 - 2 Stars</option>
                    <option value="2">2 - 3 Stars</option>
                    <option value="3">3 - 4 Stars</option>
                    <option value="4">4 - 5 Stars</option>
                  </select>
                </div>
                
                <Button 
                  variant="outline"
                  size="sm" 
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Stores Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          {filteredStores.length === 0 ? (
            <div className="p-8 text-center">
              <StoreIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No stores found</h3>
              <p className="text-gray-500">
                {searchTerm || ratingFilter !== null
                  ? 'Try adjusting your search filters'
                  : 'There are no stores in the system yet'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      className="table-cell-header"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center cursor-pointer">
                        <span>Name</span>
                        {renderSortIcon('name')}
                      </div>
                    </th>
                    <th 
                      className="table-cell-header"
                      onClick={() => handleSort('email')}
                    >
                      <div className="flex items-center cursor-pointer">
                        <span>Email</span>
                        {renderSortIcon('email')}
                      </div>
                    </th>
                    <th 
                      className="table-cell-header"
                      onClick={() => handleSort('address')}
                    >
                      <div className="flex items-center cursor-pointer">
                        <span>Address</span>
                        {renderSortIcon('address')}
                      </div>
                    </th>
                    <th 
                      className="table-cell-header"
                      onClick={() => handleSort('averageRating')}
                    >
                      <div className="flex items-center cursor-pointer">
                        <span>Rating</span>
                        {renderSortIcon('averageRating')}
                      </div>
                    </th>
                    <th className="table-cell-header">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStores.map((store) => (
                    <tr key={store.id} className="hover:bg-gray-50 transition-colors">
                      <td className="table-cell">
                        <div className="text-sm font-medium text-gray-900">{store.name}</div>
                      </td>
                      <td className="table-cell">
                        <div className="text-sm text-gray-500">{store.email}</div>
                      </td>
                      <td className="table-cell">
                        <div className="text-sm text-gray-500 max-w-xs truncate">{store.address}</div>
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center">
                          <StarRating value={store.averageRating} readonly size="sm" />
                          <span className="ml-2 text-sm text-gray-500">
                            ({store.averageRating.toFixed(1)}) · {store.ratingCount} reviews
                          </span>
                        </div>
                      </td>
                      <td className="table-cell">
                        <Link to={`/stores/${store.id}`}>
                          <Button
                            size="sm"
                            variant="outline"
                            leftIcon={<Eye className="h-4 w-4" />}
                          >
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Pagination could be added here */}
        
        {filteredStores.length > 0 && (
          <div className="mt-4 text-sm text-gray-500 text-center">
            Showing {filteredStores.length} of {stores.length} stores
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminStoreList;