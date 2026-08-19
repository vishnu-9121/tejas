import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { newsletterService } from '@/services/newsletterService';

const schema = z.object({
  email: z.string().email('Invalid email address')
});

export const NewsletterForm = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data) => {
    try {
      await newsletterService.subscribe(data.email);
      toast.success('Subscribed successfully!');
      reset();
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error('You are already subscribed!');
      } else {
        toast.error('Failed to subscribe. Please try again.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-3 max-w-md w-full">
      <div className="flex-grow">
        <Input placeholder="Enter your email" {...register('email')} error={errors.email?.message} className="bg-white/10 text-white border-white/20 placeholder:text-gray-300" />
      </div>
      <Button type="submit" variant="primary" isLoading={isSubmitting} className="shrink-0 h-10">
        Subscribe
      </Button>
    </form>
  );
};
