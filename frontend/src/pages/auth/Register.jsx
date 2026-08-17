import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../../store/useAuthStore';
import { api } from '../../utils/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { User, Mail, Phone, Lock, Eye, EyeOff, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const schema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid 10-digit phone number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

export default function Register() {
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const setCredentials = useAuthStore((state) => state.setCredentials);

  // Determine return URL or original destination
  const returnUrl = searchParams.get('returnUrl') || searchParams.get('redirect') || location.state?.from || '';

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema)
  });

  const handlePostAuthRedirect = (user) => {
    if (returnUrl && returnUrl !== '/login' && returnUrl !== '/register') {
      navigate(returnUrl);
      return;
    }
    const redirectPath = (user?.role === 'admin' || user?.role === 'super_admin') 
      ? '/admin' 
      : (user?.role === 'faculty' || user?.role === 'mentor') 
        ? '/faculty' 
        : '/dashboard';
    navigate(redirectPath);
  };

  const onSubmit = async (data) => {
    setError(null);
    try {
      const payload = {
        name: data.name.trim(),
        email: data.email.toLowerCase().trim(),
        phone: data.phone.trim(),
        password: data.password
      };
      const response = await api.post('/auth/register', payload);
      const { user, accessToken } = response.data.data;
      setCredentials(user, accessToken);
      handlePostAuthRedirect(user);
    } catch (err) {
      const msg = err.response?.data?.message || 
        (Array.isArray(err.response?.data?.errors) ? err.response?.data?.errors[0] : null) || 
        err.message || 
        'Registration failed. Please verify your connection and try again.';
      setError(msg);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError(null);
    try {
      const response = await api.post('/auth/google', {
        credential: credentialResponse.credential,
      });
      const { user, accessToken } = response.data.data;
      setCredentials(user, accessToken);
      handlePostAuthRedirect(user);
    } catch (err) {
      setError(err.response?.data?.message || 'Google Registration failed. Please try with email.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-inter selection:bg-primary-100 selection:text-primary-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-3">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-bold uppercase tracking-wider border border-primary-100">
            <Shield className="w-3.5 h-3.5 text-primary-600" />
            Tejas Academy Admissions
          </span>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900 tracking-tight font-outfit">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link 
            to={returnUrl ? `/login?returnUrl=${encodeURIComponent(returnUrl)}` : '/login'} 
            className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
          >
            Sign in here &rarr;
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-3xl sm:px-10 border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500" />
          
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-xs font-medium" 
                role="alert"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Input
                label="Full Name"
                id="name"
                type="text"
                placeholder="e.g. Rahul Sharma"
                autoComplete="name"
                leftIcon={<User className="w-4 h-4" />}
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
                placeholder="name@example.com"
                autoComplete="email"
                leftIcon={<Mail className="w-4 h-4" />}
                {...register('email')}
                error={errors.email?.message}
                aria-invalid={errors.email ? "true" : "false"}
              />
            </div>

            <div>
              <Input
                label="Mobile Phone Number"
                id="phone"
                type="tel"
                placeholder="e.g. 8331051327"
                autoComplete="tel"
                leftIcon={<Phone className="w-4 h-4" />}
                {...register('phone')}
                error={errors.phone?.message}
                aria-invalid={errors.phone ? "true" : "false"}
              />
            </div>

            <div>
              <div className="relative">
                <Input
                  label="Create Password"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  leftIcon={<Lock className="w-4 h-4" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                  {...register('password')}
                  error={errors.password?.message}
                  aria-invalid={errors.password ? "true" : "false"}
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <Input
                  label="Confirm Password"
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  leftIcon={<Lock className="w-4 h-4" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                  {...register('confirmPassword')}
                  error={errors.confirmPassword?.message}
                  aria-invalid={errors.confirmPassword ? "true" : "false"}
                />
              </div>
            </div>

            <div className="pt-2">
              <Button 
                type="submit" 
                variant="primary" 
                className="w-full h-11 text-sm font-bold shadow-lg shadow-primary-600/25 rounded-2xl flex items-center justify-center gap-2" 
                disabled={isSubmitting} 
                aria-label="Create Account and Continue"
              >
                {isSubmitting ? 'Creating account...' : 'Create Account & Continue'}
                {!isSubmitting && <ArrowRight className="w-4 h-4" />}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-gray-500 uppercase tracking-wider font-medium">Or sign up with</span>
              </div>
            </div>

            <div className="mt-5 flex justify-center">
              <div className="w-full rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:border-gray-300 transition-all flex justify-center p-1 bg-gray-50">
                <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "431275153097-c3vgp6aop1iumeu069h5kssmi6bnoius.apps.googleusercontent.com"}>
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => setError('Google Sign Up Failed')}
                    theme="outline"
                    size="large"
                    width="100%"
                    shape="circle"
                    useOneTap={false}
                  />
                </GoogleOAuthProvider>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
