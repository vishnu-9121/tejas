import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { 
  CheckCircle2, AlertCircle, ArrowRight, ArrowLeft, Shield, 
  Sparkles, Download, User, Mail, Phone, School, GraduationCap, 
  BookOpen, Calendar, MapPin, Printer
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Badge } from '@/components/ui/Badge';
import { useAuthStore } from '@/store/useAuthStore';
import { admissionService } from '@/services/admissionService';
import { programService } from '@/services/programService';
import { useQuery } from '@tanstack/react-query';

const fullSchema = z.object({
  fullName: z.string().min(2, 'Full name is required (at least 2 characters)'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^[0-9+\s-]{10,15}$/, 'Please enter a valid 10-digit phone number'),
  prevSchool: z.string().min(2, 'School or Institution name is required'),
  grade: z.string().min(1, 'Percentage or CGPA is required'),
  highestDegree: z.string().optional(),
  yearOfPassing: z.string().optional(),
  program: z.string().min(1, 'Please select a program'),
  agree: z.boolean().refine(v => v === true, 'You must accept the terms and conditions to submit')
});

const steps = [
  { id: 0, title: 'Personal Details', icon: User },
  { id: 1, title: 'Academic Record', icon: School },
  { id: 2, title: 'Program & Review', icon: BookOpen },
];

