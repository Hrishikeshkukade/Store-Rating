import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Lock, Mail } from 'lucide-react';
import { signInUser } from '../../services/auth-service';
import Input from '../shared/Input';
import Button from '../shared/Button';
import toast from 'react-hot-toast';

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    try {
      await signInUser(data.email, data.password);
      toast.success('Successfully logged in!');
      navigate('/');
    } catch (error: any) {
      console.error(error);
      let errorMessage = 'Failed to log in. Please try again.';
      
      if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid email or password. Please try again.';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many attempts. Please try again later.';
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Invalid email format',
          },
        })}
      />
      
      <Input
        label="Password"
        type="password"
        id="password"
        leftAddon={<Lock className="h-5 w-5 text-gray-400" />}
        placeholder="Enter your password"
        error={errors.password?.message}
        fullWidth
        {...register('password', {
          required: 'Password is required',
        })}
      />

      <Button
        type="submit"
        fullWidth
        loading={loading}
      >
        Sign In
      </Button>
    </form>
  );
};

export default LoginForm;