import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Star, CheckCircle2, AlertCircle, Sparkles, MessageSquareHeart } from 'lucide-react';
import { toast } from 'sonner';
import { testimonialService } from '@/services/testimonialService';
import { useAuthStore } from '@/store/useAuthStore';

export const ReviewSubmissionModal = ({ isOpen, onClose, defaultProgram = '' }) => {
  const { user } = useAuthStore();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    program: defaultProgram,
    content: '',
    rating: 5,
    imageUrl: '',
  });

  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState(null);

  // Autofill user details if logged in
  useEffect(() => {
    if (user && isOpen) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || '',
        role: prev.role || (user.role === 'student' ? 'Student' : 'Alumni'),
        program: prev.program || defaultProgram
      }));
    }
  }, [user, isOpen, defaultProgram]);

  const handleRatingChange = (rate) => {
    setFormData(prev => ({ ...prev, rating: rate }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (!formData.name.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setFormError('Please provide a valid email address.');
      return;
    }
    if (!formData.content.trim() || formData.content.trim().length < 15) {
      setFormError('Please write a detailed review (at least 15 characters).');
      return;
    }

    setIsSubmitting(true);
    try {
      await testimonialService.submitReview({
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role.trim() || 'Student / Learner',
        program: formData.program.trim(),
        content: formData.content.trim(),
        rating: formData.rating,
        imageUrl: formData.imageUrl.trim(),
      });

      setIsSubmitted(true);
      toast.success('Your review has been submitted for moderation.');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to submit review. Please try again.';
      setFormError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setFormError(null);
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      role: '',
      program: defaultProgram,
      content: '',
      rating: 5,
      imageUrl: '',
    });
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      title={isSubmitted ? "Submission Received" : "Share Your Experience"}
      maxWidth="max-w-xl"
    >
      {isSubmitted ? (
        <div className="py-8 px-2 text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50/50">
            <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
          </div>
          <h3 className="text-xl font-bold font-serif text-neutral-900">
            Thank You for Your Feedback!
          </h3>
          <p className="text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
            Your review has been submitted successfully. To maintain authenticity, our team reviews all submissions before publishing them on the website.
          </p>
          <div className="pt-4">
            <Button variant="primary" onClick={handleClose} className="px-6 py-2.5 text-sm font-semibold">
              Done
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {formError && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-start gap-2.5" role="alert">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          <div className="bg-amber-50/60 border border-amber-200/60 rounded-xl p-3 flex items-center gap-2 text-xs text-amber-900 font-medium">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Reviews undergo moderation before appearing publicly on the website.</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700">
                Full Name <span className="text-red-500">*</span>
              </label>
              <Input 
                required 
                value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                placeholder="e.g. Ananya Sharma" 
                className="h-10 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700">
                Email Address <span className="text-red-500">*</span>
              </label>
              <Input 
                required 
                type="email"
                value={formData.email} 
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                placeholder="ananya@example.com" 
                className="h-10 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700">
                Program / Degree
              </label>
              <Input 
                value={formData.program} 
                onChange={(e) => setFormData({ ...formData, program: e.target.value })} 
                placeholder="e.g. B.Tech Computer Science" 
                className="h-10 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700">
                Batch / Role
              </label>
              <Input 
                value={formData.role} 
                onChange={(e) => setFormData({ ...formData, role: e.target.value })} 
                placeholder="e.g. Alumni, Batch 2024" 
                className="h-10 text-sm"
              />
            </div>
          </div>

          {/* Interactive Star Rating */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700 block">
              Overall Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-1.5 pt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 text-amber-400 hover:scale-115 transition-transform cursor-pointer focus:outline-none"
                  aria-label={`Rate ${star} out of 5 stars`}
                >
                  <Star 
                    className={`w-7 h-7 ${
                      star <= (hoverRating || formData.rating) 
                        ? 'fill-amber-400 text-amber-400' 
                        : 'text-neutral-300'
                    }`} 
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-neutral-600 ml-2">
                {hoverRating || formData.rating} / 5 Stars
              </span>
            </div>
          </div>

          {/* Review Text Area */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-neutral-700">
                Your Review & Experience <span className="text-red-500">*</span>
              </label>
              <span className={`text-[11px] font-medium ${formData.content.length > 500 ? 'text-red-500' : 'text-neutral-400'}`}>
                {formData.content.length} / 500 characters
              </span>
            </div>
            <Textarea 
              required 
              rows={4} 
              maxLength={500}
              value={formData.content} 
              onChange={(e) => setFormData({ ...formData, content: e.target.value })} 
              placeholder="Tell us how Tejas Academy helped shape your academic journey, career, or personal growth..." 
              className="text-sm leading-relaxed"
            />
          </div>

          {/* Optional Profile Photo */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700">
              Profile Photo URL <span className="text-neutral-400 font-normal">(Optional)</span>
            </label>
            <div className="flex gap-3 items-center">
              <Input 
                type="url"
                value={formData.imageUrl} 
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} 
                placeholder="https://..." 
                className="h-10 text-sm flex-1"
              />
              {formData.imageUrl && (
                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-neutral-100 border border-neutral-200">
                  <img 
                    src={formData.imageUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover" 
                    onError={(e) => e.target.style.display = 'none'} 
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              disabled={isSubmitting}
              className="px-5 font-semibold"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default ReviewSubmissionModal;
