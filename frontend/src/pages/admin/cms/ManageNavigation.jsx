import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Plus, Trash2, GripVertical, Navigation } from 'lucide-react';
import { toast } from 'sonner';

import { cmsService } from '@/services/cmsService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function ManageNavigation() {
  const queryClient = useQueryClient();

  const { data: cmsData, isLoading } = useQuery({
    queryKey: ['cms', 'global_navigation'],
    queryFn: () => cmsService.getCMSData('global_navigation'),
  });

  const { control, register, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    defaultValues: {
      headerLinks: [
        { label: 'Home', url: '/' },
        { label: 'About Us', url: '/about' },
        { label: 'Programs', url: '/programs' },
        { label: 'Admissions', url: '/admissions' },
        { label: 'Contact', url: '/contact' }
      ],
      footerLinks: [
        {
          group: 'Academics',
          links: [
            { label: 'All Programs', url: '/programs' },
            { label: 'Faculty', url: '/faculty' }
          ]
        },
        {
          group: 'Campus Life',
          links: [
            { label: 'Events', url: '/events' },
            { label: 'Gallery', url: '/gallery' }
          ]
        }
      ]
    }
  });

  const { fields: headerFields, append: appendHeader, remove: removeHeader } = useFieldArray({
    control,
    name: "headerLinks"
  });

  const { fields: footerFields, append: appendFooterGroup, remove: removeFooterGroup } = useFieldArray({
    control,
    name: "footerLinks"
  });

  useEffect(() => {
    if (cmsData?.data?.data) {
      reset(cmsData.data.data);
    }
  }, [cmsData, reset]);

  const mutation = useMutation({
    mutationFn: (data) => cmsService.updateCMSData('global_navigation', data),
    onSuccess: () => {
      toast.success('Navigation saved successfully');
      queryClient.invalidateQueries(['cms', 'global_navigation']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to save navigation');
    }
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  const FooterGroupBlock = ({ groupIndex, removeGroup }) => {
    const { fields: linkFields, append: appendLink, remove: removeLink } = useFieldArray({
      control,
      name: `footerLinks.${groupIndex}.links`
    });

    return (
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-4">
        <div className="flex items-center gap-4">
          <Input 
            {...register(`footerLinks.${groupIndex}.group`)} 
            placeholder="e.g. Useful Links" 
            className="font-bold bg-white max-w-[200px]"
          />
          <div className="flex-1" />
          <Button type="button" variant="ghost" onClick={() => removeGroup(groupIndex)} className="text-red-500 hover:bg-red-50">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-2 pl-4 border-l-2 border-gray-200">
          {linkFields.map((link, linkIndex) => (
            <div key={link.id} className="flex gap-2 items-center">
              <GripVertical className="w-4 h-4 text-gray-400" />
              <Input {...register(`footerLinks.${groupIndex}.links.${linkIndex}.label`)} placeholder="Label" className="bg-white text-sm" />
              <Input {...register(`footerLinks.${groupIndex}.links.${linkIndex}.url`)} placeholder="/url-path" className="bg-white text-sm" />
              <Button type="button" variant="ghost" size="sm" className="text-gray-400 hover:text-red-500" onClick={() => removeLink(linkIndex)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="ghost" size="sm" onClick={() => appendLink({ label: '', url: '' })} className="text-primary-600 mt-2">
            <Plus className="w-3 h-3 mr-1" /> Add Link
          </Button>
        </div>
      </div>
    );
  };

  if (isLoading) return <div className="p-12 text-center text-gray-500">Loading Navigation...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Navigation Manager</h1>
        <p className="text-sm text-gray-500">Manage the Main Navbar and Footer Links dynamically.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Header Links */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2">
              <Navigation className="w-5 h-5 text-primary-600" />
              <h3 className="text-lg font-bold text-gray-900">Header Navbar Links</h3>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() => appendHeader({ label: '', url: '' })}>
              <Plus className="w-4 h-4 mr-2" /> Add Main Link
            </Button>
          </div>
          
          <div className="space-y-3">
            {headerFields.map((field, index) => (
              <div key={field.id} className="flex gap-4 items-center bg-gray-50 p-3 border border-gray-100 rounded-lg">
                <GripVertical className="w-5 h-5 text-gray-400 cursor-grab" />
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500 uppercase">Label</label>
                    <Input {...register(`headerLinks.${index}.label`)} placeholder="e.g. About Us" className="bg-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500 uppercase">URL Path</label>
                    <Input {...register(`headerLinks.${index}.url`)} placeholder="e.g. /about" className="bg-white" />
                  </div>
                </div>
                <Button type="button" variant="ghost" className="text-gray-400 hover:text-red-500 mt-5" onClick={() => removeHeader(index)}>
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Links */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2">
              <Navigation className="w-5 h-5 text-gray-600 transform rotate-180" />
              <h3 className="text-lg font-bold text-gray-900">Footer Link Groups</h3>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() => appendFooterGroup({ group: '', links: [] })}>
              <Plus className="w-4 h-4 mr-2" /> Add Footer Group
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {footerFields.map((group, index) => (
              <FooterGroupBlock key={group.id} groupIndex={index} removeGroup={removeFooterGroup} />
            ))}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-sm md:pl-64 flex justify-end z-10">
          <Button type="submit" variant="primary" disabled={isSubmitting} className="min-w-[150px]">
            {isSubmitting ? 'Saving...' : <><Save className="w-4 h-4 mr-2" />Save Navigation</>}
          </Button>
        </div>
      </form>
    </div>
  );
}
