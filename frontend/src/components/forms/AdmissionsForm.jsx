import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import api from '@/utils/api';
import { programService } from '@/services/programService';
import { useQuery } from '@tanstack/react-query';

const steps = ['Personal Info', 'Academic Details', 'Program Selection'];

const stepSchemas = [
  z.object({ firstName: z.string().min(1, 'Required'), lastName: z.string().min(1, 'Required'), email: z.string().email(), phone: z.string().min(10) }),
  z.object({ prevSchool: z.string().min(1, 'Required'), grade: z.string().min(1, 'Required') }),
  z.object({ program: z.string().min(1, 'Required'), agree: z.boolean().refine(v => v, 'Must agree to terms') })
];

export const AdmissionsForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { data: programsData } = useQuery({
    queryKey: ['published-programs-dropdown'],
    queryFn: () => programService.getPrograms({ status: 'published' }),
    staleTime: 5 * 60 * 1000,
  });

  const fallbackPrograms = [
    { value: 'btech-ai', label: 'B.Tech in AI & Data Science' },
    { value: 'mba-digital', label: 'MBA in Digital Business' },
    { value: 'mdes-ux', label: 'M.Des in UX Architecture' },
    { value: 'exec-leadership', label: 'Executive Leadership Certificate' }
  ];

  const fetchedPrograms = programsData?.data?.data?.map(p => ({ value: p.title || p._id, label: p.title })) || [];
  const programs = fetchedPrograms.length > 0 ? fetchedPrograms : fallbackPrograms;
  const currentSchema = stepSchemas[currentStep];

  const { register, handleSubmit, formState: { errors, isSubmitting }, trigger, reset } = useForm({
    resolver: zodResolver(currentSchema), mode: 'onChange'
  });

  const onNext = async () => {
    const isStepValid = await trigger();
    if (isStepValid) setCurrentStep(s => s + 1);
  };

  const onPrev = () => setCurrentStep(s => s - 1);

  const onSubmit = async (data) => {
    try {
      await api.post('/admissions', data);
      toast.success('Application submitted successfully!');
      reset();
      setCurrentStep(0);
    } catch (err) {
      toast.error('Failed to submit application. Please try again.');
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
      <div className="flex justify-between mb-8 relative">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-10 -translate-y-1/2"></div>
        <div className="absolute top-1/2 left-0 h-1 bg-primary-600 -z-10 -translate-y-1/2 transition-all duration-300" style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}></div>
        {steps.map((step, idx) => (
          <div key={idx} className="flex flex-col items-center bg-white px-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${idx <= currentStep ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {idx + 1}
            </div>
            <span className="text-xs mt-2 font-medium text-gray-600 hidden sm:block">{step}</span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(currentStep === steps.length - 1 ? onSubmit : (e) => { e.preventDefault(); onNext(); })}>
        <div className="min-h-[250px]">
          {currentStep === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-right-4">
              <Input label="First Name" {...register('firstName')} error={errors.firstName?.message} />
              <Input label="Last Name" {...register('lastName')} error={errors.lastName?.message} />
              <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
              <Input label="Phone" type="tel" {...register('phone')} error={errors.phone?.message} />
            </div>
          )}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <Input label="Previous School/College" {...register('prevSchool')} error={errors.prevSchool?.message} />
              <Input label="Percentage/Grade" {...register('grade')} error={errors.grade?.message} />
            </div>
          )}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <Select 
                label="Select Program" 
                options={[{value:'', label:'Select...'}, ...programs]} 
                {...register('program')} 
                error={errors.program?.message} 
              />
              <Checkbox label="I agree to the terms and conditions" {...register('agree')} />
              {errors.agree && <p className="text-red-500 text-sm">{errors.agree.message}</p>}
            </div>
          )}
        </div>

        <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
          <Button type="button" variant="outline" onClick={onPrev} disabled={currentStep === 0}>Back</Button>
          {currentStep < steps.length - 1 ? (
            <Button type="button" onClick={onNext}>Continue</Button>
          ) : (
            <Button type="submit" isLoading={isSubmitting}>Submit Application</Button>
          )}
        </div>
      </form>
    </div>
  );
};
