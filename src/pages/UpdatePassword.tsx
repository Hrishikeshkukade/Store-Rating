import React from 'react';
import { Lock } from 'lucide-react';
import PasswordUpdateForm from '../components/auth/PasswordUpdateForm';

const UpdatePassword: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <div className="mx-auto h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center">
              <Lock className="h-6 w-6 text-primary-600" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Update Password</h2>
            <p className="mt-2 text-gray-600">
              Change your account password
            </p>
          </div>
          
          <PasswordUpdateForm />
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;