export const AdmissionsForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  // Extract program from URL query if provided
  const preselectedProgram = searchParams.get('program') || '';

  // Fetch published programs from Sanity / backend
  const { data: programsData } = useQuery({
    queryKey: ['published-programs-dropdown'],
    queryFn: () => programService.getPrograms({ status: 'published' }),
    staleTime: 5 * 60 * 1000,
  });

  const rawPrograms = Array.isArray(programsData?.data?.programs) 
    ? programsData.data.programs 
    : Array.isArray(programsData?.data?.data?.programs) 
      ? programsData.data.data.programs 
      : Array.isArray(programsData?.data) 
        ? programsData.data 
        : [];

  const fetchedPrograms = rawPrograms.map(p => ({ 
    value: p.title || p.name || p.slug, 
    label: p.title || p.name 
  }));

  // If a program was preselected in the URL query, ensure it is available in options
  const programs = [...fetchedPrograms];
  if (preselectedProgram && !programs.some(p => p.value === preselectedProgram)) {
    programs.unshift({ value: preselectedProgram, label: preselectedProgram });
  }

  // React Hook Form initialized with default values from user or query params
  const { register, handleSubmit, formState: { errors }, setValue, trigger, getValues, watch } = useForm({
    resolver: zodResolver(fullSchema),
    mode: 'onTouched',
    defaultValues: {
      fullName: user?.name || user?.fullName || '',
      email: user?.email || '',
      phone: user?.phone || user?.phoneNumber || '',
      prevSchool: '',
      grade: '',
      highestDegree: 'High School (12th Grade)',
      yearOfPassing: String(new Date().getFullYear()),
      program: preselectedProgram || '',
      agree: false,
    }
  });

  // Watch selected values for review step
  const formValues = watch();

  // Sync user info into form if auth state changes
  useEffect(() => {
    if (user) {
      if (!getValues('fullName')) setValue('fullName', user.name || user.fullName || '');
      if (!getValues('email')) setValue('email', user.email || '');
      if (!getValues('phone') && (user.phone || user.phoneNumber)) {
        setValue('phone', user.phone || user.phoneNumber);
      }
    }
  }, [user, setValue, getValues]);

  // Sync preselected program query param
  useEffect(() => {
    if (preselectedProgram && !getValues('program')) {
      setValue('program', preselectedProgram);
    }
  }, [preselectedProgram, setValue, getValues]);

  // Step Validation logic
  const handleNextStep = async () => {
    setFormError(null);
    let fieldsToValidate = [];
    if (currentStep === 0) {
      fieldsToValidate = ['fullName', 'email', 'phone'];
    } else if (currentStep === 1) {
      fieldsToValidate = ['prevSchool', 'grade'];
    }

    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setCurrentStep(s => Math.min(s + 1, steps.length - 1));
    }
  };

  const handlePrevStep = () => {
    setFormError(null);
    setCurrentStep(s => Math.max(s - 1, 0));
  };

  // Submission handler
  const onSubmit = async (data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setFormError(null);
    try {
      const payload = {
        fullName: data.fullName.trim(),
        email: data.email.toLowerCase().trim(),
        phone: data.phone.trim(),
        program: data.program,
        prevSchool: data.prevSchool.trim(),
        grade: data.grade.trim(),
        highestDegree: data.highestDegree || 'High School',
        yearOfPassing: Number(data.yearOfPassing) || new Date().getFullYear(),
        personalDetails: {
          fullName: data.fullName.trim(),
          email: data.email.toLowerCase().trim(),
          phone: data.phone.trim(),
          address: 'Online Applicant',
          dateOfBirth: new Date(),
          gender: 'other',
        },
        educationDetails: {
          highestDegree: data.highestDegree || 'High School',
          institution: data.prevSchool.trim(),
          percentageOrCGPA: data.grade.trim(),
          yearOfPassing: Number(data.yearOfPassing) || new Date().getFullYear(),
        }
      };

      const response = await admissionService.submitApplication(payload);
      const appData = response?.data || response;
      setSubmissionResult(appData);
      toast.success('Application submitted successfully!');
    } catch (err) {
      const errMsg = err.response?.data?.message || 
        (Array.isArray(err.response?.data?.errors) ? err.response?.data?.errors[0] : null) || 
        err.message || 
        'Failed to submit application. Please verify your details and try again.';
      setFormError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS / CONFIRMATION VIEW (PHASE 7)
  if (submissionResult) {
    const appId = submissionResult.applicationId || `TAE-APP-${new Date().getFullYear()}-${submissionResult._id?.substring(0, 6)?.toUpperCase() || '7821'}`;
    const programName = submissionResult.program || formValues.program || 'Flagship Academic Program';
    const submissionDate = new Date(submissionResult.createdAt || Date.now()).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-xl max-w-2xl mx-auto text-left font-inter"
      >
        {/* Header Ribbon */}
        <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Official Submission Confirmed
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 font-outfit mt-1">
              Application Successfully Lodged
            </h2>
          </div>
        </div>

        {/* Key Application Summary Card */}
        <div className="mt-6 bg-gray-50/80 rounded-2xl p-5 border border-gray-200/70 space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-gray-200/60">
            <span className="text-xs font-semibold uppercase text-gray-500">Application Number</span>
            <span className="text-sm font-mono font-bold text-primary-700 bg-white px-2.5 py-1 rounded-lg border border-gray-200">
              {appId}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Selected Program</span>
            <span className="font-bold text-gray-900 text-right">{programName}</span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Applicant Name</span>
            <span className="font-medium text-gray-900">{formValues.fullName || user?.name || 'Applicant'}</span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Registered Email</span>
            <span className="font-medium text-gray-900">{formValues.email || user?.email}</span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Submission Timestamp</span>
            <span className="text-xs text-gray-500 font-medium">{submissionDate}</span>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-gray-200/60">
            <span className="text-gray-600 font-medium">Initial Status</span>
            <Badge variant="warning" className="text-xs">Under Review</Badge>
          </div>
        </div>

        {/* What Happens Next Section */}
        <div className="mt-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            What Happens Next:
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-xs">
              <div className="w-6 h-6 rounded-full bg-primary-50 text-primary-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                1
              </div>
              <div className="text-xs text-gray-600">
                <span className="font-semibold text-gray-900 block">Admissions Review</span>
                Our academic panel evaluates your academic background and eligibility criteria.
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-xs">
              <div className="w-6 h-6 rounded-full bg-primary-50 text-primary-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                2
              </div>
              <div className="text-xs text-gray-600">
                <span className="font-semibold text-gray-900 block">Counselor Consultation</span>
                An assigned academic counselor will reach out via phone or email within 24–48 hours.
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-xs">
              <div className="w-6 h-6 rounded-full bg-primary-50 text-primary-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                3
              </div>
              <div className="text-xs text-gray-600">
                <span className="font-semibold text-gray-900 block">Final Offer & Enrollment</span>
                Selected applicants receive the provisional offer letter and enrollment onboarding instructions.
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
          {isAuthenticated ? (
            <Button 
              variant="primary" 
              className="flex-1 py-3 font-bold flex items-center justify-center gap-2"
              onClick={() => navigate('/dashboard')}
            >
              Track in Student Dashboard <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Link 
              to={`/login?returnUrl=/dashboard`}
              className="flex-1 py-3 px-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-center text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              Sign In to Track Application <ArrowRight className="w-4 h-4" />
            </Link>
          )}

          <Button 
            variant="outline" 
            className="py-3 text-xs flex items-center justify-center gap-2"
            onClick={() => window.print()}
          >
            <Printer className="w-4 h-4" /> Print / Save Summary
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 max-w-2xl mx-auto font-inter">
      
      {/* Pre-fill or Auth Guidance Banner */}
      {isAuthenticated ? (
        <div className="mb-6 p-3.5 bg-primary-50/70 border border-primary-100 rounded-2xl flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-primary-900 font-medium">
            <Shield className="w-4 h-4 text-primary-600 shrink-0" />
            <span>
              Applying as <strong className="font-bold">{user?.name}</strong> ({user?.email})
            </span>
          </div>
          <Badge variant="primary" className="text-[10px] uppercase">Verified Account</Badge>
        </div>
      ) : (
        <div className="mb-6 p-3.5 bg-amber-50/70 border border-amber-200/60 rounded-2xl flex items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Have an existing account?</span>
          </div>
          <Link 
            to={`/login?returnUrl=${encodeURIComponent(window.location.pathname + window.location.search)}`} 
            className="font-bold text-amber-800 hover:text-amber-900 underline underline-offset-2"
          >
            Sign in to prefill &rarr;
          </Link>
        </div>
      )}

      {/* Progress Stepper Bar */}
      <div className="flex justify-between mb-8 relative">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -z-10 -translate-y-1/2"></div>
        <div 
          className="absolute top-1/2 left-0 h-1 bg-primary-600 -z-10 -translate-y-1/2 transition-all duration-300" 
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        ></div>
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = idx <= currentStep;
          return (
            <div key={idx} className="flex flex-col items-center bg-white px-2">
              <div 
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-xs ${
                  idx === currentStep 
                    ? 'bg-primary-600 text-white ring-4 ring-primary-100' 
                    : isActive 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-100 text-gray-400'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className={`text-xs mt-2 font-medium hidden sm:block ${idx === currentStep ? 'text-primary-900 font-bold' : 'text-gray-500'}`}>
                {step.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Diagnostic Form Error Message */}
      {formError && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="min-h-[280px]">
          
          {/* STEP 0: PERSONAL INFORMATION */}
          {currentStep === 0 && (
            <motion.div 
              key="step-0"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4"
            >
              <div>
                <Input 
                  label="Full Name *" 
                  placeholder="e.g. Rahul Sharma"
                  leftIcon={<User className="w-4 h-4" />}
                  {...register('fullName')} 
                  error={errors.fullName?.message} 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input 
                    label="Email Address *" 
                    type="email" 
                    placeholder="name@example.com"
                    leftIcon={<Mail className="w-4 h-4" />}
                    {...register('email')} 
                    error={errors.email?.message} 
                  />
                </div>
                <div>
                  <Input 
                    label="Mobile Phone Number *" 
                    type="tel" 
                    placeholder="10-digit number"
                    leftIcon={<Phone className="w-4 h-4" />}
                    {...register('phone')} 
                    error={errors.phone?.message} 
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 1: ACADEMIC DETAILS */}
          {currentStep === 1 && (
            <motion.div 
              key="step-1"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4"
            >
              <div>
                <Input 
                  label="Previous School / College / University *" 
                  placeholder="e.g. Delhi Public School / JNTU"
                  leftIcon={<School className="w-4 h-4" />}
                  {...register('prevSchool')} 
                  error={errors.prevSchool?.message} 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input 
                    label="Percentage / CGPA / Grade *" 
                    placeholder="e.g. 88% or 8.6 CGPA"
                    leftIcon={<GraduationCap className="w-4 h-4" />}
                    {...register('grade')} 
                    error={errors.grade?.message} 
                  />
                </div>
                <div>
                  <Input 
                    label="Year of Passing" 
                    type="number"
                    placeholder={String(new Date().getFullYear())}
                    leftIcon={<Calendar className="w-4 h-4" />}
                    {...register('yearOfPassing')} 
                    error={errors.yearOfPassing?.message} 
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: PROGRAM SELECTION & REVIEW */}
          {currentStep === 2 && (
            <motion.div 
              key="step-2"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-5"
            >
              <div>
                <Select 
                  label="Selected Program of Study *" 
                  options={[{ value: '', label: 'Select your preferred program...' }, ...programs]} 
                  {...register('program')} 
                  error={errors.program?.message} 
                />
              </div>

              {/* Review summary preview box */}
              <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-200/70 text-xs space-y-2">
                <div className="font-bold text-gray-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-primary-600" />
                  Application Summary Preview:
                </div>
                <div className="grid grid-cols-2 gap-2 text-gray-600">
                  <div><strong>Applicant:</strong> {formValues.fullName || 'N/A'}</div>
                  <div><strong>Email:</strong> {formValues.email || 'N/A'}</div>
                  <div><strong>Phone:</strong> {formValues.phone || 'N/A'}</div>
                  <div><strong>Institution:</strong> {formValues.prevSchool || 'N/A'}</div>
                  <div><strong>Grade:</strong> {formValues.grade || 'N/A'}</div>
                </div>
              </div>

              <div className="pt-2">
                <Checkbox 
                  label="I declare that all details provided are accurate and I agree to the Tejas Academy admission terms & privacy policy." 
                  {...register('agree')} 
                />
                {errors.agree && (
                  <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.agree.message}</p>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Stepper Navigation Buttons */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handlePrevStep} 
            disabled={currentStep === 0 || isSubmitting}
            className="flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Previous
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button 
              type="button" 
              variant="primary" 
              onClick={handleNextStep}
              className="flex items-center gap-1.5 text-xs font-bold shadow-md shadow-primary-600/20"
            >
              Continue <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          ) : (
            <Button 
              type="submit" 
              variant="primary" 
              isLoading={isSubmitting}
              className="py-3 px-6 text-sm font-bold shadow-lg shadow-primary-600/25 flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700"
            >
              Submit Official Application &rarr;
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};
