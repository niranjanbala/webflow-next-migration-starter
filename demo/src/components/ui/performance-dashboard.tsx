'use client';

import { useState, useEffect } from 'react';
import { performanceMonitor, PerformanceMetrics } from '@/lib/performance-monitor';

interface PerformanceDashboardProps {
  showInProduction?: boolean;
}

export default function PerformanceDashboard({ showInProduction = false }: PerformanceDashboardProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const [scores, setScores] = useState<any>({});
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development or if explicitly enabled in production
    if (process.env.NODE_ENV === 'production' && !showInProduction) {
      return;
    }

    const updateMetrics = () => {
      setMetrics(performanceMonitor.getMetrics());
      setScores(performanceMonitor.getCoreWebVitalsScore());
      setRecommendations(performanceMonitor.getRecommendations());
    };

    // Initial update
    updateMetrics();

    // Update every 5 seconds
    const interval = setInterval(updateMetrics, 5000);

    return () => clearInterval(interval);
  }, [showInProduction]);

  const formatTime = (time?: number) => {
    if (time === undefined) return 'N/A';
    return `${time.toFixed(2)}ms`;
  };

  const getScoreColor = (score: string) => {
    switch (score) {
      case 'good': return 'text-green-600';
      case 'needs-improvement': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getScoreIcon = (score: string) => {
    switch (score) {
      case 'good': return '✅';
      case 'needs-improvement': return '⚠️';
      case 'poor': return '❌';
      default: return '❓';
    }
  };

  if (process.env.NODE_ENV === 'production' && !showInProduction) {
    return null;
  }

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        title="Performance Dashboard"
      >
        📊
      </button>

      {/* Dashboard Panel */}
      {isVisible && (
        <div className="fixed bottom-16 right-4 z-50 bg-white border border-gray-300 rounded-lg shadow-xl p-4 w-80 max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Performance Dashboard</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* Core Web Vitals */}
          <div className="mb-4">
            <h4 className="font-medium mb-2">Core Web Vitals</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>LCP (Largest Contentful Paint):</span>
                <span className={getScoreColor(scores.lcp)}>
                  {getScoreIcon(scores.lcp)} {formatTime(metrics.lcp)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>FID (First Input Delay):</span>
                <span className={getScoreColor(scores.fid)}>
                  {getScoreIcon(scores.fid)} {formatTime(metrics.fid)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>CLS (Cumulative Layout Shift):</span>
                <span className={getScoreColor(scores.cls)}>
                  {getScoreIcon(scores.cls)} {metrics.cls?.toFixed(3) || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Other Metrics */}
          <div className="mb-4">
            <h4 className="font-medium mb-2">Other Metrics</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>FCP (First Contentful Paint):</span>
                <span>{formatTime(metrics.fcp)}</span>
              </div>
              <div className="flex justify-between">
                <span>TTFB (Time to First Byte):</span>
                <span>{formatTime(metrics.ttfb)}</span>
              </div>
              <div className="flex justify-between">
                <span>DOM Content Loaded:</span>
                <span>{formatTime(metrics.domContentLoaded)}</span>
              </div>
              <div className="flex justify-between">
                <span>Load Complete:</span>
                <span>{formatTime(metrics.loadComplete)}</span>
              </div>
            </div>
          </div>

          {/* Resource Info */}
          <div className="mb-4">
            <h4 className="font-medium mb-2">Resources</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Resource Count:</span>
                <span>{metrics.resourceCount || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Size:</span>
                <span>
                  {metrics.totalResourceSize 
                    ? `${(metrics.totalResourceSize / 1024).toFixed(2)} KB`
                    : 'N/A'
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Overall Score */}
          <div className="mb-4">
            <h4 className="font-medium mb-2">Overall Score</h4>
            <div className={`text-center p-2 rounded ${
              scores.overall === 'good' ? 'bg-green-100 text-green-800' :
              scores.overall === 'needs-improvement' ? 'bg-yellow-100 text-yellow-800' :
              scores.overall === 'poor' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {getScoreIcon(scores.overall)} {scores.overall?.toUpperCase() || 'UNKNOWN'}
            </div>
          </div>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium mb-2">Recommendations</h4>
              <ul className="text-xs space-y-1">
                {recommendations.map((rec, index) => (
                  <li key={index} className="text-gray-600">
                    • {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Export Button */}
          <button
            onClick={() => {
              const data = performanceMonitor.exportMetrics();
              const blob = new Blob([data], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `performance-metrics-${Date.now()}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded text-sm hover:bg-blue-700 transition-colors"
          >
            Export Metrics
          </button>
        </div>
      )}
    </>
  );
}