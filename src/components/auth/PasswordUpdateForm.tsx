import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Lock } from 'lucide-react';
import { updateUserPassword } from '../../services/auth-service';
import { validatePassword } from '../../utils/validators';
import { useAuth } from '../../context/AuthContext';
import Input from '../shared/Input';
import Button from '../shared/Button';
import toast from 'react-hot-toast';

interface PasswordUpdateFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const PasswordUpdateForm: React.FC = () => {
  const { 
    register, 
    handleSubmit, 
    watch,
    reset,
    formState: { errors } 
  } = useForm<PasswordUpdateFormValues>();
  
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  
  const newPassword = watch('newPassword');

  const onSubmit = async (data: PasswordUpdateFormValues) => {
    if (!currentUser) {
      toast.error('You need to be logged in to update your password');
      return;
    }
    
    setLoading(true);
    try {
      await updateUserPassword(
        currentUser,
        data.currentPassword,
        data.newPassword
      );
      
      toast.success('Password updated successfully!');
      reset();
    } catch (error: any) {
      console.error(error);
      let errorMessage = 'Failed to update password. Please try again.';
      
      if (error.code === 'auth/wrong-password') {
        errorMessage = 'Current password is incorrect.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'New password is too weak.';
      } else if (error.code === 'auth/requires-recent-login') {
        errorMessage = 'Please log out and log back in before changing your password.';
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Current Password"
        type="password"
        id="currentPassword"
        leftAddon={<Lock className="h-5 w-5 text-gray-400" />}
        placeholder="Enter current password"
        error={errors.currentPassword?.message}
        fullWidth
        {...register('currentPassword', {
          required: 'Current password is required',
        })}
      />
      
      <Input
        label="New Password"
        type="password"
        id="newPassword"
        leftAddon={<Lock className="h-5 w-5 text-gray-400" />}
        placeholder="Enter new password"
        helperText="8-16 characters, 1 uppercase letter, 1 special character"
        error={errors.newPassword?.message}
        fullWidth
        {...register('newPassword', {
          required: 'New password is required',
          validate: validatePassword,
        })}
      />
      
      <Input
        label="Confirm New Password"
        type="password"
        id="confirmPassword"
        leftAddon={<Lock className="h-5 w-5 text-gray-400" />}
        placeholder="Confirm new password"
        error={errors.confirmPassword?.message}
        fullWidth
        {...register('confirmPassword', {
          required: 'Please confirm your new password',
          validate: (value) => value === newPassword || 'Passwords do not match',
        })}
      />

      <Button
        type="submit"
        fullWidth
        loading={loading}
      >
        Update Password
      </Button>
    </form>
  );
};

export default PasswordUpdateForm;