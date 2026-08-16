import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Download, FileText, CheckCircle, XCircle, 
  Clock, Eye, MoreVertical, ChevronDown, ChevronUp, UserCheck,
  User, Mail, Phone, School, GraduationCap, Calendar, MessageSquare,
  X, Check, AlertCircle, Sparkles, FileSpreadsheet
} from 'lucide-react';
import { toast } from 'sonner';

import { admissionService } from '@/services/admissionService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Pagination } from '@/components/ui/Pagination';
import { Tabs } from '@/components/ui/Tabs';
import { exportToExcel } from '@/utils/exportToExcel';

export default function ManageAdmissions() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState(''); // '' means all, otherwise corresponds to status
  const [selectedApps, setSelectedApps] = useState([]);
  const [activeModalApp, setActiveModalApp] = useState(null);
  const [counselorNoteInput, setCounselorNoteInput] = useState('');

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

  // Update Status & Notes Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => admissionService.updateStatus(id, payload),
    onSuccess: (res, variables) => {
      const newStatus = typeof variables.payload === 'string' ? variables.payload : variables.payload.status;
      toast.success(newStatus ? `Application updated to ${newStatus.replace('_', ' ')}` : 'Application notes updated successfully');
      queryClient.invalidateQueries(['admissions']);
      queryClient.invalidateQueries(['admissions', 'stats']);
      if (activeModalApp && activeModalApp._id === variables.id) {
        setActiveModalApp(prev => ({
          ...prev,
          ...(typeof variables.payload === 'object' ? variables.payload : { status: variables.payload })
        }));
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update application');
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
    switch(status?.toLowerCase()) {
      case 'submitted': return <Badge variant="default">New</Badge>;
      case 'under_review': return <Badge variant="warning">Under Review</Badge>;
      case 'interview_scheduled': return <Badge variant="primary">Interview</Badge>;
      case 'accepted': return <Badge variant="success">Accepted</Badge>;
      case 'rejected': return <Badge variant="error">Rejected</Badge>;
      default: return <Badge>{status || 'Submitted'}</Badge>;
    }
  };

  const tabs = [
    { id: '', label: `All (${stats.total || 0})` },
    { id: 'submitted', label: `New (${stats.submitted || 0})` },
    { id: 'under_review', label: `In Review (${stats.under_review || 0})` },
    { id: 'interview_scheduled', label: `Interviews (${stats.interview_scheduled || 0})` },
    { id: 'accepted', label: `Accepted (${stats.accepted || 0})` },
    { id: 'rejected', label: `Rejected (${stats.rejected || 0})` },
  ];

  // Helper to format rows for Excel export
  const formatForExcel = (items) => items.map((a, idx) => ({
    'S.No': idx + 1,
    'Application ID': a.applicationId || `APP-${a._id.substring(0, 8)}`,
    'Applicant Name': a.personalDetails?.fullName || a.applicant?.name || 'N/A',
    'Email': a.applicant?.email || 'N/A',
    'Phone': a.personalDetails?.phone || a.applicant?.phone || a.applicant?.phoneNumber || 'N/A',
    'Program': a.program || 'N/A',
    'Status': (a.status || 'submitted').toUpperCase().replace('_', ' '),
    'Institution / School': a.educationDetails?.institution || 'N/A',
    'Grade / CGPA': a.educationDetails?.percentageOrCGPA || 'N/A',
    'Highest Degree': a.educationDetails?.highestDegree || 'N/A',
    'Counselor Notes': a.counselorNotes || a.reviewNotes || '',
    'Date Applied': new Date(a.createdAt).toLocaleDateString('en-IN')
  }));

  const handleExportAllToExcel = async () => {
    try {
      toast.info('Generating complete Excel report...');
      await admissionService.downloadExcelExport({ status: activeTab, search });
      toast.success('Excel report downloaded successfully!');
    } catch (err) {
      // Fallback to client-side export
      const rows = formatForExcel(admissions);
      exportToExcel(rows, `tejas_admissions_${activeTab || 'all'}`);
      toast.success('Excel report exported!');
    }
  };

  const handleBulkExportSelected = () => {
    const selectedData = admissions.filter(a => selectedApps.includes(a._id));
    exportToExcel(formatForExcel(selectedData), 'tejas_admissions_selected');
    toast.success(`Exported ${selectedData.length} selected applications to Excel!`);
  };

  const openAppDetails = (app) => {
    setActiveModalApp(app);
    setCounselorNoteInput(app.counselorNotes || app.reviewNotes || '');
  };

  const handleSaveNotes = () => {
    if (!activeModalApp) return;
    updateMutation.mutate({
      id: activeModalApp._id,
      payload: {
        counselorNotes: counselorNoteInput,
        reviewNotes: counselorNoteInput
      }
    });
  };

  const handleStatusChange = (newStatus) => {
    if (!activeModalApp) return;
    updateMutation.mutate({
      id: activeModalApp._id,
      payload: { status: newStatus }
    });
  };

  return (
    <div className="space-y-6 font-inter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-outfit">Admissions & Applications</h1>
          <p className="text-sm text-gray-500">Manage student applications, track review statuses, and export reports.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="primary" 
            size="sm" 
            className="flex items-center gap-2 font-bold shadow-sm" 
            onClick={handleExportAllToExcel}
          >
            <FileSpreadsheet className="w-4 h-4" /> Export Applications (.xlsx)
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-gray-400">Total Applications</p>
            <h3 className="text-2xl font-extrabold text-gray-900">{stats.total || 0}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-gray-400">Pending Review</p>
            <h3 className="text-2xl font-extrabold text-gray-900">{(stats.submitted || 0) + (stats.under_review || 0)}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-gray-400">Accepted</p>
            <h3 className="text-2xl font-extrabold text-gray-900">{stats.accepted || 0}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-gray-400">Interviews</p>
            <h3 className="text-2xl font-extrabold text-gray-900">{stats.interview_scheduled || 0}</h3>
          </div>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-100">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={(id) => { setActiveTab(id); setPage(1); }} className="px-4 pt-2" />
        </div>
        
        <div className="p-4 flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input 
              type="text" 
              placeholder="Search by ID, name, email or phone..." 
              className="pl-9 w-full bg-white text-xs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">
              Showing page {page} of {totalPages}
            </span>
          </div>
        </div>

        {/* Bulk Actions Banner */}
        <AnimatePresence>
          {selectedApps.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-primary-50 border-y border-primary-100 px-4 py-2.5 flex justify-between items-center"
            >
              <span className="text-xs font-semibold text-primary-800">
                {selectedApps.length} applications selected
              </span>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-white h-7 text-xs font-semibold" 
                  onClick={handleBulkExportSelected}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 mr-1" /> Export Selected to Excel
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enterprise Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-gray-50/80 text-gray-600 font-semibold border-b border-gray-100">
              <tr>
                <th className="px-6 py-3.5 w-10">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-600 cursor-pointer"
                    onChange={handleSelectAll}
                    checked={admissions.length > 0 && selectedApps.length === admissions.length}
                  />
                </th>
                <th className="px-6 py-3.5">Application ID</th>
                <th className="px-6 py-3.5">Applicant Name & Email</th>
                <th className="px-6 py-3.5">Phone</th>
                <th className="px-6 py-3.5">Program</th>
                <th className="px-6 py-3.5">Applied Date</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex justify-center items-center gap-3">
                      <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                      Loading applications...
                    </div>
                  </td>
                </tr>
              ) : admissions.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                    No applications found matching the criteria.
                  </td>
                </tr>
              ) : (
                admissions.map((app) => (
                  <tr 
                    key={app._id} 
                    className="hover:bg-gray-50/60 transition-colors"
                  >
                    <td className="px-6 py-3.5">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-600 cursor-pointer"
                        checked={selectedApps.includes(app._id)}
                        onChange={() => handleSelectOne(app._id)}
                      />
                    </td>
                    <td className="px-6 py-3.5 font-mono font-bold text-primary-700">
                      {app.applicationId || `APP-${app._id.substring(0, 8)}`}
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="font-semibold text-gray-900">{app.personalDetails?.fullName || app.applicant?.name || 'Applicant'}</div>
                      <div className="text-gray-400">{app.applicant?.email || app.personalDetails?.email || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-3.5 text-gray-600 font-mono">
                      {app.personalDetails?.phone || app.applicant?.phone || app.applicant?.phoneNumber || 'N/A'}
                    </td>
                    <td className="px-6 py-3.5 text-gray-800 font-medium max-w-[220px] truncate">
                      {app.program}
                    </td>
                    <td className="px-6 py-3.5 text-gray-500">
                      {new Date(app.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-6 py-3.5">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 px-2.5 text-xs font-semibold flex items-center gap-1.5 ml-auto"
                        onClick={() => openAppDetails(app)}
                      >
                        <Eye className="w-3.5 h-3.5 text-primary-600" /> Review
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex justify-between items-center">
          <Pagination 
            currentPage={page} 
            totalPages={totalPages} 
            onPageChange={setPage} 
          />
        </div>
      </div>

      {/* DETAILED APPLICATION MODAL (PHASE 10) */}
      <AnimatePresence>
        {activeModalApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-100 font-inter"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white/95 backdrop-blur-xs z-10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-primary-700 bg-primary-50 px-2.5 py-0.5 rounded-full border border-primary-100">
                      {activeModalApp.applicationId || `APP-${activeModalApp._id.substring(0, 8)}`}
                    </span>
                    {getStatusBadge(activeModalApp.status)}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mt-1 font-outfit">
                    {activeModalApp.personalDetails?.fullName || activeModalApp.applicant?.name}
                  </h3>
                </div>
                <button 
                  onClick={() => setActiveModalApp(null)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6 text-xs">
                
                {/* Program Info */}
                <div className="bg-primary-50/60 p-4 rounded-2xl border border-primary-100/80">
                  <span className="font-semibold text-primary-800 uppercase tracking-wider block text-[10px] mb-1">
                    Target Academic Program
                  </span>
                  <div className="text-sm font-bold text-primary-950">{activeModalApp.program}</div>
                </div>

                {/* Personal & Contact Details */}
                <div>
                  <h4 className="font-bold text-gray-900 uppercase tracking-wider text-[11px] mb-3 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-primary-600" />
                    Applicant Contact Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-gray-50/80 p-4 rounded-2xl border border-gray-100">
                    <div>
                      <span className="text-gray-400 block">Email Address</span>
                      <span className="font-semibold text-gray-800">{activeModalApp.applicant?.email || activeModalApp.personalDetails?.email || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Phone Number</span>
                      <span className="font-semibold text-gray-800">{activeModalApp.personalDetails?.phone || activeModalApp.applicant?.phone || activeModalApp.applicant?.phoneNumber || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Application Date</span>
                      <span className="font-semibold text-gray-800">{new Date(activeModalApp.createdAt).toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Gender / Address</span>
                      <span className="font-semibold text-gray-800">{activeModalApp.personalDetails?.gender || 'Other'} / {activeModalApp.personalDetails?.address || 'Online'}</span>
                    </div>
                  </div>
                </div>

                {/* Academic History */}
                <div>
                  <h4 className="font-bold text-gray-900 uppercase tracking-wider text-[11px] mb-3 flex items-center gap-1.5">
                    <School className="w-3.5 h-3.5 text-primary-600" />
                    Academic Profile
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-gray-50/80 p-4 rounded-2xl border border-gray-100">
                    <div>
                      <span className="text-gray-400 block">School / College</span>
                      <span className="font-semibold text-gray-800">{activeModalApp.educationDetails?.institution || 'Not Specified'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Score / CGPA</span>
                      <span className="font-semibold text-gray-800">{activeModalApp.educationDetails?.percentageOrCGPA || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Degree / Grade</span>
                      <span className="font-semibold text-gray-800">{activeModalApp.educationDetails?.highestDegree || 'High School'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Passing Year</span>
                      <span className="font-semibold text-gray-800">{activeModalApp.educationDetails?.yearOfPassing || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Status Decision Controls */}
                <div>
                  <h4 className="font-bold text-gray-900 uppercase tracking-wider text-[11px] mb-3">
                    Application Status Decision
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'submitted', label: 'New / Submitted', color: 'hover:bg-gray-100' },
                      { id: 'under_review', label: 'In Review', color: 'hover:bg-amber-50 text-amber-700' },
                      { id: 'interview_scheduled', label: 'Schedule Interview', color: 'hover:bg-blue-50 text-blue-700' },
                      { id: 'accepted', label: 'Accept Application', color: 'hover:bg-emerald-50 text-emerald-700' },
                      { id: 'rejected', label: 'Reject Application', color: 'hover:bg-red-50 text-red-700' }
                    ].map(statusOption => (
                      <button
                        key={statusOption.id}
                        onClick={() => handleStatusChange(statusOption.id)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                          activeModalApp.status === statusOption.id
                            ? 'bg-primary-600 text-white border-primary-600 shadow-xs'
                            : `bg-white border-gray-200 ${statusOption.color}`
                        }`}
                      >
                        {statusOption.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Internal Counselor Notes */}
                <div>
                  <h4 className="font-bold text-gray-900 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-primary-600" />
                    Internal Counselor & Reviewer Notes
                  </h4>
                  <textarea
                    rows={3}
                    value={counselorNoteInput}
                    onChange={(e) => setCounselorNoteInput(e.target.value)}
                    placeholder="Enter counselor notes, interview feedback, or verification remarks..."
                    className="w-full p-3 rounded-2xl border border-gray-200 text-xs focus:ring-2 focus:ring-primary-500 focus:outline-none bg-white"
                  />
                  <div className="flex justify-end mt-2">
                    <Button 
                      size="sm" 
                      variant="primary" 
                      onClick={handleSaveNotes}
                      isLoading={updateMutation.isPending}
                      className="text-xs font-bold"
                    >
                      Save Counselor Notes
                    </Button>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center rounded-b-3xl">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => exportToExcel(formatForExcel([activeModalApp]), `admission_${activeModalApp.applicationId || activeModalApp._id}`)}
                  className="text-xs flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> Export Record (.xlsx)
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setActiveModalApp(null)}
                  className="text-xs font-semibold"
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
