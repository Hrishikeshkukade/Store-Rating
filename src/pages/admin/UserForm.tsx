import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, User, Mail, MapPin, Lock, UserPlus, Save, Store } from 'lucide-react';
import { getCurrentUserData, USER_ROLES, UserRole, createAdminUser, updateUserData } from '../../services/auth-service';
import { addStore } from '../../services/firestore-service';
import { validateName, validateAddress, validateEmail, validatePassword } from '../../utils/validators';
import Input from '../../components/shared/Input';
import Button from '../../components/shared/Button';
import Spinner from '../../components/shared/Spinner';
import toast from 'react-hot-toast';

interface UserFormValues {
  name: string;
  email: string;
  address: string;
  password?: string;
  confirmPassword?: string;
  role: UserRole;
  storeName?: string;
}

const AdminUserForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    register, 
    handleSubmit, 
    watch,
    reset,
    formState: { errors } 
  } = useForm<UserFormValues>({
    defaultValues: {
      role: USER_ROLES.USER
    }
  });
  
  const password = watch('password');
  const selectedRole = watch('role');
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isEditMode) return;
      
      try {
        setLoading(true);
        const userData = await getCurrentUserData(id);
        
        if (!userData) {
          setError('User not found');
          return;
        }
        
        reset({
          name: userData.name,
          email: userData.email,
          address: userData.address,
          role: userData.role
        });
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [id, isEditMode, reset]);
  
  const onSubmit = async (data: UserFormValues) => {
    setSubmitting(true);
    
    try {
      if (isEditMode) {
        // Update existing user
        await updateUserData(id, {
          name: data.name,
          address: data.address,
          role: data.role
        });
        
        // If changing to store owner, create their store
        if (data.role === USER_ROLES.STORE_OWNER && data.storeName) {
          await addStore({
            name: data.storeName,
            email: data.email,
            address: data.address,
            ownerId: id,
            createdAt: Date.now()
          });
        }
        
        toast.success('User updated successfully');
      } else {
        // Create new user
        const userData = await createAdminUser(
          data.email,
          data.password!,
          data.name,
          data.address,
          data.role
        );
        
        // If creating a store owner, create their store
        if (data.role === USER_ROLES.STORE_OWNER && data.storeName) {
          await addStore({
            name: data.storeName,
            email: data.email,
            address: data.address,
            ownerId: userData.uid,
            createdAt: Date.now()
          });
          toast.success('Store owner and store created successfully');
        } else {
          toast.success('User created successfully');
        }
      }
      
      // Redirect to user list
      navigate('/admin/users');
    } catch (error: any) {
      console.error('Error saving user:', error);
      let errorMessage = 'Failed to save user. Please try again.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already in use.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email format.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak.';
      }
      
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
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
        <Link to="/admin/users">
          <Button leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Back to Users
          </Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 py-8">
      <div className="container-fluid">
        <Link to="/admin/users" className="inline-flex items-center text-primary-600 font-medium mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to User List
        </Link>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white">
            <h1 className="text-2xl font-bold flex items-center">
              {isEditMode ? (
                <>
                  <User className="h-6 w-6 mr-2" />
                  Edit User
                </>
              ) : (
                <>
                  <UserPlus className="h-6 w-6 mr-2" />
                  Add New User
                </>
              )}
            </h1>
            <p className="mt-1 text-primary-100">
              {isEditMode
                ? 'Update user information and role'
                : 'Create a new user account'}
            </p>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  type="text"
                  id="name"
                  leftAddon={<User className="h-5 w-5 text-gray-400" />}
                  placeholder="Enter full name"
                  error={errors.name?.message}
                  fullWidth
                  {...register('name', {
                    required: 'Name is required',
                    validate: validateName,
                  })}
                />
                
                <Input
                  label="Email Address"
                  type="email"
                  id="email"
                  leftAddon={<Mail className="h-5 w-5 text-gray-400" />}
                  placeholder="Enter email address"
                  error={errors.email?.message}
                  fullWidth
                  disabled={isEditMode}
                  {...register('email', {
                    required: 'Email is required',
                    validate: validateEmail,
                  })}
                />
                
                <div className="md:col-span-2">
                  <Input
                    label="Address"
                    type="text"
                    id="address"
                    leftAddon={<MapPin className="h-5 w-5 text-gray-400" />}
                    placeholder="Enter address"
                    error={errors.address?.message}
                    fullWidth
                    {...register('address', {
                      required: 'Address is required',
                      validate: validateAddress,
                    })}
                  />
                </div>
                
                {!isEditMode && (
                  <>
                    <Input
                      label="Password"
                      type="password"
                      id="password"
                      leftAddon={<Lock className="h-5 w-5 text-gray-400" />}
                      placeholder="Create a password"
                      helperText="8-16 characters, 1 uppercase letter, 1 special character"
                      error={errors.password?.message}
                      fullWidth
                      {...register('password', {
                        required: 'Password is required',
                        validate: validatePassword,
                      })}
                    />
                    
                    <Input
                      label="Confirm Password"
                      type="password"
                      id="confirmPassword"
                      leftAddon={<Lock className="h-5 w-5 text-gray-400" />}
                      placeholder="Confirm password"
                      error={errors.confirmPassword?.message}
                      fullWidth
                      {...register('confirmPassword', {
                        required: 'Please confirm the password',
                        validate: (value) => value === password || 'Passwords do not match',
                      })}
                    />
                  </>
                )}
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="role">
                    User Role
                  </label>
                  <select
                    id="role"
                    className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition duration-200"
                    {...register('role', { required: 'Role is required' })}
                  >
                    <option value={USER_ROLES.USER}>Normal User</option>
                    <option value={USER_ROLES.STORE_OWNER}>Store Owner</option>
                    <option value={USER_ROLES.ADMIN}>Administrator</option>
                  </select>
                  {errors.role && (
                    <p className="mt-1 text-xs text-error-600">{errors.role.message}</p>
                  )}
                </div>

                {selectedRole === USER_ROLES.STORE_OWNER && (
                  <div className="md:col-span-2">
                    <Input
                      label="Store Name"
                      type="text"
                      id="storeName"
                      leftAddon={<Store className="h-5 w-5 text-gray-400" />}
                      placeholder="Enter store name"
                      error={errors.storeName?.message}
                      fullWidth
                      {...register('storeName', {
                        required: 'Store name is required for store owners',
                        validate: validateName,
                      })}
                    />
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <Link to="/admin/users">
                  <Button variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  loading={submitting}
                  leftIcon={<Save className="h-4 w-4" />}
                >
                  {isEditMode ? 'Update User' : 'Create User'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserForm;