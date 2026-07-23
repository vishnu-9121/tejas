import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { UserCheck, Plus, Filter, Search, Phone, Mail, Clock, Calendar, CheckCircle2, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/utils/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Pagination } from '@/components/ui/Pagination';

export default function ManageLeadsCRM() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['leads-crm', { page, status: statusFilter, search }],
    queryFn: async () => {
      const res = await api.get('/leads', { params: { page, limit: 15, status: statusFilter, search } });
      return res.data?.data;
    }
  });

  const leads = data?.leads || [];
  const totalPages = data?.pages || 1;

  const updateStatusMutation = useMutation({
    mutationFn: ({ leadId, status, note }) => api.put(`/leads/${leadId}/status`, { status, note }),
    onSuccess: () => {
      toast.success('Lead status updated successfully');
      queryClient.invalidateQueries(['leads-crm']);
      setSelectedLead(null);
      setStatusNote('');
    },
    onError: () => toast.error('Failed to update lead status')
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'new': return <Badge variant="primary">New Lead</Badge>;
      case 'contacted': return <Badge variant="warning">Contacted</Badge>;
      case 'qualified': return <Badge variant="success">Qualified</Badge>;
      case 'converted': return <Badge variant="success" className="font-bold">Converted</Badge>;
      case 'lost': return <Badge variant="error">Lost</Badge>;
      default: return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 font-inter">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-outfit">Enterprise CRM & Lead Pipeline</h1>
          <p className="text-sm text-gray-500">Track inquiries, manage prospect follow-ups, and measure conversion stages.</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search prospect by name, email, or phone..."
            className="pl-9 text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            className="bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold px-3 py-2 text-gray-700 cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Pipeline Stages</option>
            <option value="new">New Lead</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="converted">Converted</option>
            <option value="lost">Lost</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Prospect</th>
                <th className="px-6 py-4">Program Interest</th>
                <th className="px-6 py-4">Source</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">Loading lead pipeline...</td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">No leads found in this pipeline view.</td>
                </tr>
              ) : (
                leads.map(lead => (
                  <tr key={lead._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{lead.name}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {lead.email}</span>
                        {lead.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {lead.phone}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-700">{lead.program}</td>
                    <td className="px-6 py-4 text-xs text-gray-500">{lead.source}</td>
                    <td className="px-6 py-4">{getStatusBadge(lead.status)}</td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => {
                          setSelectedLead(lead);
                          setNewStatus(lead.status);
                        }}
                      >
                        Manage Pipeline Stage
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100">
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>

      {/* Pipeline Stage Modal */}
      <Modal isOpen={!!selectedLead} onClose={() => setSelectedLead(null)} title={`Lead Pipeline: ${selectedLead?.name}`}>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Update Stage Status</label>
            <select
              className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-900"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="new">New Lead</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>
          </div>

          <Input
            label="Internal Note"
            placeholder="Add follow-up details or call summary..."
            value={statusNote}
            onChange={(e) => setStatusNote(e.target.value)}
          />

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setSelectedLead(null)}>Cancel</Button>
            <Button
              variant="primary"
              onClick={() => updateStatusMutation.mutate({ leadId: selectedLead._id, status: newStatus, note: statusNote })}
              isLoading={updateStatusMutation.isLoading}
            >
              Save Pipeline Changes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
