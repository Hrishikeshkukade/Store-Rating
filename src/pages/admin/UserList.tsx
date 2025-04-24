import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UsersRound, Search, Edit, ArrowUp, ArrowDown, Filter } from 'lucide-react';
import { getAllUsers, UserData, USER_ROLES } from '../../services/auth-service';
import { filterBySearchTerm, sortByKey } from '../../utils/helpers';
import Input from '../../components/shared/Input';
import Button from '../../components/shared/Button';
import Spinner from '../../components/shared/Spinner';

const AdminUserList: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Sorting
  const [sortField, setSortField] = useState<keyof UserData>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Filters
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(true);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const usersData = await getAllUsers();
        setUsers(usersData);
        setFilteredUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to load users. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  // Apply filters and search whenever users, searchTerm, or filters change
  useEffect(() => {
    let result = [...users];
    
    // Apply role filter
    if (roleFilter !== 'all') {
      result = result.filter(user => user.role === roleFilter);
    }
    
    // Apply search term filter
    if (searchTerm) {
      result = filterBySearchTerm(result, searchTerm, ['name', 'email', 'address']);
    }
    
    // Apply sorting
    result = sortByKey(result, sortField, sortOrder);
    
    setFilteredUsers(result);
  }, [users, searchTerm, roleFilter, sortField, sortOrder]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleSort = (field: keyof UserData) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };
  
  const clearFilters = () => {
    setRoleFilter('all');
    setSearchTerm('');
  };
  
  const renderSortIcon = (field: keyof UserData) => {
    if (field !== sortField) return null;
    
    return sortOrder === 'asc' ? (
      <ArrowUp className="h-4 w-4 ml-1" />
    ) : (
      <ArrowDown className="h-4 w-4 ml-1" />
    );
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case USER_ROLES.ADMIN:
        return 'bg-primary-100 text-primary-800';
      case USER_ROLES.STORE_OWNER:
        return 'bg-secondary-100 text-secondary-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
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
              <UsersRound className="mr-2 h-8 w-8 text-primary-600" />
              User Management
            </h1>
            <p className="mt-2 text-gray-600">
              View and manage all users in the system
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
        
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Input
                label="Search Users"
                placeholder="Search by name, email, address..."
                value={searchTerm}
                onChange={handleSearch}
                leftAddon={<Search className="h-5 w-5 text-gray-400" />}
                fullWidth
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Role
              </label>
              <select 
                className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition duration-200"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value={USER_ROLES.ADMIN}>Administrators</option>
                <option value={USER_ROLES.STORE_OWNER}>Store Owners</option>
                <option value={USER_ROLES.USER}>Normal Users</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <Button 
                variant="outline"
                onClick={clearFilters}
                disabled={roleFilter === 'all' && !searchTerm}
                fullWidth
              >
                Clear Filters
              </Button>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
            <div className="bg-primary-50 rounded-lg p-4">
              <p className="text-sm text-primary-600 font-medium">Administrators</p>
              <p className="text-2xl font-bold text-primary-700">
                {users.filter(u => u.role === USER_ROLES.ADMIN).length}
              </p>
            </div>
            <div className="bg-secondary-50 rounded-lg p-4">
              <p className="text-sm text-secondary-600 font-medium">Store Owners</p>
              <p className="text-2xl font-bold text-secondary-700">
                {users.filter(u => u.role === USER_ROLES.STORE_OWNER).length}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 font-medium">Normal Users</p>
              <p className="text-2xl font-bold text-gray-700">
                {users.filter(u => u.role === USER_ROLES.USER).length}
              </p>
            </div>
          </div>
        </div>
        
        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          {filteredUsers.length === 0 ? (
            <div className="p-8 text-center">
              <UsersRound className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No users found</h3>
              <p className="text-gray-500">
                {searchTerm || roleFilter !== 'all'
                  ? 'Try adjusting your search filters'
                  : 'There are no users in the system yet'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      className="table-cell-header"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center cursor-pointer">
                        <span>Name</span>
                        {renderSortIcon('name')}
                      </div>
                    </th>
                    <th 
                      className="table-cell-header"
                      onClick={() => handleSort('email')}
                    >
                      <div className="flex items-center cursor-pointer">
                        <span>Email</span>
                        {renderSortIcon('email')}
                      </div>
                    </th>
                    <th 
                      className="table-cell-header"
                      onClick={() => handleSort('address')}
                    >
                      <div className="flex items-center cursor-pointer">
                        <span>Address</span>
                        {renderSortIcon('address')}
                      </div>
                    </th>
                    <th 
                      className="table-cell-header"
                      onClick={() => handleSort('role')}
                    >
                      <div className="flex items-center cursor-pointer">
                        <span>Role</span>
                        {renderSortIcon('role')}
                      </div>
                    </th>
                    <th className="table-cell-header">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.uid} className="hover:bg-gray-50 transition-colors">
                      <td className="table-cell">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </td>
                      <td className="table-cell">
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </td>
                      <td className="table-cell">
                        <div className="text-sm text-gray-500 max-w-xs truncate">{user.address}</div>
                      </td>
                      <td className="table-cell">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                          {user.role === USER_ROLES.ADMIN 
                            ? 'Administrator' 
                            : user.role === USER_ROLES.STORE_OWNER
                              ? 'Store Owner'
                              : 'Normal User'}
                        </span>
                      </td>
                      <td className="table-cell">
                        <Link to={`/admin/users/${user.uid}`}>
                          <Button
                            size="sm"
                            variant="outline"
                            leftIcon={<Edit className="h-4 w-4" />}
                          >
                            Edit
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {filteredUsers.length > 0 && (
          <div className="mt-4 text-sm text-gray-500 text-center">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUserList;