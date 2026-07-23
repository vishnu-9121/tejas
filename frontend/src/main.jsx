import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import { GoogleOAuthProvider } from '@react-oauth/google';
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
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "431275153097-c3vgp6aop1iumeu069h5kssmi6bnoius.apps.googleusercontent.com"}>
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
    </GoogleOAuthProvider>
  </React.StrictMode>
);
