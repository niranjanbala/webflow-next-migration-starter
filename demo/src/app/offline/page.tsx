import { Metadata } from 'next';
import OfflineActions from '@/components/ui/offline-actions';

export const metadata: Metadata = {
  title: 'Offline - Numeral HQ',
  description: 'You are currently offline. Please check your internet connection.',
};

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-auto h-12 w-12 text-gray-400">
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 110 19.5 9.75 9.75 0 010-19.5z"
            />
          </svg>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          You&apos;re offline
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          It looks like you&apos;re not connected to the internet. Please check your
          connection and try again.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                What you can do:
              </h3>
              <ul className="mt-2 text-sm text-gray-600 space-y-1">
                <li>• Check your internet connection</li>
                <li>• Try refreshing the page</li>
                <li>• Visit previously loaded pages</li>
              </ul>
            </div>

            <OfflineActions />
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500">
          Numeral HQ - Sales Tax on Autopilot
        </p>
      </div>
    </div>
  );
}