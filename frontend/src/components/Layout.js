import React from 'react';
import Footer from './Footer'; // 1. Import the new Footer component

const NavBar = ({ currentPage, setCurrentPage, handleLogout }) => (
  <nav className="bg-gray-800 text-white p-4 shadow-lg rounded-t-xl md:rounded-t-3xl">
    <div className="container mx-auto flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
      <div className="text-xl font-bold">Privacy Dashboard</div>
      <div className="space-x-2 md:space-x-4 flex">
        <button
          className={`font-semibold rounded-lg py-2 px-4 transition-colors duration-200 ${
            currentPage === 'dashboard' ? 'bg-indigo-600' : 'hover:bg-gray-700'
          }`}
          onClick={() => setCurrentPage('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={`font-semibold rounded-lg py-2 px-4 transition-colors duration-200 ${
            currentPage === 'alerts' ? 'bg-indigo-600' : 'hover:bg-gray-700'
          }`}
          onClick={() => setCurrentPage('alerts')}
        >
          Alerts
        </button>
        <button
          className={`font-semibold rounded-lg py-2 px-4 transition-colors duration-200 ${
            currentPage.startsWith('checklist') ? 'bg-indigo-600' : 'hover:bg-gray-700'
          }`}
          onClick={() => setCurrentPage('checklists')}
        >
          Checklists
        </button>
        <button
          className="font-semibold rounded-lg py-2 px-4 transition-colors duration-200 hover:bg-red-700"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  </nav>
);

export default function Layout({ children, currentPage, setCurrentPage, handleLogout }) {
  return (
    <div className="min-h-screen bg-gray-100 font-sans antialiased text-gray-800 flex flex-col">
      {/* Main content area that will grow to push the footer down */}
      <div className="flex-grow">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <NavBar 
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            handleLogout={handleLogout}
          />
          <main className="bg-white shadow-xl rounded-b-xl md:rounded-b-3xl">
            {children}
          </main>
        </div>
      </div>

      {/* 2. Add the Footer component at the end */}
      <Footer />
    </div>
  );
}