import React from 'react';
import { ShieldCheckIcon, BellAlertIcon, CalendarDaysIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import EducationalContent from './EducationalContent'; // 1. Import the new component


export default function Dashboard({ dashboardData, handleInitiateScan, loading }) {
  if (!dashboardData) return null;

  return (
    <div className="p-6 md:p-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Welcome, {dashboardData.user.username}!</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 flex flex-col">
            <div className="flex items-center">
                <ShieldCheckIcon className="h-8 w-8 text-indigo-500 mr-4" />
                <h3 className="text-xl font-semibold text-gray-600">Privacy Score</h3>
            </div>
            <p className="mt-2 text-5xl font-bold text-indigo-600">{dashboardData.user_profile.privacy_score}</p>
            <p className="mt-1 text-sm text-gray-500">Based on your digital footprint.</p>
        </div>

        {dashboardData.report.isNewUser ? (
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 md:col-span-3 flex flex-col items-center justify-center text-center">
                <h3 className="text-2xl font-semibold text-gray-700">Ready to check your privacy?</h3>
                <p className="mt-2 text-gray-500">Run your first data analysis scan to see your digital footprint.</p>
                <button
                className="mt-4 bg-indigo-500 text-white font-semibold py-2 px-6 rounded-full hover:bg-indigo-600 transition-colors duration-200 flex items-center"
                onClick={handleInitiateScan}
                disabled={loading}
                >
                {loading ? 'Scanning...' : 'Start First Scan'}
                </button>
            </div>
        ) : (
            <>
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                    <div className="flex items-center">
                        <BellAlertIcon className="h-8 w-8 text-red-500 mr-4" />
                        <h3 className="text-xl font-semibold text-gray-600">Active Alerts</h3>
                    </div>
                    <p className="mt-2 text-5xl font-bold text-red-500">{dashboardData.report.shared_data_summary.found}</p>
                    <p className="mt-1 text-sm text-gray-500">Items from your latest scan.</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                    <div className="flex items-center">
                        <CalendarDaysIcon className="h-8 w-8 text-gray-500 mr-4" />
                        <h3 className="text-xl font-semibold text-gray-600">Last Scan</h3>
                    </div>
                    <p className="mt-2 text-2xl font-bold text-gray-700">
                        {new Date(dashboardData.report.analysis_date).toLocaleDateString()}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">Time since last check.</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                    <div className="flex items-center">
                        <DocumentTextIcon className="h-8 w-8 text-gray-500 mr-4" />
                        <h3 className="text-xl font-semibold text-gray-600">Summary</h3>
                    </div>
                    <ul className="mt-2 text-gray-700 list-disc list-inside">
                        {dashboardData.report.shared_data_summary.details.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>
            </>
        )}
      </div>
      <EducationalContent />
    </div>
  );
};