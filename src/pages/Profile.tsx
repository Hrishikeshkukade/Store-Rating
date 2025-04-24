import React from 'react';
import { User, Mail, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/shared/Button';

const Profile: React.FC = () => {
  const { userData } = useAuth();

  if (!userData) return null;

  return (
    <div className="min-h-[calc(100vh-200px)] bg-gray-50 py-12">
      <div className="container-fluid">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-8 text-white">
              <h1 className="text-3xl font-bold mb-2">Profile</h1>
              <p className="text-primary-100">Manage your account information</p>
            </div>
            
            <div className="p-8">
              <div className="space-y-6">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{userData.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="font-medium">{userData.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium">{userData.address}</p>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-gray-100">
                  <p className="text-sm text-gray-500 mb-2">Account Type</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    {userData.role === 'admin' 
                      ? 'Administrator'
                      : userData.role === 'store_owner'
                        ? 'Store Owner'
                        : 'Normal User'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;