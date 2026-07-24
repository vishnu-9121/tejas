import React, { Component } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from './Button';
import { Link } from 'react-router-dom';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 select-none">
          <div className="max-w-md w-full text-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 shadow-2xl">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 mb-6 border border-red-200 dark:border-red-800/60">
              <AlertCircle size={32} />
            </div>
            
            <h1 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-2">
              Something went wrong
            </h1>
            
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
              We encountered an unexpected rendering error on this section.
            </p>

            {this.state.error && (
              <div className="mb-6 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/40 text-xs font-mono text-red-700 dark:text-red-300 text-left overflow-x-auto max-h-28">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button 
                onClick={this.handleReload} 
                variant="primary"
                className="w-full sm:w-auto flex items-center justify-center gap-2 font-bold text-xs shadow-md"
              >
                <RefreshCw size={16} />
                Refresh Page
              </Button>
              <Link to="/" className="w-full sm:w-auto" onClick={() => this.setState({ hasError: false })}>
                <Button variant="outline" className="w-full flex items-center justify-center gap-2 font-bold text-xs">
                  <Home size={16} />
                  Return Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}
