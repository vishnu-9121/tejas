import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Mail, Send, Users, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/utils/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Pagination } from '@/components/ui/Pagination';

export default function ManageEmailCampaigns() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);
  const [campaignData, setCampaignData] = useState({
    subject: '',
    body: '',
    targetSegment: 'all',
    customEmails: '',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['email-campaigns', { page }],
    queryFn: async () => {
      const res = await api.get('/campaigns', { params: { page, limit: 10 } });
      return res.data?.data;
    }
  });

  const campaigns = data?.campaigns || [];
  const totalPages = data?.pages || 1;

  const createCampaignMutation = useMutation({
    mutationFn: (payload) => api.post('/campaigns', payload),
    onSuccess: () => {
      toast.success('Campaign created successfully');
      queryClient.invalidateQueries(['email-campaigns']);
      setIsComposeModalOpen(false);
      setCampaignData({ subject: '', body: '', targetSegment: 'all', customEmails: '' });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create campaign')
  });

  const sendBroadcastMutation = useMutation({
    mutationFn: (campaignId) => api.post(`/campaigns/${campaignId}/broadcast`),
    onSuccess: (res) => {
      toast.success(res.data?.message || 'Broadcast sent successfully!');
      queryClient.invalidateQueries(['email-campaigns']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to send broadcast')
  });

  const handleCreateCampaign = (e) => {
    e.preventDefault();
    const payload = {
      ...campaignData,
      customEmails: campaignData.customEmails ? campaignData.customEmails.split(',').map(e => e.trim()) : []
    };
    createCampaignMutation.mutate(payload);
  };

  return (
    <div className="space-y-6 font-inter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-outfit">Email Broadcasts & Campaign Engine</h1>
          <p className="text-sm text-gray-500">Design email broadcasts, target specific user segments, and monitor live delivery logs.</p>
        </div>
        <Button variant="primary" size="sm" className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700" onClick={() => setIsComposeModalOpen(true)}>
          <Mail className="w-4 h-4" /> Compose Broadcast
        </Button>
      </div>

      {/* Campaign List Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Target Segment</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Sent Count</th>
                <th className="px-6 py-4">Created Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">Loading email campaigns...</td>
                </tr>
              ) : campaigns.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">No email campaigns created yet.</td>
                </tr>
              ) : (
                campaigns.map(c => (
                  <tr key={c._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-900">{c.subject}</td>
                    <td className="px-6 py-4">
                      <Badge variant="default" className="capitalize">{c.targetSegment}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      {c.status === 'sent' ? (
                        <Badge variant="success" className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Sent</Badge>
                      ) : c.status === 'sending' ? (
                        <Badge variant="warning" className="flex items-center gap-1 animate-pulse"><Clock className="w-3 h-3" /> Sending...</Badge>
                      ) : (
                        <Badge variant="default">Draft</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">{c.sentCount || 0} Delivered</td>
                    <td className="px-6 py-4 text-xs text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      {c.status !== 'sent' && (
                        <Button
                          variant="primary"
                          size="sm"
                          className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1.5 ml-auto"
                          onClick={() => sendBroadcastMutation.mutate(c._id)}
                          isLoading={sendBroadcastMutation.isLoading}
                        >
                          <Send className="w-3.5 h-3.5" /> Send Broadcast
                        </Button>
                      )}
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

      {/* Compose Campaign Modal */}
      <Modal isOpen={isComposeModalOpen} onClose={() => setIsComposeModalOpen(false)} title="Compose Email Broadcast">
        <form onSubmit={handleCreateCampaign} className="space-y-4">
          <Input
            label="Email Subject"
            placeholder="Important Announcement: Fall Admissions Open!"
            value={campaignData.subject}
            onChange={(e) => setCampaignData({ ...campaignData, subject: e.target.value })}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Target Recipient Segment</label>
            <select
              className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-900"
              value={campaignData.targetSegment}
              onChange={(e) => setCampaignData({ ...campaignData, targetSegment: e.target.value })}
            >
              <option value="all">All Registered Users</option>
              <option value="students">Enrolled Students Only</option>
              <option value="subscribers">Newsletter Subscribers</option>
              <option value="leads">CRM Leads & Prospects</option>
              <option value="custom">Custom Recipient List</option>
            </select>
          </div>

          {campaignData.targetSegment === 'custom' && (
            <Input
              label="Custom Recipient Emails (Comma separated)"
              placeholder="user1@gmail.com, user2@gmail.com"
              value={campaignData.customEmails}
              onChange={(e) => setCampaignData({ ...campaignData, customEmails: e.target.value })}
            />
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email Body Content</label>
            <textarea
              rows={6}
              className="w-full p-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-900 focus:ring-primary-500/20 focus:border-primary-500"
              placeholder="Write your email broadcast message here..."
              value={campaignData.body}
              onChange={(e) => setCampaignData({ ...campaignData, body: e.target.value })}
              required
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" type="button" onClick={() => setIsComposeModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit" isLoading={createCampaignMutation.isLoading}>Create Broadcast</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
