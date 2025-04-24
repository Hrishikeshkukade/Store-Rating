import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import Button from '../components/shared/Button';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-12">
      <div className="text-center">
        <div className="bg-error-100 p-4 rounded-full inline-flex items-center justify-center mb-6">
          <AlertTriangle className="h-12 w-12 text-error-600" />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        
        <p className="text-lg text-gray-600 max-w-md mx-auto mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Link to="/">
          <Button leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;