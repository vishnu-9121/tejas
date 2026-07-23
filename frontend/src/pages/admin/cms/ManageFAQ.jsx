import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, HelpCircle, Plus, Trash2, GripVertical } from 'lucide-react';
import { toast } from 'sonner';

import { cmsService } from '@/services/cmsService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

export default function ManageFAQ() {
  const queryClient = useQueryClient();

  const { data: cmsData, isLoading } = useQuery({
    queryKey: ['cms', 'global_faqs'],
    queryFn: () => cmsService.getCMSData('global_faqs'),
  });

  const { control, register, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    defaultValues: {
      categories: [
        {
          name: 'Admissions',
          faqs: [{ question: '', answer: '' }]
        }
      ]
    }
  });

  const { fields: categoryFields, append: appendCategory, remove: removeCategory } = useFieldArray({
    control,
    name: "categories"
  });

  useEffect(() => {
    if (cmsData?.data?.data) {
      reset(cmsData.data.data);
    }
  }, [cmsData, reset]);

  const mutation = useMutation({
    mutationFn: (data) => cmsService.updateCMSData('global_faqs', data),
    onSuccess: () => {
      toast.success('FAQ configuration saved successfully');
      queryClient.invalidateQueries(['cms', 'global_faqs']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to save FAQs');
    }
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  const CategoryBlock = ({ categoryIndex, removeCategory }) => {
    const { fields: faqFields, append: appendFaq, remove: removeFaq } = useFieldArray({
      control,
      name: `categories.${categoryIndex}.faqs`
    });

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6 relative overflow-hidden group">
        <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
          <div className="flex-1 space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category Name</label>
            <Input 
              {...register(`categories.${categoryIndex}.name`)} 
              placeholder="e.g. Admissions & Financial Aid" 
              className="text-lg font-bold border-transparent focus:border-primary-500 bg-gray-50 max-w-sm"
            />
          </div>
          <Button type="button" variant="ghost" onClick={() => removeCategory(categoryIndex)} className="text-red-500 hover:bg-red-50">
            <Trash2 className="w-4 h-4 mr-2" /> Delete Category
          </Button>
        </div>

        <div className="space-y-4">
          {faqFields.map((faq, faqIndex) => (
            <div key={faq.id} className="flex gap-4 items-start bg-gray-50 p-4 border border-gray-100 rounded-lg">
              <div className="pt-2 text-gray-400 cursor-grab"><GripVertical className="w-5 h-5" /></div>
              <div className="flex-1 space-y-3">
                <Input {...register(`categories.${categoryIndex}.faqs.${faqIndex}.question`)} placeholder="Question" className="bg-white font-medium" />
                <Textarea {...register(`categories.${categoryIndex}.faqs.${faqIndex}.answer`)} placeholder="Answer" rows={3} className="bg-white" />
              </div>
              <Button type="button" variant="ghost" className="text-gray-400 hover:text-red-500" onClick={() => removeFaq(faqIndex)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        <Button type="button" variant="outline" size="sm" onClick={() => appendFaq({ question: '', answer: '' })} className="w-full border-dashed">
          <Plus className="w-4 h-4 mr-2" /> Add Question to Category
        </Button>
      </div>
    );
  };

  if (isLoading) return <div className="p-12 text-center text-gray-500">Loading FAQs...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">FAQ Manager</h1>
          <p className="text-sm text-gray-500">Categorize and manage Frequently Asked Questions.</p>
        </div>
        <Button type="button" onClick={() => appendCategory({ name: '', faqs: [{ question: '', answer: '' }] })}>
          <Plus className="w-4 h-4 mr-2" /> Add Category
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {categoryFields.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-12 text-center text-gray-500">
            No FAQ categories exist. Click "Add Category" to get started.
          </div>
        ) : (
          categoryFields.map((category, index) => (
            <CategoryBlock key={category.id} categoryIndex={index} removeCategory={removeCategory} />
          ))
        )}

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-sm md:pl-64 flex justify-end z-10">
          <Button type="submit" variant="primary" disabled={isSubmitting} className="min-w-[150px]">
            {isSubmitting ? 'Saving...' : <><Save className="w-4 h-4 mr-2" />Save FAQs</>}
          </Button>
        </div>
      </form>
    </div>
  );
}
