import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save, Plus, Trash2, GripVertical } from 'lucide-react';
import { toast } from 'sonner';

import { eventService } from '@/services/eventService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Tabs } from '@/components/ui/Tabs';

const eventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  category: z.enum(['Academic', 'Cultural', 'Leadership', 'Career', 'Other']),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  location: z.string().min(2, 'Location is required'),
  mapUrl: z.string().url('Must be a valid URL').or(z.literal('')),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  image: z.string().url('Must be a valid URL').or(z.literal('')),
  registrationLink: z.string().url('Must be a valid URL').or(z.literal('')),
  capacity: z.number().min(0).optional(),
  status: z.enum(['Upcoming', 'Ongoing', 'Past', 'Cancelled']),
  agenda: z.array(z.object({
    time: z.string(),
    title: z.string(),
    speaker: z.string()
  })).optional(),
  speakers: z.array(z.object({
    name: z.string(),
    designation: z.string(),
    image: z.string()
  })).optional(),
});

export default function EventForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('basic');

  const { data: eventData, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: () => eventService.getEventById(id),
    enabled: isEditing,
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      category: 'Academic',
      date: '',
      time: '',
      location: 'Tejas Academy Campus',
      mapUrl: '',
      description: '',
      image: '',
      registrationLink: '',
      capacity: 0,
      status: 'Upcoming',
      agenda: [],
      speakers: []
    }
  });

  const { fields: agendaFields, append: appendAgenda, remove: removeAgenda } = useFieldArray({ control, name: "agenda" });
  const { fields: speakerFields, append: appendSpeaker, remove: removeSpeaker } = useFieldArray({ control, name: "speakers" });

  useEffect(() => {
    if (eventData?.data) {
      const e = eventData.data;
      reset({
        title: e.title || '',
        category: e.category || 'Academic',
        date: e.date ? new Date(e.date).toISOString().split('T')[0] : '',
        time: e.time || '',
        location: e.location || 'Tejas Academy Campus',
        mapUrl: e.mapUrl || '',
        description: e.description || '',
        image: e.image || '',
        registrationLink: e.registrationLink || '',
        capacity: e.capacity || 0,
        status: e.status || 'Upcoming',
        agenda: e.agenda || [],
        speakers: e.speakers || []
      });
    }
  }, [eventData, reset]);

  const mutation = useMutation({
    mutationFn: (data) => isEditing ? eventService.updateEvent(id, data) : eventService.createEvent(data),
    onSuccess: () => {
      toast.success(isEditing ? 'Event updated' : 'Event created');
      queryClient.invalidateQueries(['events']);
      navigate('/admin/events');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'content', label: 'Location & Content' },
    { id: 'schedule', label: 'Agenda & Speakers' },
  ];

  if (isLoading) return <div className="p-12 text-center">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" as={Link} to="/admin/events" className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Event' : 'Create New Event'}
          </h1>
          <p className="text-sm text-gray-500">Manage event details, agenda, speakers, and maps.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-100">
            <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="px-6 pt-4" />
          </div>

          <div className="p-6">
            
            {/* Tab: Basic Info */}
            <div className={activeTab === 'basic' ? 'block' : 'hidden'}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Event Title <span className="text-red-500">*</span></label>
                  <Input {...register('title')} placeholder="e.g. Annual Leadership Summit 2026" className="text-lg font-medium" />
                  {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Category <span className="text-red-500">*</span></label>
                  <select 
                    {...register('category')} 
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Leadership">Leadership</option>
                    <option value="Career">Career</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Event Status</label>
                  <select 
                    {...register('status')} 
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Past">Past</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Date <span className="text-red-500">*</span></label>
                  <Input type="date" {...register('date')} />
                  {errors.date && <p className="text-xs text-red-500">{errors.date.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Time <span className="text-red-500">*</span></label>
                  <Input {...register('time')} placeholder="e.g. 10:00 AM - 04:00 PM" />
                  {errors.time && <p className="text-xs text-red-500">{errors.time.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Capacity (Number of Seats)</label>
                  <Input type="number" {...register('capacity', { valueAsNumber: true })} placeholder="e.g. 150" />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Registration URL</label>
                  <Input type="url" {...register('registrationLink')} placeholder="https://..." />
                </div>
              </div>
            </div>

            {/* Tab: Location & Content */}
            <div className={activeTab === 'content' ? 'block' : 'hidden'}>
              <div className="space-y-6">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Banner Image URL</label>
                  <Input type="url" {...register('image')} placeholder="https://..." />
                  {errors.image && <p className="text-xs text-red-500">{errors.image.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Detailed Description (Markdown) <span className="text-red-500">*</span></label>
                  <Textarea {...register('description')} rows={8} placeholder="Full event description, why attend, prerequisites..." />
                  {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Location Text <span className="text-red-500">*</span></label>
                  <Input {...register('location')} placeholder="e.g. Grand Auditorium, Tejas Academy Campus" />
                  {errors.location && <p className="text-xs text-red-500">{errors.location.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Google Maps Embed URL (src attribute from iframe)</label>
                  <Input type="url" {...register('mapUrl')} placeholder="https://www.google.com/maps/embed?..." />
                  <p className="text-xs text-gray-500">Go to Google Maps -&gt; Share -&gt; Embed a map -&gt; Copy just the URL inside the src="..." attribute.</p>
                </div>
              </div>
            </div>

            {/* Tab: Agenda & Speakers */}
            <div className={activeTab === 'schedule' ? 'block' : 'hidden'}>
              <div className="space-y-8">
                
                {/* Agenda */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="text-lg font-bold text-gray-900">Event Agenda</h3>
                    <Button type="button" variant="outline" size="sm" onClick={() => appendAgenda({ time: '', title: '', speaker: '' })}>
                      <Plus className="w-4 h-4 mr-2" /> Add Session
                    </Button>
                  </div>
                  
                  {agendaFields.length === 0 && <p className="text-sm text-gray-500 italic">No agenda items added.</p>}

                  <div className="space-y-3">
                    {agendaFields.map((field, index) => (
                      <div key={field.id} className="flex gap-3 items-start bg-gray-50 p-3 border border-gray-200 rounded-lg">
                        <div className="pt-2 text-gray-400 cursor-grab"><GripVertical className="w-4 h-4" /></div>
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                          <Input {...register(`agenda.${index}.time`)} placeholder="Time (e.g. 10:00 AM)" className="bg-white" />
                          <Input {...register(`agenda.${index}.title`)} placeholder="Session Title" className="bg-white md:col-span-2" />
                          <Input {...register(`agenda.${index}.speaker`)} placeholder="Speaker / Facilitator Name" className="bg-white md:col-span-3" />
                        </div>
                        <Button type="button" variant="ghost" className="text-gray-400 hover:text-red-500" onClick={() => removeAgenda(index)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Speakers */}
                <div className="space-y-4 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="text-lg font-bold text-gray-900">Guest Speakers</h3>
                    <Button type="button" variant="outline" size="sm" onClick={() => appendSpeaker({ name: '', designation: '', image: '' })}>
                      <Plus className="w-4 h-4 mr-2" /> Add Speaker
                    </Button>
                  </div>

                  {speakerFields.length === 0 && <p className="text-sm text-gray-500 italic">No speakers added.</p>}

                  <div className="space-y-3">
                    {speakerFields.map((field, index) => (
                      <div key={field.id} className="flex gap-3 items-start bg-gray-50 p-3 border border-gray-200 rounded-lg">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                          <Input {...register(`speakers.${index}.name`)} placeholder="Speaker Name" className="bg-white" />
                          <Input {...register(`speakers.${index}.designation`)} placeholder="Designation (e.g. CEO at TechCorp)" className="bg-white" />
                          <Input {...register(`speakers.${index}.image`)} type="url" placeholder="Photo URL" className="bg-white md:col-span-2" />
                        </div>
                        <Button type="button" variant="ghost" className="text-gray-400 hover:text-red-500" onClick={() => removeSpeaker(index)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:pl-64 flex justify-end gap-4 z-10">
          <Button type="button" variant="outline" as={Link} to="/admin/events">Cancel</Button>
          <Button type="submit" variant="primary" disabled={isSubmitting} className="min-w-[120px]">
            {isSubmitting ? 'Saving...' : <><Save className="w-4 h-4 mr-2" />{isEditing ? 'Update Event' : 'Save Event'}</>}
          </Button>
        </div>
      </form>
    </div>
  );
}
