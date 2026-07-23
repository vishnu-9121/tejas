import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Database, Download, RefreshCw, ShieldCheck, HardDrive, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/utils/api';
import { Button } from '@/components/ui/Button';

export default function ManageBackups() {
  const [backupData, setBackupData] = useState(null);

  const generateBackupMutation = useMutation({
    mutationFn: () => api.post('/backups/generate'),
    onSuccess: (res) => {
      setBackupData(res.data?.data);
      toast.success('System database backup snapshot generated successfully!');
    },
    onError: () => toast.error('Failed to generate system backup')
  });

  const handleDownloadBackup = async () => {
    try {
      const response = await api.get('/backups/download', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `tejas_backup_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Backup archive downloaded to your computer!');
    } catch (err) {
      toast.error('Could not download backup file.');
    }
  };

  return (
    <div className="space-y-6 font-inter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-outfit">Database Backups & Disaster Recovery</h1>
          <p className="text-sm text-gray-500">Generate full system database snapshots, inspect data collections, and download JSON backup archives.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={handleDownloadBackup}
          >
            <Download className="w-4 h-4" /> Download JSON Archive
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white"
            onClick={() => generateBackupMutation.mutate()}
            isLoading={generateBackupMutation.isLoading}
          >
            <Database className="w-4 h-4" /> Generate Backup Snapshot
          </Button>
        </div>
      </div>

      {/* Snapshot Card */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">System Integrity & Data Preservation</h2>
            <p className="text-xs text-gray-500">All collections in MongoDB (Users, CMS Pages, Content Entries, Media Assets, Leads, Inquiries) are captured in raw JSON format.</p>
          </div>
        </div>

        {backupData ? (
          <div className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-4 rounded-xl text-xs flex items-center justify-between">
              <div className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Backup Generated: {new Date(backupData.timestamp).toLocaleString()}</span>
              </div>
              <span className="font-mono text-xs font-bold">{Object.keys(backupData.collections || {}).length} Collections Snapshot</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(backupData.collections || {}).map(([collectionName, docs]) => (
                <div key={collectionName} className="p-3 bg-gray-50 rounded-xl border border-gray-200/60">
                  <div className="text-xs font-bold text-gray-900 truncate">{collectionName}</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">{docs.length} Documents</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-gray-500 text-xs">
            No backup generated in this session. Click <strong>"Generate Backup Snapshot"</strong> or <strong>"Download JSON Archive"</strong> above.
          </div>
        )}
      </div>
    </div>
  );
}
