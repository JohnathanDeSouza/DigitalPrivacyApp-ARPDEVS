import React from 'react';
import { ExclamationTriangleIcon, ExclamationCircleIcon, ShieldExclamationIcon } from '@heroicons/react/24/solid';

export default function AlertsList({ alerts }) {
    // Determine the icon and color based on severity
    const getSeverityDetails = (severity) => {
        switch (severity.toLowerCase()) {
            case 'high':
                return { icon: ExclamationTriangleIcon, colorClass: 'text-red-600', bgClass: 'bg-red-50' };
            case 'medium':
                return { icon: ExclamationCircleIcon, colorClass: 'text-yellow-600', bgClass: 'bg-yellow-50' };
            case 'low':
                return { icon: ShieldExclamationIcon, colorClass: 'text-green-600', bgClass: 'bg-green-50' };
            default:
                return { icon: ExclamationCircleIcon, colorClass: 'text-gray-500', bgClass: 'bg-gray-50' };
        }
    };

    return (
        <div className="p-6 md:p-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Active Privacy Alerts</h2>
            <div className="space-y-6">
                {alerts.length > 0 ? (
                    alerts.map((alert) => {
                        const { icon: Icon, colorClass, bgClass } = getSeverityDetails(alert.severity);
                        return (
                            <div key={alert.id} className={`flex items-start p-6 rounded-2xl shadow-md border ${bgClass} transition-all duration-200 hover:shadow-lg`}>
                                <Icon className={`h-8 w-8 mr-4 flex-shrink-0 ${colorClass}`} aria-hidden="true" />
                                <div className="flex-grow">
                                    <h3 className="text-xl font-semibold text-gray-900 leading-tight">{alert.title}</h3>
                                    <p className="mt-1 text-gray-700">{alert.description || "No specific description provided."}</p>
                                </div>
                                <span className={`ml-4 flex-shrink-0 text-sm font-bold uppercase py-1 px-3 rounded-full ${
                                    alert.severity.toLowerCase() === 'high' ? 'bg-red-200 text-red-800' :
                                    alert.severity.toLowerCase() === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                                    'bg-green-200 text-green-800'
                                }`}>
                                    {alert.severity}
                                </span>
                            </div>
                        );
                    })
                ) : (
                    <div className="bg-white p-8 rounded-2xl shadow-md text-center">
                        <ShieldExclamationIcon className="mx-auto h-20 w-20 text-green-500 mb-4" />
                        <p className="text-gray-600 text-xl font-medium">No active alerts found.</p>
                        <p className="mt-2 text-gray-500">Looks like your privacy is in great shape!</p>
                    </div>
                )}
            </div>
        </div>
    );
}