import React from 'react';
import { FingerPrintIcon, LockClosedIcon, CpuChipIcon } from '@heroicons/react/24/outline';

const topics = [
    {
        icon: FingerPrintIcon,
        title: "What's a Digital Footprint?",
        description: "Every action you take online—from social media posts to browsing history—leaves a trace. This data is your digital footprint. Managing it is key to protecting your privacy."
    },
    {
        icon: LockClosedIcon,
        title: "Create Strong Passwords",
        description: "Use a mix of upper/lowercase letters, numbers, and symbols. A password manager can help you create and store strong, unique passwords for every account."
    },
    {
        icon: CpuChipIcon,
        title: "Understanding Trackers",
        description: "Cookies and other trackers are used by websites to remember you and monitor your activity. Regularly clear your browser's cookies and use privacy settings to block third-party trackers."
    }
];

export default function EducationalContent() {
    return (
        <div className="mt-12">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Learn More About Privacy</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {topics.map((topic) => (
                    <div key={topic.title} className="bg-gray-50 p-6 rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <div className="flex items-center justify-center bg-indigo-100 rounded-full h-16 w-16 mb-4">
                           <topic.icon className="h-8 w-8 text-indigo-600" />
                        </div>
                        <h4 className="text-xl font-semibold text-gray-900 mb-2">{topic.title}</h4>
                        <p className="text-gray-600 leading-relaxed">{topic.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}