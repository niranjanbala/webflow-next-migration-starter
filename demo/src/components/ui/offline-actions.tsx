'use client';

export default function OfflineActions() {
  return (
    <div className="flex space-x-4">
      <button
        onClick={() => window.location.reload()}
        className="flex-1 bg-black text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
      >
        Try Again
      </button>
      <button
        onClick={() => window.history.back()}
        className="flex-1 bg-gray-200 text-gray-900 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
      >
        Go Back
      </button>
    </div>
  );
}