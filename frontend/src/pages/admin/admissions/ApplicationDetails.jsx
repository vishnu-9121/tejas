import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ArrowLeft, FileText, CheckCircle, XCircle, Clock, Calendar, 
  MapPin, Phone, Mail, GraduationCap, Award, File, ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

import { admissionService } from '@/services/admissionService';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';

export default function ApplicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('details');

  const { data, isLoading } = useQuery({
    queryKey: ['admission', id],
    queryFn: () => admissionService.getAdmissionById(id),
  });

  const app = data?.data;

  const statusMutation = useMutation({
    mutationFn: (newStatus) => admissionService.updateStatus(id, newStatus),
    onSuccess: (data, variables) => {
      toast.success(`Application status updated to ${variables.replace('_', ' ')}`);
      queryClient.invalidateQueries(['admission', id]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  });

  if (isLoading) {
    return <div className="p-12 text-center">Loading application...</div>;
  }

  if (!app) {
    return <div className="p-12 text-center text-red-500">Application not found</div>;
  }

  const getStatusBadge = (status) => {
    switch(status) {
      case 'submitted': return <Badge variant="default">New (Submitted)</Badge>;
      case 'under_review': return <Badge variant="warning">Under Review</Badge>;
      case 'interview_scheduled': return <Badge variant="primary">Interview Scheduled</Badge>;
      case 'accepted': return <Badge variant="success">Accepted</Badge>;
      case 'rejected': return <Badge variant="error">Rejected</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const tabs = [
    { id: 'details', label: 'Application Details' },
    { id: 'documents', label: 'Documents' },
    { id: 'timeline', label: 'Timeline & Notes' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" as={Link} to="/admin/admissions" className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">Application #{app.applicationId}</h1>
              {getStatusBadge(app.status)}
            </div>
            <p className="text-sm text-gray-500">Submitted on {new Date(app.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-3 bg-white p-2 rounded-lg shadow-sm border border-gray-100">
          {app.status === 'submitted' && (
            <Button size="sm" variant="outline" className="text-warning-600 border-warning-200 hover:bg-warning-50" onClick={() => statusMutation.mutate('under_review')}>
              <FileText className="w-4 h-4 mr-2" /> Mark as Under Review
            </Button>
          )}
          {(app.status === 'under_review') && (
            <Button size="sm" variant="outline" className="text-primary-600 border-primary-200 hover:bg-primary-50" onClick={() => statusMutation.mutate('interview_scheduled')}>
              <Clock className="w-4 h-4 mr-2" /> Schedule Interview
            </Button>
          )}
          {(app.status !== 'accepted' && app.status !== 'rejected') && (
            <>
              <Button size="sm" variant="outline" className="text-success-600 border-success-200 hover:bg-success-50" onClick={() => statusMutation.mutate('accepted')}>
                <CheckCircle className="w-4 h-4 mr-2" /> Accept
              </Button>
              <Button size="sm" variant="outline" className="text-error-600 border-error-200 hover:bg-error-50" onClick={() => statusMutation.mutate('rejected')}>
                <XCircle className="w-4 h-4 mr-2" /> Reject
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left/Main Column - Applicant Summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="text-center mb-6">
              <div className="w-24 h-24 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-3xl mx-auto mb-4">
                {app.personalDetails?.fullName?.[0] || 'A'}
              </div>
              <h2 className="text-xl font-bold text-gray-900">{app.personalDetails?.fullName}</h2>
              <p className="text-primary-600 font-medium mt-1">Applying for: {app.program}</p>
            </div>

            <div className="space-y-4 pt-6 border-t border-gray-100">
              <h3 className="font-semibold text-gray-900">Contact Information</h3>
              <div className="flex items-center gap-3 text-gray-600">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{app.applicant?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{app.personalDetails?.phone}</span>
              </div>
              <div className="flex items-start gap-3 text-gray-600">
                <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                <span className="text-sm">{app.personalDetails?.address}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm">DOB: {new Date(app.personalDetails?.dateOfBirth).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right/Wide Column - Detailed Information */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full">
            <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="px-6 pt-4 border-b border-gray-100" />
            
            <div className="p-6">
              {activeTab === 'details' && (
                <div className="space-y-8">
                  <section>
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                      <GraduationCap className="w-5 h-5 text-primary-600" /> Educational Background
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-5 border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Highest Degree</div>
                        <div className="font-semibold text-gray-900">{app.educationDetails?.highestDegree}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Institution</div>
                        <div className="font-semibold text-gray-900">{app.educationDetails?.institution}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Year of Passing</div>
                        <div className="font-semibold text-gray-900">{app.educationDetails?.yearOfPassing}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Percentage / CGPA</div>
                        <div className="font-semibold text-gray-900">{app.educationDetails?.percentageOrCGPA}</div>
                      </div>
                    </div>
                  </section>
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                    <File className="w-5 h-5 text-primary-600" /> Uploaded Documents
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {app.documents?.resumeUrl && (
                      <div className="border border-gray-200 rounded-lg p-4 flex items-start gap-4 hover:border-primary-300 transition-colors">
                        <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600 shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-medium text-gray-900">Resume / CV</h4>
                          <p className="text-xs text-gray-500 mb-2">PDF Document</p>
                          <a href={app.documents.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                            View Document <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {app.documents?.idProofUrl && (
                      <div className="border border-gray-200 rounded-lg p-4 flex items-start gap-4 hover:border-primary-300 transition-colors">
                        <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600 shrink-0">
                          <Award className="w-5 h-5" />
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-medium text-gray-900">ID Proof</h4>
                          <p className="text-xs text-gray-500 mb-2">Image / PDF</p>
                          <a href={app.documents.idProofUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                            View Document <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    )}

                    {!app.documents?.resumeUrl && !app.documents?.idProofUrl && (
                      <div className="col-span-full py-8 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                        No documents were uploaded with this application.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'timeline' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                    <Clock className="w-5 h-5 text-primary-600" /> Application Timeline
                  </h3>
                  <div className="relative border-l-2 border-gray-100 ml-4 space-y-8">
                    <div className="relative pl-8">
                      <div className="absolute w-4 h-4 bg-primary-100 border-2 border-primary-600 rounded-full -left-[9px] top-1"></div>
                      <div className="text-sm text-gray-500 mb-1">{new Date(app.createdAt).toLocaleString()}</div>
                      <h4 className="font-bold text-gray-900">Application Submitted</h4>
                      <p className="text-gray-600 mt-1">The applicant successfully submitted their application for {app.program}.</p>
                    </div>
                    {app.updatedAt !== app.createdAt && (
                      <div className="relative pl-8">
                        <div className="absolute w-4 h-4 bg-white border-2 border-gray-300 rounded-full -left-[9px] top-1"></div>
                        <div className="text-sm text-gray-500 mb-1">{new Date(app.updatedAt).toLocaleString()}</div>
                        <h4 className="font-bold text-gray-900">Status Updated</h4>
                        <p className="text-gray-600 mt-1">Application status was updated to <strong className="capitalize">{app.status.replace('_', ' ')}</strong>.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
