import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Download, FileText, Lock, User, Mail, Phone, Eye, EyeOff, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';
import { api } from '@/utils/api';
import { programService } from '@/services/programService';

export const BrochureDownloadModal = ({ 
  isOpen, 
  onClose, 
  program = {}, 
  downloadType = 'brochure',
  onDownloadSuccess 
}) => {
  const setCredentials = useAuthStore((state) => state.setCredentials);
  const [mode, setMode] = useState('register'); // 'register' or 'login'
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const title = program?.title || 'Academic Program';
  const fileUrl = downloadType === 'curriculum' 
    ? (program?.curriculumUrl || program?.brochureUrl || '/brochure.pdf')
    : (program?.brochureUrl || program?.brochure || '/brochure.pdf');

  const executeDownload = async (userData) => {
    try {
      await programService.downloadBrochure({
        programId: program?._id,
        slug: program?.slug,
        programTitle: title,
        downloadType
      });
      toast.success(`Brochure download initiated for ${title}!`);
      if (onDownloadSuccess) onDownloadSuccess();
      onClose();
    } catch (err) {
      console.error('[BrochureDownloadModal] Download error:', err);
      toast.error('Failed to download document. Please try again.');
      onClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (mode === 'register') {
      if (!formData.name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (!formData.email.trim() || !formData.email.includes('@')) {
        setError('Please enter a valid email address.');
        return;
      }
      if (!formData.phone.trim() || formData.phone.trim().length < 8) {
        setError('Please enter a valid phone number.');
        return;
      }
      if (!formData.password || formData.password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
        setError('Passwords do not match.');
        return;
      }

      setIsLoading(true);
      try {
        const response = await api.post('/auth/register', {
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          password: formData.password
        });
        const { user, accessToken } = response.data.data;
        setCredentials(user, accessToken);
        toast.success(`Welcome to Tejas Academy, ${formData.name}!`);
        await executeDownload(user);
      } catch (err) {
        const msg = err.response?.data?.message || 'Registration failed. Please check your credentials.';
        setError(msg);
        toast.error(msg);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Sign In mode
      if (!formData.email.trim() || !formData.email.includes('@')) {
        setError('Please enter your email address.');
        return;
      }
      if (!formData.password) {
        setError('Please enter your password.');
        return;
      }

      setIsLoading(true);
      try {
        const response = await api.post('/auth/login', {
          email: formData.email.trim().toLowerCase(),
          password: formData.password
        });
        const { user, accessToken } = response.data.data;
        setCredentials(user, accessToken);
        toast.success('Signed in successfully!');
        await executeDownload(user);
      } catch (err) {
        const msg = err.response?.data?.message || 'Invalid email or password.';
        setError(msg);
        toast.error(msg);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title=""
      maxWidth="max-w-md"
    >
      <div className="pt-1 pb-2">
        {/* Header with program details */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
            <FileText className="w-6 h-6 stroke-[2.2]" />
          </div>
          <h3 className="text-xl font-bold font-serif text-gray-900 leading-snug">
            Download Program Brochure
          </h3>
          <p className="text-xs font-semibold text-primary-700 bg-primary-50/80 px-3 py-1 rounded-full inline-block max-w-full truncate border border-primary-100">
            {title}
          </p>
          <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto">
            Please sign in or create a quick account to instantly download the comprehensive prospectus and syllabus.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="grid grid-cols-2 p-1 bg-gray-100/90 rounded-2xl mb-5 border border-gray-200/70 select-none">
          <button
            type="button"
            onClick={() => { setMode('register'); setError(null); }}
            className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              mode === 'register' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              mode === 'login' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Sign In
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-start gap-2.5" role="alert">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">
                Full Name <span className="text-red-500">*</span>
              </label>
              <Input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Rohan Sharma"
                leftIcon={<User className="w-4 h-4 text-gray-400" />}
                className="h-10 text-sm"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">
              Email Address <span className="text-red-500">*</span>
            </label>
            <Input
              required
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="rohan@example.com"
              leftIcon={<Mail className="w-4 h-4 text-gray-400" />}
              className="h-10 text-sm"
            />
          </div>

          {mode === 'register' && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <Input
                required
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                leftIcon={<Phone className="w-4 h-4 text-gray-400" />}
                className="h-10 text-sm"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                required
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                leftIcon={<Lock className="w-4 h-4 text-gray-400" />}
                className="h-10 text-sm pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="gold"
              disabled={isLoading}
              className="w-full py-2.5 font-bold shadow-md shadow-amber-500/20 text-sm flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>{mode === 'register' ? 'Register & Download Brochure' : 'Sign In & Download Brochure'}</span>
                </>
              )}
            </Button>
          </div>

          <p className="text-[11px] text-center text-gray-400 pt-1">
            By continuing, you agree to receive academic details and admission assistance.
          </p>
        </form>
      </div>
    </Modal>
  );
};

export default BrochureDownloadModal;
