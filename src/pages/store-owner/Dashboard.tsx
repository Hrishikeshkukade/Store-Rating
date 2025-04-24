import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Store, Star, Users, ArrowLeft, User } from 'lucide-react';
import { 
  getStoreByOwner, 
  getStoreRatings, 
  getUsersWhoRatedStore,
  Store as StoreType
} from '../../services/firestore-service';
import { useAuth } from '../../context/AuthContext';
import { calculateAverageRating, formatDate } from '../../utils/helpers';
import Button from '../../components/shared/Button';
import StarRating from '../../components/shared/StarRating';
import Spinner from '../../components/shared/Spinner';

interface UserWithRating {
  uid: string;
  name: string;
  email: string;
  ratingValue: number;
  ratingDate: number;
}

const StoreOwnerDashboard: React.FC = () => {
  const { userData } = useAuth();
  
  const [store, setStore] = useState<StoreType | null>(null);
  const [ratings, setRatings] = useState<Array<{ id: string; value: number; createdAt: number; userId: string }>>([]);
  const [users, setUsers] = useState<UserWithRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchStoreData = async () => {
      if (!userData) return;
  
      try {
        setLoading(true);
  
        // ✅ fetch the store that belongs to this owner
        const storeData = await getStoreByOwner(userData.uid);
        if (!storeData) {
          setError('You don’t have a store yet. Please ask an admin to create one.');
          return;
        }
  
        setStore(storeData);
  
        // ratings and users
        const ratingsData = await getStoreRatings(storeData.id);
        setRatings(ratingsData);
  
        const userDetails = await getUsersWhoRatedStore(storeData.id);
        const merged: UserWithRating[] = ratingsData.map(r => {
          const u = userDetails.find(u => u.uid === r.userId);
          return {
            uid: r.userId,
            name: u?.name ?? 'Anonymous',
            email: u?.email ?? '—',
            ratingValue: r.value,
            ratingDate: r.createdAt,
          };
        });
        setUsers(merged);
      } catch (err) {
        console.error(err);
        setError('Failed to load store data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchStoreData();
  }, [userData]);
  
  
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
      </div>
    );
  }
  
  const averageRating = calculateAverageRating(ratings.map(r => r.value));
  
  return (
    <div className="bg-gray-50 py-8">
      <div className="container-fluid">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Store className="mr-2 h-8 w-8 text-secondary-600" />
              Store Dashboard
            </h1>
            <p className="mt-2 text-gray-600">
              Monitor your store's performance and customer ratings
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Link to="/stores">
              <Button leftIcon={<Store className="h-4 w-4" />}>
                View All Stores
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Store Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 mb-1">Store Name</p>
                <h3 className="text-xl font-bold">{store?.name || 'Your Store'}</h3>
              </div>
              <div className="bg-secondary-100 p-3 rounded-full">
                <Store className="h-6 w-6 text-secondary-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-gray-600">
                Email: {store?.email || 'store@example.com'}
              </span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 mb-1">Average Rating</p>
                <h3 className="text-3xl font-bold">{averageRating.toFixed(1)}</h3>
              </div>
              <div className="bg-accent-100 p-3 rounded-full">
                <Star className="h-6 w-6 text-accent-600" />
              </div>
            </div>
            <div className="mt-2">
              <StarRating value={averageRating} readonly />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 mb-1">Total Reviews</p>
                <h3 className="text-3xl font-bold">{ratings.length}</h3>
              </div>
              <div className="bg-primary-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-primary-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-gray-600">
                From {users.length} unique users
              </span>
            </div>
          </div>
        </div>
        
        {/* Distribution of ratings */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 mb-8">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold">Rating Distribution</h2>
          </div>
          
          <div className="p-6">
            {[5, 4, 3, 2, 1].map(rating => {
              const count = ratings.filter(r => Math.floor(r.value) === rating).length;
              const percentage = ratings.length > 0 ? (count / ratings.length) * 100 : 0;
              
              return (
                <div key={rating} className="flex items-center mb-4 last:mb-0">
                  <div className="flex items-center w-24">
                    <span className="text-sm font-medium mr-2">{rating} stars</span>
                    <Star className="h-4 w-4 text-accent-500 fill-accent-500" />
                  </div>
                  
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-accent-500 h-2.5 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="w-20 text-right">
                    <span className="text-sm text-gray-600">{count} ({percentage.toFixed(1)}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Users who rated */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold">Users Who Rated Your Store</h2>
          </div>
          
          {users.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No ratings yet</h3>
              <p className="text-gray-500">Your store hasn't received any ratings yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="table-cell-header">User</th>
                    <th className="table-cell-header">Rating</th>
                    <th className="table-cell-header">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="table-cell">
                        <div className="flex items-center">
                          <div className="bg-gray-100 p-2 rounded-full mr-3">
                            <User className="h-5 w-5 text-gray-500" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="table-cell">
                        <StarRating value={user.ratingValue} readonly size="sm" />
                      </td>
                      <td className="table-cell">
                        <div className="text-sm text-gray-500">{formatDate(user.ratingDate)}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoreOwnerDashboard;