import React, { useState } from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Briefcase, MapPin, Clock, X, Upload } from 'lucide-react';
import { toast } from 'sonner';

import { useQuery } from '@tanstack/react-query';
import { cmsService } from '@/services/cmsService';

const DEFAULT_JOBS = [
  { id: 1, title: 'Senior Professor - AI', dept: 'Academics', type: 'Full-time', location: 'On-campus', exp: '10+ Years' },
  { id: 2, title: 'Student Counselor', dept: 'Support', type: 'Part-time', location: 'On-campus', exp: '3+ Years' }
];

export const Career = () => {
  const { data: cmsData, isLoading } = useQuery({
    queryKey: ['cms', 'careers'],
    queryFn: () => cmsService.getCmsData('careers'),
  });

  const jobsData = cmsData?.data?.data?.jobs || DEFAULT_JOBS;
  // Dynamic departments based on current jobs
  const dynamicDepts = ['All', ...new Set(jobsData.map(job => job.dept))];

  const [activeDept, setActiveDept] = useState('All');
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredJobs = activeDept === 'All' ? jobsData : jobsData.filter(j => j.dept === activeDept);

  const handleApply = (job) => {
    setSelectedJob(job);
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setModalOpen(false);
      toast.success(`Application submitted successfully for ${selectedJob?.title}!`);
      setSelectedJob(null);
    }, 1500);
  };

  return (
    <div className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeader 
          title="Careers at Tejas" 
          description="Join our mission to build the future of education. We are always looking for passionate individuals to join our team." 
        />

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mt-12 mb-8 justify-center">
          {dynamicDepts.map(dept => (
            <button
              key={dept}
              onClick={() => setActiveDept(dept)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                activeDept === dept 
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700 font-semibold'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-20 w-full">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
          </div>
        )}

        {/* Jobs Grid */}
        {!isLoading && (
          <div className="mt-8 space-y-4">
            {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div key={job.id} className="group flex flex-col md:flex-row justify-between items-start md:items-center p-6 lg:p-8 bg-white border border-gray-200 hover:border-primary-300 rounded-2xl shadow-sm hover:shadow-md transition-all">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-gray-100 text-gray-600 font-semibold text-xs mb-3">
                    <Briefcase className="w-3.5 h-3.5" /> {job.dept}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">{job.title}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 font-medium">
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-gray-400"/> {job.type}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-gray-400"/> {job.location}</span>
                    <span className="flex items-center gap-1.5 bg-accent-50 text-accent-700 px-2 py-0.5 rounded">Exp: {job.exp}</span>
                  </div>
                </div>
                <Button className="mt-6 md:mt-0 w-full md:w-auto px-8" onClick={() => handleApply(job)}>
                  Apply Now
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-2">No openings found</h3>
              <p className="text-gray-500">There are currently no open positions in the {activeDept} department.</p>
            </div>
          )}
          </div>
        )}
      </div>

      {/* Application Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Application Form</h3>
                <p className="text-primary-600 font-medium mt-1">Applying for: {selectedJob?.title}</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-200 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">First Name <span className="text-red-500">*</span></label>
                    <Input required placeholder="e.g. John" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Last Name <span className="text-red-500">*</span></label>
                    <Input required placeholder="e.g. Doe" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Address <span className="text-red-500">*</span></label>
                  <Input type="email" required placeholder="john.doe@example.com" />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number <span className="text-red-500">*</span></label>
                  <Input type="tel" required placeholder="+91 83310 51327" />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Resume / CV Link <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Upload className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                    <Input type="url" required className="pl-10" placeholder="https://drive.google.com/... or https://linkedin.com/in/..." />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Please provide a link to your hosted resume or LinkedIn profile.</p>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Cover Letter (Optional)</label>
                  <textarea 
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                    rows="4"
                    placeholder="Tell us why you are a great fit for this role..."
                  ></textarea>
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-end gap-4">
                  <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
                  <Button type="submit" variant="primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
