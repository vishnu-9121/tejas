import api from '../utils/api';

export const newsletterService = {
  getSubscribers: async (params) => {
    const response = await api.get('/newsletter', { params });
    return response.data;
  },

  subscribe: async (email) => {
    const response = await api.post('/newsletter/subscribe', { email });
    return response.data;
  },

  unsubscribe: async (email) => {
    const response = await api.post('/newsletter/unsubscribe', { email });
    return response.data;
  },
  
  exportToCSV: (subscribers) => {
    const csvContent = "data:text/csv;charset=utf-8,Email,Subscribed On\n" 
      + subscribers.map(s => `${s.email},${new Date(s.createdAt).toLocaleDateString()}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
