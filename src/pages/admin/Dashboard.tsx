import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UsersRound, Store, Star, TrendingUp, Users, BarChart3 } from 'lucide-react';
import { getDashboardCounts } from '../../services/firestore-service';
import Button from '../../components/shared/Button';
import Spinner from '../../components/shared/Spinner';

interface DashboardCounts {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
}

const AdminDashboard: React.FC = () => {
  const [counts, setCounts] = useState<DashboardCounts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const dashboardData = await getDashboardCounts();
        setCounts(dashboardData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
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
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 py-8">
      <div className="container-fluid">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <BarChart3 className="mr-2 h-8 w-8 text-primary-600" />
              Admin Dashboard
            </h1>
            <p className="mt-2 text-gray-600">
              Overview of the platform statistics and management tools
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
            <Link to="/admin/users/new">
              <Button leftIcon={<UsersRound className="h-4 w-4" />}>
                Add User
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 mb-1">Total Users</p>
                <h3 className="text-3xl font-bold">{counts?.totalUsers}</h3>
              </div>
              <div className="bg-primary-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-primary-600" />
              </div>
            </div>
            <div className="mt-4">
              <Link to="/admin/users" className="text-primary-600 text-sm font-medium hover:underline">
                View All Users
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 mb-1">Total Stores</p>
                <h3 className="text-3xl font-bold">{counts?.totalStores}</h3>
              </div>
              <div className="bg-secondary-100 p-3 rounded-full">
                <Store className="h-6 w-6 text-secondary-600" />
              </div>
            </div>
            <div className="mt-4">
              <Link to="/stores" className="text-secondary-600 text-sm font-medium hover:underline">
                View All Stores
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 mb-1">Total Ratings</p>
                <h3 className="text-3xl font-bold">{counts?.totalRatings}</h3>
              </div>
              <div className="bg-accent-100 p-3 rounded-full">
                <Star className="h-6 w-6 text-accent-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-accent-600 text-sm font-medium">
                Average: {(counts?.totalRatings && counts?.totalStores) 
                  ? (counts.totalRatings / counts.totalStores).toFixed(1) 
                  : '0'} / 5
              </span>
            </div>
          </div>
        </div>
        
        {/* Quick Access */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Quick Access</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Link to="/admin/users" className="group">
              <div className="border border-gray-200 rounded-lg p-4 hover:border-primary-400 hover:bg-primary-50 transition-colors">
                <div className="flex items-center">
                  <div className="bg-primary-100 p-3 rounded-full mr-4 group-hover:bg-primary-200 transition-colors">
                    <UsersRound className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Manage Users</h3>
                    <p className="text-sm text-gray-500">View, add, and edit users</p>
                  </div>
                </div>
              </div>
            </Link>
            
            <Link to="/stores" className="group">
              <div className="border border-gray-200 rounded-lg p-4 hover:border-secondary-400 hover:bg-secondary-50 transition-colors">
                <div className="flex items-center">
                  <div className="bg-secondary-100 p-3 rounded-full mr-4 group-hover:bg-secondary-200 transition-colors">
                    <Store className="h-5 w-5 text-secondary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Manage Stores</h3>
                    <p className="text-sm text-gray-500">View and manage store listings</p>
                  </div>
                </div>
              </div>
            </Link>
            
            <Link to="/stores" className="group">
              <div className="border border-gray-200 rounded-lg p-4 hover:border-accent-400 hover:bg-accent-50 transition-colors">
                <div className="flex items-center">
                  <div className="bg-accent-100 p-3 rounded-full mr-4 group-hover:bg-accent-200 transition-colors">
                    <Star className="h-5 w-5 text-accent-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Browse Stores</h3>
                    <p className="text-sm text-gray-500">View all store listings</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold mb-4">System Overview</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">System Status</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                Online
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Database Status</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                Connected
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Firebase Authentication</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;