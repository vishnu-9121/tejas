import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

import { workshopService } from '@/services/workshopService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

const workshopSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  date: z.string().min(1, 'Date is required'),
  location: z.string().min(2, 'Location is required'),
  speaker: z.string().min(2, 'Speaker is required'),
  totalSeats: z.number().min(1, 'Must have at least 1 seat'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  status: z.enum(['upcoming', 'ongoing', 'completed', 'cancelled']),
});

export default function WorkshopForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: workshopData, isLoading } = useQuery({
    queryKey: ['workshop', id],
    queryFn: () => workshopService.getWorkshopById(id),
    enabled: isEditing,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(workshopSchema),
    defaultValues: {
      title: '',
      date: '',
      location: 'Tejas Academy Campus',
      speaker: '',
      totalSeats: 50,
      description: '',
      status: 'upcoming'
    }
  });

  useEffect(() => {
    if (workshopData?.data) {
      const w = workshopData.data;
      reset({
        title: w.title || '',
        date: w.date ? new Date(w.date).toISOString().split('T')[0] : '',
        location: w.location || '',
        speaker: w.speaker || '',
        totalSeats: w.totalSeats || 50,
        description: w.description || '',
        status: w.status || 'upcoming'
      });
    }
  }, [workshopData, reset]);

  const mutation = useMutation({
    mutationFn: (data) => isEditing ? workshopService.updateWorkshop(id, data) : workshopService.createWorkshop(data),
    onSuccess: () => {
      toast.success(isEditing ? 'Workshop updated' : 'Workshop created');
      queryClient.invalidateQueries(['workshops']);
      navigate('/admin/workshops');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  if (isLoading) return <div className="p-12 text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" as={Link} to="/admin/workshops" className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Workshop' : 'Add New Workshop'}
          </h1>
          <p className="text-sm text-gray-500">Enter workshop details, speaker, and capacity.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
          <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Workshop Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Workshop Title <span className="text-red-500">*</span></label>
              <Input {...register('title')} placeholder="e.g. Intro to Entrepreneurship" />
              {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Date <span className="text-red-500">*</span></label>
              <Input type="date" {...register('date')} />
              {errors.date && <p className="text-xs text-red-500">{errors.date.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Location <span className="text-red-500">*</span></label>
              <Input {...register('location')} placeholder="e.g. Room 101" />
              {errors.location && <p className="text-xs text-red-500">{errors.location.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Speaker Name <span className="text-red-500">*</span></label>
              <Input {...register('speaker')} placeholder="e.g. Dr. Jane Doe" />
              {errors.speaker && <p className="text-xs text-red-500">{errors.speaker.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Total Capacity (Seats) <span className="text-red-500">*</span></label>
              <Input type="number" {...register('totalSeats', { valueAsNumber: true })} />
              {errors.totalSeats && <p className="text-xs text-red-500">{errors.totalSeats.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Status</label>
              <select 
                {...register('status')} 
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
              >
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              {errors.status && <p className="text-xs text-red-500">{errors.status.message}</p>}
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Description <span className="text-red-500">*</span></label>
              <Textarea {...register('description')} rows={5} placeholder="Provide details about the workshop..." />
              {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-sm md:pl-64 flex justify-end gap-4 z-10">
          <Button type="button" variant="outline" as={Link} to="/admin/workshops">Cancel</Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : <><Save className="w-4 h-4 mr-2" />{isEditing ? 'Update Workshop' : 'Save Workshop'}</>}
          </Button>
        </div>
      </form>
    </div>
  );
}
