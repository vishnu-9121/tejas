import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import App from './App.jsx';
import { SocketProvider } from './contexts/SocketContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';

const queryClient = new QueryClient();
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <ErrorBoundary>
            <SocketProvider>
              <ThemeProvider>
                <App />
              </ThemeProvider>
            </SocketProvider>
          </ErrorBoundary>
          <Toaster position="top-right" richColors />
        </QueryClientProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
