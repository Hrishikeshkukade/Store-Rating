import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, User, MapPin } from 'lucide-react';
import { signUpUser, USER_ROLES } from '../../services/auth-service';
import { validateName, validateAddress, validateEmail, validatePassword } from '../../utils/validators';
import Input from '../shared/Input';
import Button from '../shared/Button';
import toast from 'react-hot-toast';

interface RegisterFormValues {
  name: string;
  email: string;
  address: string;
  password: string;
  confirmPassword: string;
}

const RegisterForm: React.FC = () => {
  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors } 
  } = useForm<RegisterFormValues>();
  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const password = watch('password');

  const onSubmit = async (data: RegisterFormValues) => {
    setLoading(true);
    try {
      await signUpUser(
        data.email,
        data.password,
        data.name,
        data.address,
        USER_ROLES.USER // Default role for registration is 'user'
      );
      
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error: any) {
      console.error(error);
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already in use.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak.';
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Full Name"
        type="text"
        id="name"
        leftAddon={<User className="h-5 w-5 text-gray-400" />}
        placeholder="Enter your full name"
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
        placeholder="Enter your email"
        error={errors.email?.message}
        fullWidth
        {...register('email', {
          required: 'Email is required',
          validate: validateEmail,
        })}
      />
      
      <Input
        label="Address"
        type="text"
        id="address"
        leftAddon={<MapPin className="h-5 w-5 text-gray-400" />}
        placeholder="Enter your address"
        error={errors.address?.message}
        fullWidth
        {...register('address', {
          required: 'Address is required',
          validate: validateAddress,
        })}
      />
      
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
        placeholder="Confirm your password"
        error={errors.confirmPassword?.message}
        fullWidth
        {...register('confirmPassword', {
          required: 'Please confirm your password',
          validate: (value) => value === password || 'Passwords do not match',
        })}
      />

      <Button
        type="submit"
        fullWidth
        loading={loading}
      >
        Create Account
      </Button>
    </form>
  );
};

export default RegisterForm;