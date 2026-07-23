import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ArrowLeft, Mail, Phone, MapPin, Calendar, BookOpen, 
  Award, FileText, Clock, User, Download, Edit2 
} from 'lucide-react';
import { toast } from 'sonner';

import { studentService } from '@/services/studentService';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';

export default function StudentProfile() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');

  const { data, isLoading } = useQuery({
    queryKey: ['student', id],
    queryFn: () => studentService.getStudentById(id),
    enabled: !!id && id !== 'new'
  });

  const student = data?.data;

  if (isLoading) {
    return <div className="p-12 text-center">Loading profile...</div>;
  }

  if (!student && id !== 'new') {
    return <div className="p-12 text-center text-red-500">Student not found</div>;
  }

  const getStatusBadge = (status) => {
    switch(status) {
      case 'active': return <Badge variant="success">Active</Badge>;
      case 'suspended': return <Badge variant="error">Suspended</Badge>;
      case 'alumni': return <Badge variant="primary">Alumni</Badge>;
      case 'dropped': return <Badge variant="warning">Dropped</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'academics', label: 'Academic Info' },
    { id: 'timeline', label: 'Timeline & History' },
    { id: 'documents', label: 'Documents' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" as={Link} to="/admin/students" className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Profile</h1>
          <p className="text-sm text-gray-500">View and manage detailed student information.</p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary-600 to-accent-600 relative">
          <Button variant="outline" size="sm" className="absolute top-4 right-4 bg-white/10 text-white border-white/20 hover:bg-white/20">
            <Edit2 className="w-4 h-4 mr-2" /> Edit Cover
          </Button>
        </div>
        <div className="px-8 pb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start -mt-12 relative">
            <div className="w-32 h-32 rounded-2xl bg-white p-2 shadow-lg shrink-0">
              <div className="w-full h-full rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-4xl overflow-hidden">
                {student?.profileImage ? (
                  <img src={student.profileImage} alt={student.user?.name} className="w-full h-full object-cover" />
                ) : (
                  student?.user?.name?.[0] || 'U'
                )}
              </div>
            </div>
            <div className="pt-14 md:pt-16 flex-grow flex flex-col md:flex-row justify-between md:items-start gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-3xl font-bold text-gray-900">{student?.user?.name}</h2>
                  {getStatusBadge(student?.status)}
                </div>
                <p className="text-gray-500 font-medium">ID: {student?.studentId} • {student?.academicInfo?.program?.title}</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Resume</Button>
                <Button variant="primary"><Edit2 className="w-4 h-4 mr-2" /> Edit Profile</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="px-4 pt-2" />
        
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {/* Personal Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
                  <User className="w-5 h-5 text-primary-600" /> Personal Details
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-gray-600">
                    <Mail className="w-5 h-5 text-gray-400 shrink-0" />
                    <div>
                      <div className="text-sm text-gray-500">Email</div>
                      <div className="font-medium text-gray-900">{student?.user?.email}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-gray-600">
                    <Phone className="w-5 h-5 text-gray-400 shrink-0" />
                    <div>
                      <div className="text-sm text-gray-500">Phone</div>
                      <div className="font-medium text-gray-900">{student?.contactInfo?.phone || 'N/A'}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-gray-600">
                    <Calendar className="w-5 h-5 text-gray-400 shrink-0" />
                    <div>
                      <div className="text-sm text-gray-500">Date of Birth</div>
                      <div className="font-medium text-gray-900">
                        {student?.personalInfo?.dateOfBirth ? new Date(student.personalInfo.dateOfBirth).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-gray-600">
                    <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
                    <div>
                      <div className="text-sm text-gray-500">Address</div>
                      <div className="font-medium text-gray-900">
                        {student?.contactInfo?.address ? (
                          <>
                            {student.contactInfo.address.street}, {student.contactInfo.address.city}<br />
                            {student.contactInfo.address.state}, {student.contactInfo.address.country}
                          </>
                        ) : 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guardian Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
                  <User className="w-5 h-5 text-primary-600" /> Guardian Details
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-gray-600">
                    <User className="w-5 h-5 text-gray-400 shrink-0" />
                    <div>
                      <div className="text-sm text-gray-500">Father's Name</div>
                      <div className="font-medium text-gray-900">{student?.guardianDetails?.fatherName || 'N/A'}</div>
                      <div className="text-sm text-gray-500 mt-1">{student?.guardianDetails?.fatherPhone || ''}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-gray-600">
                    <Phone className="w-5 h-5 text-gray-400 shrink-0" />
                    <div>
                      <div className="text-sm text-gray-500">Emergency Contact</div>
                      <div className="font-medium text-gray-900">{student?.guardianDetails?.emergencyContactName || 'N/A'}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        {student?.guardianDetails?.emergencyContactRelation ? `(${student.guardianDetails.emergencyContactRelation}) ` : ''}
                        {student?.guardianDetails?.emergencyContactPhone || ''}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Academic Snapshot */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
                  <BookOpen className="w-5 h-5 text-primary-600" /> Academic Snapshot
                </h3>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Enrollment Date</span>
                    <span className="font-semibold text-gray-900">
                      {student?.academicInfo?.enrollmentDate ? new Date(student.academicInfo.enrollmentDate).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Current Semester</span>
                    <span className="font-semibold text-gray-900">{student?.academicInfo?.currentSemester || 1}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Attendance</span>
                    <span className="font-semibold text-green-600">{student?.academicInfo?.attendancePercentage || 0}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">CGPA</span>
                    <span className="font-semibold text-primary-600 text-lg">{student?.academicInfo?.cgpa || '0.00'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="max-w-3xl">
               <h3 className="text-lg font-bold text-gray-900 mb-6">Activity Timeline</h3>
               <div className="relative border-l-2 border-gray-100 ml-4 space-y-8">
                  {student?.timeline?.length > 0 ? (
                    student.timeline.map((event, i) => (
                      <div key={i} className="relative pl-8">
                        <div className="absolute w-4 h-4 bg-primary-100 border-2 border-primary-600 rounded-full -left-[9px] top-1"></div>
                        <div className="text-sm text-gray-500 mb-1">{new Date(event.date).toLocaleString()}</div>
                        <h4 className="font-bold text-gray-900">{event.title}</h4>
                        {event.description && <p className="text-gray-600 mt-1">{event.description}</p>}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 pl-8">No timeline events recorded yet.</p>
                  )}
               </div>
            </div>
          )}
          
          {/* Other tabs placeholder */}
          {(activeTab === 'academics' || activeTab === 'documents') && (
            <div className="text-center py-12 text-gray-500">
              <p>Detailed {activeTab} section coming soon.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
