import React from 'react';
import { ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';

const ChecklistsList = ({ checklists, handleViewChecklist }) => (
    <div className="p-6 md:p-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Security Checklists</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {checklists.length > 0 ? (
            checklists.map((checklist) => (
              <div key={checklist.id} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 transition-transform duration-200 hover:scale-[1.02] flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{checklist.title}</h3>
                  <p className="mt-2 text-sm text-gray-500">Complete these steps to improve your privacy.</p>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    className="bg-indigo-500 text-white font-semibold py-2 px-4 rounded-full hover:bg-indigo-600 transition-colors duration-200"
                    onClick={() => handleViewChecklist(checklist.id)}
                  >
                    View
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-lg">No checklists found.</p>
          )}
        </div>
    </div>
);

const ChecklistDetail = ({ selectedChecklist, handleUpdateChecklistItemStatus, setCurrentPage, setSelectedChecklist }) => (
    <div className="p-6 md:p-10">
        <button
          className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-full hover:bg-gray-300 transition-colors duration-200 mb-6"
          onClick={() => {
            setCurrentPage('checklists');
            setSelectedChecklist(null);
          }}
        >
          &larr; Back to Checklists
        </button>
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
            <ClipboardDocumentCheckIcon className="h-8 w-8 mr-3 text-indigo-600" />
            {selectedChecklist.title}
        </h2>
        <ul className="space-y-4">
          {selectedChecklist.items.map(item => (
            <li key={item.id} className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-indigo-500">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-lg text-gray-800">{item.description}</p>
                <div className="flex items-center space-x-4 mt-4 md:mt-0">
                  <span className={`text-sm font-bold uppercase py-1 px-3 rounded-full ${
                    item.status === 'completed' ? 'bg-green-100 text-green-800' :
                    item.status === 'in_progress' ? 'bg-amber-100 text-amber-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {item.status.replace('_', ' ')}
                  </span>
                  <select
                    className="border border-gray-300 rounded-md p-2"
                    value={item.status}
                    onChange={(e) => handleUpdateChecklistItemStatus(selectedChecklist.id, item.id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            </li>
          ))}
        </ul>
    </div>
);

export default function Checklists({ checklists, selectedChecklist, handleViewChecklist, handleUpdateChecklistItemStatus, setCurrentPage, setSelectedChecklist }) {
    if (selectedChecklist) {
        return <ChecklistDetail 
            selectedChecklist={selectedChecklist}
            handleUpdateChecklistItemStatus={handleUpdateChecklistItemStatus}
            setCurrentPage={setCurrentPage}
            setSelectedChecklist={setSelectedChecklist}
        />
    }

    return <ChecklistsList checklists={checklists} handleViewChecklist={handleViewChecklist} />;
}