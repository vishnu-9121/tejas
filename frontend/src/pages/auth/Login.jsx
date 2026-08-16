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
import { Eye, EyeOff, Lock, Mail, Shield, AlertCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export default function Login() {
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
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
      const response = await api.post('/auth/login', data);
      const { user, accessToken } = response.data.data;
      setCredentials(user, accessToken);
      handlePostAuthRedirect(user);
    } catch (err) {
      const msg = err.response?.data?.message || 
        (Array.isArray(err.response?.data?.errors) ? err.response?.data?.errors[0] : null) || 
        err.message || 
        'Invalid email or password. Please check your credentials and try again.';
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
      setError(err.response?.data?.message || 'Google Login failed. Please try signing in with email.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-inter selection:bg-primary-100 selection:text-primary-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-3">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-bold uppercase tracking-wider border border-primary-100">
            <Shield className="w-3.5 h-3.5 text-primary-600" />
            Tejas Academy Authentication
          </span>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900 tracking-tight font-outfit">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          New applicant?{' '}
          <Link 
            to={returnUrl ? `/register?returnUrl=${encodeURIComponent(returnUrl)}` : '/register'} 
            className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
          >
            Start your application now &rarr;
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-3xl sm:px-10 border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500" />

          {/* Error Alert Diagnostic */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3.5 rounded-2xl text-sm flex items-start gap-3 shadow-sm" 
                role="alert"
              >
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div className="flex-1 text-xs font-medium leading-relaxed">{error}</div>
              </motion.div>
            )}
          </AnimatePresence>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
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
              <div className="relative">
                <Input
                  label="Password"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
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

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded focus-visible:ring-2 cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs font-medium text-gray-700 cursor-pointer">
                  Remember session
                </label>
              </div>

              <div className="text-xs">
                <Link to="/forgot-password" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>

            <div className="pt-2">
              <Button 
                type="submit" 
                variant="primary" 
                className="w-full h-11 text-sm font-bold shadow-lg shadow-primary-600/25 rounded-2xl flex items-center justify-center gap-2" 
                disabled={isSubmitting} 
                aria-label="Sign in to your account"
              >
                {isSubmitting ? 'Verifying Credentials...' : 'Sign In'}
                {!isSubmitting && <ArrowRight className="w-4 h-4" />}
              </Button>
            </div>
          </form>

          {/* Social Sign-In Divider */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-gray-500 font-medium uppercase tracking-wider">Or sign in with</span>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <div className="w-full rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:border-gray-300 transition-all flex justify-center p-1 bg-gray-50">
                <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "431275153097-c3vgp6aop1iumeu069h5kssmi6bnoius.apps.googleusercontent.com"}>
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => setError('Google Authentication could not be completed. Please try again.')}
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
