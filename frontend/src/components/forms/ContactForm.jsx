import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/utils/api';

const schema = z.object({
  name: z.string().min(2, 'Name is required (at least 2 characters)'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters')
});

export const ContactForm = () => {
  const { user } = useAuthStore();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue } = useForm({ 
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || user?.phoneNumber || '',
      subject: '',
      message: ''
    }
  });

  useEffect(() => {
    if (user) {
      if (user.name) setValue('name', user.name);
      if (user.email) setValue('email', user.email);
      if (user.phone || user.phoneNumber) setValue('phone', user.phone || user.phoneNumber);
    }
  }, [user, setValue]);

  const onSubmit = async (data) => {
    try {
      await api.post('/inquiries', {
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone ? data.phone.trim() : '+91 83310 51327',
        subject: data.subject.trim(),
        message: data.message.trim()
      });
      toast.success('Message sent successfully! Our admissions advisors will get back to you soon.');
      reset({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || user?.phoneNumber || '',
        subject: '',
        message: ''
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message. Please try again or reach us via WhatsApp.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Your Name" placeholder="e.g. Rahul Sharma" {...register('name')} error={errors.name?.message} />
        <Input label="Your Email" type="email" placeholder="rahul@example.com" {...register('email')} error={errors.email?.message} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Phone Number (Optional)" placeholder="+91 83310 51327" {...register('phone')} error={errors.phone?.message} />
        <Input label="Subject" placeholder="e.g. Program Curriculum Inquiry" {...register('subject')} error={errors.subject?.message} />
      </div>
      <Textarea label="Message" rows={4} placeholder="How can we assist your learning trajectory?" {...register('message')} error={errors.message?.message} />
      <Button type="submit" variant="primary" size="lg" className="w-full font-bold" isLoading={isSubmitting}>
        Send Message
      </Button>
    </form>
  );
};
