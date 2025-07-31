'use client';

import { useState, useEffect } from 'react';

interface WorkboxType {
  addEventListener: (event: string, callback: (event: { sw: ServiceWorker }) => void) => void;
  register: () => void;
}

export default function UpdateNotification() {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const wb = (window as Window & { workbox?: WorkboxType }).workbox;
      
      if (wb) {
        // Listen for waiting service worker
        wb.addEventListener('waiting', (event: { sw: ServiceWorker }) => {
          setWaitingWorker(event.sw);
          setShowUpdatePrompt(true);
        });

        // Listen for controlling service worker change
        wb.addEventListener('controlling', () => {
          window.location.reload();
        });

        // Register the service worker
        wb.register();
      }
    }
  }, []);

  const handleUpdateClick = () => {
    if (waitingWorker) {
      // Tell the waiting service worker to skip waiting
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      setShowUpdatePrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowUpdatePrompt(false);
  };

  if (!showUpdatePrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
      <div className="bg-blue-50 border border-blue-200 rounded-lg shadow-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-blue-900">
              Update Available
            </h3>
            <p className="text-sm text-blue-700 mt-1">
              A new version of Numeral HQ is available. Update now to get the latest features and improvements.
            </p>
            
            <div className="mt-3 flex space-x-2">
              <button
                onClick={handleUpdateClick}
                className="bg-blue-500 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Update Now
              </button>
              <button
                onClick={handleDismiss}
                className="bg-white text-blue-700 border border-blue-300 px-3 py-1.5 rounded text-sm font-medium hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Later
              </button>
            </div>
          </div>
          
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-blue-400 hover:text-blue-500"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}