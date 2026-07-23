import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Download, FileText, CheckCircle, XCircle, 
  Clock, Eye, MoreVertical, ChevronDown, ChevronUp, UserCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import { admissionService } from '@/services/admissionService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Pagination } from '@/components/ui/Pagination';
import { Tabs } from '@/components/ui/Tabs';
import { exportToCSV } from '@/utils/exportToCSV';

export default function ManageAdmissions() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState(''); // '' means all, otherwise corresponds to status
  const [selectedApps, setSelectedApps] = useState([]);

  // Fetch Stats
  const { data: statsData } = useQuery({
    queryKey: ['admissions', 'stats'],
    queryFn: admissionService.getStats,
  });
  const stats = statsData?.data || {};

  // Fetch Applications
  const { data, isLoading } = useQuery({
    queryKey: ['admissions', { page, search, status: activeTab }],
    queryFn: () => admissionService.getAdmissions({ page, limit: 10, search, status: activeTab }),
    keepPreviousData: true,
  });

  const admissions = data?.data?.admissions || [];
  const totalPages = data?.data?.pagination?.pages || 1;

  // Update Status Mutation
  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => admissionService.updateStatus(id, status),
    onSuccess: (data, variables) => {
      toast.success(`Application marked as ${variables.status.replace('_', ' ')}`);
      queryClient.invalidateQueries(['admissions']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  });

  const handleSelectAll = (e) => {
    if (e.target.checked) setSelectedApps(admissions.map(a => a._id));
    else setSelectedApps([]);
  };

  const handleSelectOne = (id) => {
    if (selectedApps.includes(id)) setSelectedApps(selectedApps.filter(aId => aId !== id));
    else setSelectedApps([...selectedApps, id]);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'submitted': return <Badge variant="default">New</Badge>;
      case 'under_review': return <Badge variant="warning">Under Review</Badge>;
      case 'interview_scheduled': return <Badge variant="primary">Interview</Badge>;
      case 'accepted': return <Badge variant="success">Accepted</Badge>;
      case 'rejected': return <Badge variant="error">Rejected</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const tabs = [
    { id: '', label: `All (${stats.total || 0})` },
    { id: 'submitted', label: `New (${stats.submitted || 0})` },
    { id: 'under_review', label: `In Review (${stats.under_review || 0})` },
    { id: 'interview_scheduled', label: `Interviews (${stats.interview_scheduled || 0})` },
    { id: 'accepted', label: `Accepted (${stats.accepted || 0})` },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admission Management</h1>
          <p className="text-sm text-gray-500">Review applications, schedule interviews, and finalize admissions.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2" onClick={() => exportToCSV(admissions.map(a => ({ 'App ID': a.applicationId, 'Applicant': a.personalDetails?.fullName, 'Email': a.applicant?.email, 'Program': a.program, 'Status': a.status, 'Date Applied': new Date(a.createdAt).toLocaleDateString() })), 'admissions_export')}>
            <Download className="w-4 h-4" /> Export Report
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Applications</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.total || 0}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-warning-50 flex items-center justify-center text-warning-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Pending Review</p>
            <h3 className="text-2xl font-bold text-gray-900">{(stats.submitted || 0) + (stats.under_review || 0)}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-success-50 flex items-center justify-center text-success-600">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Accepted</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.accepted || 0}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Interviews</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.interview_scheduled || 0}</h3>
          </div>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-100">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={(id) => { setActiveTab(id); setPage(1); }} className="px-4 pt-2" />
        </div>
        
        <div className="p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input 
              type="text" 
              placeholder="Search by ID or applicant name..." 
              className="pl-10 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" className="w-full sm:w-auto flex items-center gap-2">
            <Filter className="w-4 h-4" /> Advanced Filters
          </Button>
        </div>

        {/* Bulk Actions Banner */}
        <AnimatePresence>
          {selectedApps.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-primary-50 border-y border-primary-100 px-4 py-3 flex justify-between items-center overflow-hidden"
            >
              <span className="text-sm font-medium text-primary-700">
                {selectedApps.length} applications selected
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="bg-white h-8 text-xs" onClick={() => {
                  const selectedData = admissions.filter(a => selectedApps.includes(a._id)).map(a => ({ 'App ID': a.applicationId, 'Applicant': a.personalDetails?.fullName, 'Email': a.applicant?.email, 'Program': a.program, 'Status': a.status, 'Date Applied': new Date(a.createdAt).toLocaleDateString() }));
                  exportToCSV(selectedData, 'admissions_bulk_export');
                }}>Bulk Export</Button>
                <Button variant="outline" size="sm" className="bg-white h-8 text-xs text-success-600 border-success-200 hover:bg-success-50">Approve Selected</Button>
                <Button variant="outline" size="sm" className="bg-white h-8 text-xs text-error-600 border-error-200 hover:bg-error-50">Reject Selected</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enterprise Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-600 font-medium border-y border-gray-200">
              <tr>
                <th className="px-6 py-4 w-12">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                    onChange={handleSelectAll}
                    checked={admissions.length > 0 && selectedApps.length === admissions.length}
                  />
                </th>
                <th className="px-6 py-4">App ID</th>
                <th className="px-6 py-4">Applicant</th>
                <th className="px-6 py-4">Program</th>
                <th className="px-6 py-4">Date Applied</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex justify-center items-center gap-3">
                      <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                      Loading applications...
                    </div>
                  </td>
                </tr>
              ) : admissions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    No applications found.
                  </td>
                </tr>
              ) : (
                admissions.map((app) => (
                  <motion.tr 
                    key={app._id} 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                        checked={selectedApps.includes(app._id)}
                        onChange={() => handleSelectOne(app._id)}
                      />
                    </td>
                    <td className="px-6 py-4 font-medium text-primary-700">{app.applicationId}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{app.personalDetails?.fullName || 'N/A'}</div>
                      <div className="text-xs text-gray-500">{app.applicant?.email || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{app.program}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          as={Link} 
                          to={`/admin/admissions/${app._id}`}
                          title="Review Application"
                        >
                          <Eye className="w-4 h-4 text-gray-500 hover:text-primary-600" />
                        </Button>
                        
                        {app.status === 'submitted' && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0" 
                            onClick={() => statusMutation.mutate({ id: app._id, status: 'under_review' })}
                            title="Mark as Under Review"
                          >
                            <FileText className="w-4 h-4 text-warning-500" />
                          </Button>
                        )}
                        
                        {(app.status === 'under_review' || app.status === 'interview_scheduled') && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0" 
                            onClick={() => statusMutation.mutate({ id: app._id, status: 'accepted' })}
                            title="Accept"
                          >
                            <CheckCircle className="w-4 h-4 text-success-500" />
                          </Button>
                        )}

                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => statusMutation.mutate({ id: app._id, status: 'rejected' })}
                          title="Reject"
                        >
                          <XCircle className="w-4 h-4 text-error-500" />
                        </Button>
                      </div>
                      <div className="group-hover:hidden text-gray-400">
                        <MoreVertical className="w-4 h-4 ml-auto" />
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100">
            <Pagination 
              currentPage={page} 
              totalPages={totalPages} 
              onPageChange={setPage} 
            />
          </div>
        )}
      </div>
    </div>
  );
}
