'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Check if error is related to chunk loading (offline issue)
    if (error.message?.includes('Failed to load chunk') || 
        error.message?.includes('Failed to fetch') ||
        error.stack?.includes('chunk')) {
      console.warn('[ErrorBoundary] Chunk loading error detected - likely offline');
    }
  }

  render() {
    if (this.state.hasError) {
      const isOfflineError = this.state.error?.message?.includes('Failed to load chunk') ||
                            this.state.error?.message?.includes('Failed to fetch') ||
                            navigator.onLine === false;
      
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-8">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 max-w-md text-center">
            {isOfflineError ? (
              <>
                <div className="text-6xl mb-4">📡</div>
                <h2 className="text-2xl font-bold text-white mb-4">You're Offline</h2>
                <p className="text-blue-100 mb-6">
                  This page requires internet connection to load. Please check your connection and try again.
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => window.location.href = '/offline'}
                    className="block w-full bg-white text-blue-900 font-semibold py-3 px-6 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    Go to Offline Page
                  </button>
                  <button
                    onClick={() => window.location.reload()}
                    className="block w-full bg-white/10 text-white font-semibold py-3 px-6 rounded-lg hover:bg-white/20 transition-colors border border-white/20"
                  >
                    Try Again
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold text-red-400 mb-4">Something went wrong</h2>
                <p className="text-gray-300 mb-4">
                  There was an error loading this page. Please try refreshing.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                >
                  Refresh Page
                </button>
              </>
            )}
            {this.state.error && (
              <details className="mt-4">
                <summary className="text-sm text-gray-400 cursor-pointer">Error Details</summary>
                <pre className="text-xs text-gray-500 mt-2 overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
