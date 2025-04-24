import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Mail, ArrowLeft, Star, User } from 'lucide-react';
import { 
  getStoreById, 
  getStoreRatings, 
  getUserRatingForStore,
  upsertRating,
  Store
} from '../services/firestore-service';
import { useAuth } from '../context/AuthContext';
import { calculateAverageRating, formatDate } from '../utils/helpers';
import Button from '../components/shared/Button';
import StarRating from '../components/shared/StarRating';
import Spinner from '../components/shared/Spinner';
import toast from 'react-hot-toast';

const StoreDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser, userData, isAdmin, isStoreOwner } = useAuth();
  
  const [store, setStore] = useState<Store | null>(null);
  const [ratings, setRatings] = useState<Array<{ id: string; value: number; createdAt: number; updatedAt: number | null }>>([]);
  const [userRating, setUserRating] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    const fetchStoreData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Fetch store details
        const storeData = await getStoreById(id);
        if (!storeData) {
          setError('Store not found');
          return;
        }
        
        setStore(storeData);
        
        // Fetch store ratings
        const ratingsData = await getStoreRatings(id);
        setRatings(ratingsData);
        
        // Fetch user's rating if logged in
        if (currentUser) {
          const userRatingData = await getUserRatingForStore(currentUser.uid, id);
          if (userRatingData) {
            setUserRating(userRatingData.value);
          }
        }
      } catch (err) {
        console.error('Error fetching store data:', err);
        setError('Failed to load store data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStoreData();
  }, [id, currentUser]);
  
  const handleSubmitRating = async (rating: number) => {
    if (!currentUser || !userData || !id) {
      toast.error('You must be logged in to submit a rating');
      return;
    }
    
    // If user is a store owner or admin, they shouldn't be able to rate stores
    if (isAdmin || isStoreOwner) {
      toast.error('Admins and store owners cannot rate stores');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await upsertRating(currentUser.uid, id, rating);
      setUserRating(rating);
      
      // Refresh the ratings
      const updatedRatings = await getStoreRatings(id);
      setRatings(updatedRatings);
      
      toast.success(userRating ? 'Rating updated successfully!' : 'Rating submitted successfully!');
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error('Failed to submit rating. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (error || !store) {
    return (
      <div className="container-fluid py-16 text-center">
        <h2 className="text-2xl font-bold text-error-600 mb-4">{error || 'Store not found'}</h2>
        <Link to="/stores">
          <Button leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Back to Stores
          </Button>
        </Link>
      </div>
    );
  }
  
  const averageRating = calculateAverageRating(ratings.map(r => r.value));
  
  return (
    <div className="bg-gray-50 py-8">
      <div className="container-fluid">
        <Link to="/stores" className="inline-flex items-center text-primary-600 font-medium mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Store List
        </Link>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Store Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-8 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">{store.name}</h1>
                <div className="flex items-start mb-2">
                  <MapPin className="h-5 w-5 mr-1 flex-shrink-0 mt-0.5" />
                  <p>{store.address}</p>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-1" />
                  <p>{store.email}</p>
                </div>
              </div>
              
              <div className="mt-6 md:mt-0 bg-white/10 p-4 rounded-lg text-center">
                <div className="flex items-center justify-center">
                  <StarRating value={averageRating} size="lg" readonly />
                </div>
                <p className="text-2xl font-bold mt-2">{averageRating.toFixed(1)}</p>
                <p className="text-sm">{ratings.length} ratings</p>
              </div>
            </div>
          </div>
          
          {/* Rating Section */}
          {currentUser && userData && !isAdmin && !isStoreOwner && (
            <div className="p-8 border-b border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Your Rating</h2>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="mb-4 sm:mb-0">
                    <p className="text-gray-600 mb-2">Rate this store:</p>
                    <StarRating
                      value={userRating}
                      onChange={setUserRating}
                      size="lg"
                    />
                  </div>
                  
                  <Button
                    onClick={() => handleSubmitRating(userRating)}
                    loading={isSubmitting}
                    disabled={userRating === 0}
                  >
                    {userRating > 0 ? 'Update Rating' : 'Submit Rating'}
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Ratings List */}
          <div className="p-8">
            <h2 className="text-xl font-semibold mb-4">All Ratings</h2>
            
            {ratings.length === 0 ? (
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <Star className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500">No ratings yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {ratings.map((rating) => (
                  <div key={rating.id} className="border border-gray-100 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-gray-100 p-2 rounded-full mr-3">
                          <User className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium">Anonymous User</p>
                          <p className="text-sm text-gray-500">
                            {rating.updatedAt 
                              ? `Updated on ${formatDate(rating.updatedAt)}`
                              : `Rated on ${formatDate(rating.createdAt)}`
                            }
                          </p>
                        </div>
                      </div>
                      <StarRating value={rating.value} readonly />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreDetail;