import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../../store/useAuthStore';
import { api } from '../../utils/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export default function Register() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const setCredentials = useAuthStore((state) => state.setCredentials);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data) => {
    setError(null);
    try {
      const response = await api.post('/auth/register', data);
      const { user, accessToken } = response.data.data;
      setCredentials(user, accessToken);
      navigate('/'); 
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register. Please try again.');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await api.post('/auth/google', {
        credential: credentialResponse.credential,
      });
      const { user, accessToken } = response.data.data;
      setCredentials(user, accessToken);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Google Registration failed.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-inter">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          Start your journey
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary hover:text-primary-dark transition-colors">
            Sign in here
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-2xl sm:px-10 border border-gray-100">
          
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm" role="alert">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Input
                label="Full Name"
                id="name"
                type="text"
                autoComplete="name"
                {...register('name')}
                error={errors.name?.message}
                aria-invalid={errors.name ? "true" : "false"}
              />
            </div>

            <div>
              <Input
                label="Email address"
                id="email"
                type="email"
                autoComplete="email"
                {...register('email')}
                error={errors.email?.message}
                aria-invalid={errors.email ? "true" : "false"}
              />
            </div>

            <div>
              <Input
                label="Password"
                id="password"
                type="password"
                autoComplete="new-password"
                {...register('password')}
                error={errors.password?.message}
                helperText="Must be at least 6 characters."
                aria-invalid={errors.password ? "true" : "false"}
              />
            </div>

            <div>
              <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting} aria-label="Create Account">
                {isSubmitting ? 'Creating account...' : 'Create Account'}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or sign up with</span>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google Sign Up Failed')}
                theme="outline"
                size="large"
                width="100%"
                shape="rectangular"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
