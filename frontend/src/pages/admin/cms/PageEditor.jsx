import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Save, Eye, Send, History, Plus, GripVertical, Trash2 } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

export const PageEditor = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Mock initial state for the visual builder until we wire the backend entirely
  const [blocks, setBlocks] = useState([
    { type: 'HeroBlock', data: { title: 'Welcome to Tejas Academy', subtitle: 'Edit this text...' }, isActive: true },
    { type: 'StatsBlock', data: { stats: [{ label: 'Students', value: '15k+' }] }, isActive: true }
  ]);

  const handleSaveDraft = () => {
    toast.success('Draft saved successfully! (Mock)');
  };

  const handlePublish = () => {
    toast.success('Page published to live site! (Mock)');
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Editor Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Editing: {slug || 'Homepage'}</h1>
          <p className="text-sm text-gray-500 mt-1">Status: <span className="text-amber-500 font-bold">Draft (Unsaved changes)</span></p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => alert('Opening Version History')} className="gap-2">
            <History size={16}/> Version History
          </Button>
          <Button variant="outline" onClick={() => window.open('/', '_blank')} className="gap-2">
            <Eye size={16}/> Preview
          </Button>
          <Button variant="primary" onClick={handleSaveDraft} className="gap-2 bg-gray-900 hover:bg-black text-white">
            <Save size={16}/> Save Draft
          </Button>
          <Button variant="primary" onClick={handlePublish} className="gap-2 bg-green-600 hover:bg-green-700 text-white border-green-600 shadow-lg shadow-green-500/30">
            <Send size={16}/> Publish Live
          </Button>
        </div>
      </div>

      {/* Block Builder Area */}
      <div className="space-y-4">
        {blocks.map((block, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden group">
            <div className="bg-gray-50 border-b border-gray-200 p-3 flex justify-between items-center cursor-move">
              <div className="flex items-center gap-3">
                <GripVertical size={16} className="text-gray-400" />
                <span className="font-bold text-gray-700">{block.type}</span>
              </div>
              <button className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 size={16} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-500 italic">JSON Editor interface for {block.type} will render here.</p>
              <pre className="mt-4 bg-gray-900 text-green-400 p-4 rounded-xl text-xs overflow-x-auto">
                {JSON.stringify(block.data, null, 2)}
              </pre>
            </div>
          </div>
        ))}

        {/* Add Block Button */}
        <button className="w-full py-8 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-500 hover:text-primary-600 hover:border-primary-300 hover:bg-primary-50 transition-colors">
          <Plus size={24} className="mb-2" />
          <span className="font-bold">Add New Block</span>
        </button>
      </div>
    </div>
  );
};
