import React from 'react';
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import LoginForm from '../components/auth/LoginForm';

const Login: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <div className="mx-auto h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center">
              <LogIn className="h-6 w-6 text-primary-600" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Sign in to your account</h2>
            <p className="mt-2 text-gray-600">
              Access your store ratings and profile
            </p>
          </div>
          
          <LoginForm />
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                Sign up now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;