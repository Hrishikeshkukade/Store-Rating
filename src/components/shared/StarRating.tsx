import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '../../utils/helpers';

interface StarRatingProps {
  value: number;
  onChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
  className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  size = 'md',
  readonly = false,
  className,
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };
  
  const handleMouseEnter = (rating: number) => {
    if (readonly) return;
    setHoverRating(rating);
  };
  
  const handleMouseLeave = () => {
    if (readonly) return;
    setHoverRating(0);
  };
  
  const handleClick = (rating: number) => {
    if (readonly || !onChange) return;
    onChange(rating);
  };
  
  return (
    <div className={cn("flex", className)}>
      {[1, 2, 3, 4, 5].map((rating) => (
        <button
          key={rating}
          type="button"
          className={cn(
            "focus:outline-none transition-colors duration-200",
            !readonly && "hover:scale-110 transition-transform duration-200",
            readonly && "cursor-default"
          )}
          onMouseEnter={() => handleMouseEnter(rating)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(rating)}
          disabled={readonly}
        >
          <Star
            className={cn(
              sizeClasses[size],
              (rating <= (hoverRating || value))
                ? "text-accent-500 fill-accent-500"
                : "text-gray-300",
              !readonly && "hover:text-accent-400"
            )}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;