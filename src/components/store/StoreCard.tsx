import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, ExternalLink } from 'lucide-react';
import { Store } from '../../services/firestore-service';
import { useAuth } from '../../context/AuthContext';
import { getUserRatingForStore, upsertRating } from '../../services/firestore-service';
import { calculateAverageRating, truncateText } from '../../utils/helpers';
import Button from '../shared/Button';
import StarRating from '../shared/StarRating';
import toast from 'react-hot-toast';

interface StoreCardProps {
  store: Store;
  ratings: number[];
  onRatingSubmit?: () => void;
}

const StoreCard: React.FC<StoreCardProps> = ({ 
  store, 
  ratings, 
  onRatingSubmit 
}) => {
  const { currentUser, userData, isAdmin, isStoreOwner } = useAuth();
  const [userRating, setUserRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  
  const averageRating = calculateAverageRating(ratings);
  
  // Fetch user's rating for this store, if any
  useEffect(() => {
    const fetchUserRating = async () => {
      if (!currentUser) return;
      
      try {
        const ratingData = await getUserRatingForStore(currentUser.uid, store.id);
        if (ratingData) {
          setUserRating(ratingData.value);
        }
      } catch (error) {
        console.error('Error fetching user rating:', error);
      }
    };
    
    fetchUserRating();
  }, [currentUser, store.id]);
  
  const handleSubmitRating = async (rating: number) => {
    if (!currentUser || !userData) {
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
      await upsertRating(currentUser.uid, store.id, rating);
      setUserRating(rating);
      setShowRatingModal(false);
      toast.success(userRating ? 'Rating updated successfully!' : 'Rating submitted successfully!');
      
      // Call the onRatingSubmit callback if provided
      if (onRatingSubmit) {
        onRatingSubmit();
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error('Failed to submit rating. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="card overflow-hidden transition-all duration-200 hover:shadow-md">
        <div className="p-5">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold mb-2">{store.name}</h3>
            <div className="flex items-center bg-accent-50 px-2 py-1 rounded">
              <Star className="h-4 w-4 text-accent-500 fill-accent-500 mr-1" />
              <span className="font-medium">{averageRating}</span>
              <span className="text-xs text-gray-500 ml-1">({ratings.length})</span>
            </div>
          </div>
          
          <div className="flex items-start mb-3">
            <MapPin className="h-4 w-4 text-gray-400 mt-1 mr-1 flex-shrink-0" />
            <p className="text-gray-600 text-sm">
              {truncateText(store.address, 100)}
            </p>
          </div>
          
          {currentUser && userData && !isAdmin && !isStoreOwner && (
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">Your rating:</span>
                {userRating > 0 ? (
                  <StarRating value={userRating} readonly size="sm" />
                ) : (
                  <span className="text-sm text-gray-500">Not rated</span>
                )}
              </div>
              
              <Button
                size="sm"
                variant={userRating > 0 ? "outline" : "primary"}
                onClick={() => setShowRatingModal(true)}
              >
                {userRating > 0 ? 'Edit Rating' : 'Rate Now'}
              </Button>
            </div>
          )}
          
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
            <span className="text-sm text-gray-500">{store.email}</span>
            <Link 
              to={`/stores/${store.id}`}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
            >
              View Details
              <ExternalLink className="h-3.5 w-3.5 ml-1" />
            </Link>
          </div>
        </div>
      </div>
      
      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 animate-fade-in">
            <h3 className="text-lg font-semibold mb-4">Rate {store.name}</h3>
            
            <p className="text-gray-600 mb-4">
              How would you rate your experience with this store?
            </p>
            
            <div className="flex justify-center mb-6">
              <StarRating 
                value={userRating} 
                onChange={setUserRating} 
                size="lg" 
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowRatingModal(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleSubmitRating(userRating)}
                loading={isSubmitting}
                disabled={userRating === 0}
              >
                Submit Rating
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StoreCard;