import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Combine classes with Tailwind's conflict resolution
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date to readable string
export function formatDate(date: Date | number | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Calculate average rating from an array of ratings
export function calculateAverageRating(ratings: number[]): number {
  if (!ratings.length) return 0;
  const sum = ratings.reduce((acc, rating) => acc + rating, 0);
  return parseFloat((sum / ratings.length).toFixed(1));
}

// Helper to truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// Generate a random ID (for development purposes)
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

// Sort an array of objects by a specific key
export function sortByKey<T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
  return [...array].sort((a, b) => {
    const valueA = a[key];
    const valueB = b[key];
    
    if (valueA < valueB) return order === 'asc' ? -1 : 1;
    if (valueA > valueB) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

// Filter an array of objects based on a search term and specified keys
export function filterBySearchTerm<T>(array: T[], searchTerm: string, keys: (keyof T)[]): T[] {
  if (!searchTerm.trim()) return array;
  
  const lowercasedTerm = searchTerm.toLowerCase();
  
  return array.filter(item => {
    return keys.some(key => {
      const value = item[key];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(lowercasedTerm);
      }
      return false;
    });
  });
}