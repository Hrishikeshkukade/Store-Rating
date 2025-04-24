import React, { forwardRef } from 'react';
import { cn } from '../../utils/helpers';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label, 
    error, 
    helperText, 
    leftAddon, 
    rightAddon, 
    className, 
    fullWidth, 
    ...props 
  }, ref) => {
    return (
      <div className={cn('mb-4', fullWidth && 'w-full')}>
        {label && (
          <label 
            htmlFor={props.id} 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        
        <div className={cn('relative', fullWidth && 'w-full')}>
          {leftAddon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              {leftAddon}
            </div>
          )}
          
          <input
            ref={ref}
            className={cn(
              'bg-white border rounded-md text-sm transition duration-200',
              'focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent',
              error ? 'border-error-500' : 'border-gray-300',
              leftAddon ? 'pl-10' : 'pl-3',
              rightAddon ? 'pr-10' : 'pr-3',
              'py-2',
              fullWidth && 'w-full',
              className
            )}
            {...props}
          />
          
          {rightAddon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {rightAddon}
            </div>
          )}
        </div>
        
        {error && (
          <p className="mt-1 text-xs text-error-600">{error}</p>
        )}
        
        {helperText && !error && (
          <p className="mt-1 text-xs text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;