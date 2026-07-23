import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import api from '../../utils/api';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Download } from 'lucide-react';
import { exportToCSV } from '../../utils/exportToCSV';

export default function ManageInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const res = await api.get('/inquiries');
      setInquiries(res.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch inquiries');
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await api.put(`/inquiries/${id}/status`, { status: newStatus });
      toast.success('Status updated successfully');
      fetchInquiries();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'new': return <Badge variant="primary">New</Badge>;
      case 'in_progress': return <Badge variant="warning">In Progress</Badge>;
      case 'resolved': return <Badge variant="success">Resolved</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold font-outfit text-gray-900">Manage Inquiries</h2>
          <p className="text-sm text-gray-500 mt-1">Review contact form submissions and leads.</p>
        </div>
        <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2" onClick={() => exportToCSV(inquiries.map(inq => ({ Name: inq.name, Email: inq.email, Phone: inq.phone, Subject: inq.subject, Message: inq.message, Date: new Date(inq.createdAt).toLocaleDateString(), Status: inq.status })), 'inquiries_export')}>
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600 font-medium">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Subject</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">Loading...</td>
              </tr>
            ) : inquiries.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No inquiries found.</td>
              </tr>
            ) : (
              inquiries.map((inq) => (
                <tr key={inq._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{inq.name}</td>
                  <td className="px-6 py-4 text-gray-600">
                    <div>{inq.email}</div>
                    <div className="text-xs text-gray-400">{inq.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 max-w-xs truncate" title={inq.message}>
                    <span className="font-medium text-gray-800">{inq.subject}</span>
                    <br />
                    <span className="text-xs">{inq.message}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(inq.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(inq.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <select 
                      className="text-sm border border-gray-300 rounded-md shadow-sm p-1.5 focus:ring-primary-500 focus:border-primary-500"
                      value={inq.status}
                      onChange={(e) => updateStatus(inq._id, e.target.value)}
                    >
                      <option value="new">New</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
