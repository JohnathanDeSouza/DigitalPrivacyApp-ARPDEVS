import React, { useState, useEffect } from 'react';

// Main App component that orchestrates the entire application.
// It manages state, handles API calls, and renders the appropriate UI.
export default function App() {
  // State for user authentication, storing the JWT token.
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
  // State for navigating between different views.
  const [currentPage, setCurrentPage] = useState('dashboard');
  // State for managing loading and error messages.
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // State to hold data fetched from the backend.
  const [dashboardData, setDashboardData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [checklists, setChecklists] = useState([]);
  // State for login form data.
  const [loginForm, setLoginForm] = useState({ identifier: '', password: '' });

  // Base URL for your backend API, running on port 3000 as per your server.js.
  const API_BASE_URL = 'http://localhost:3000';

  /**
   * Fetches data from a given API endpoint with authentication.
   * @param {string} endpoint The API path to fetch data from.
   * @returns {Promise<object>} A promise that resolves with the fetched data.
   */
  const fetchData = async (endpoint) => {
    // Check if an auth token exists for the request.
    const headers = authToken ? { 'Authorization': `Bearer ${authToken}` } : {};
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, { headers });
      
      // If the response is not ok and is a 401 Unauthorized, log the user out.
      if (!response.ok) {
        if (response.status === 401) {
          setError("Session expired. Please log in again.");
          setAuthToken(null);
          localStorage.removeItem('authToken');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      console.error(`Fetch error for ${endpoint}:`, err);
      // Generic error message for the user.
      setError("Failed to load data from the server. Please ensure your backend is running.");
      throw err;
    }
  };

  /**
   * Handles the login form submission.
   * Sends a POST request to the backend's login endpoint.
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed.");
      }

      // Store the JWT token and update state.
      localStorage.setItem('authToken', data.access_token);
      setAuthToken(data.access_token);
      // Navigate to the dashboard after successful login.
      setCurrentPage('dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logs the user out by clearing the token from state and local storage.
   */
  const handleLogout = () => {
    setAuthToken(null);
    localStorage.removeItem('authToken');
    setCurrentPage('login');
  };

  // useEffect hook to fetch data whenever the currentPage or authToken changes.
  useEffect(() => {
    if (!authToken) return; // Don't fetch if not authenticated.

    const fetchPageData = async () => {
      setLoading(true);
      setError(null);

      try {
        switch (currentPage) {
          case 'dashboard':
            // Fetch user profile and data analysis report for the dashboard.
            const userProfileResult = await fetchData('/api/users/me');
            const latestReportResult = await fetchData('/api/data-analysis/reports/latest');
            setDashboardData({
                user: userProfileResult.user,
                user_profile: userProfileResult.user_profile,
                report: latestReportResult.report
            });
            break;
          case 'alerts':
            const alertsResult = await fetchData('/api/alerts');
            setAlerts(alertsResult.alerts || []);
            break;
          case 'checklists':
            const checklistsResult = await fetchData('/api/checklists');
            setChecklists(checklistsResult.checklists || []);
            break;
          default:
            break;
        }
      } catch (err) {
        // The error state is already set by fetchData.
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, [currentPage, authToken]); // Re-run the effect when currentPage or authToken changes.

  // --- UI Components ---

  const NavBar = () => (
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
              currentPage === 'checklists' ? 'bg-indigo-600' : 'hover:bg-gray-700'
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

  const Dashboard = () => {
    if (loading) return <div className="text-center p-8 text-xl text-gray-600">Loading dashboard...</div>;
    if (error) return <div className="text-center p-8 text-xl text-red-500">Error: {error}</div>;
    if (!dashboardData) return null;

    return (
      <div className="p-6 md:p-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Welcome, {dashboardData.user.username}!</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-600">Privacy Score</h3>
            <p className="mt-2 text-4xl font-bold text-indigo-600">{dashboardData.user_profile.privacy_score}</p>
            <p className="mt-1 text-sm text-gray-500">Based on your digital footprint.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-600">Active Alerts</h3>
            <p className="mt-2 text-4xl font-bold text-red-500">{dashboardData.report.shared_data_summary.found}</p>
            <p className="mt-1 text-sm text-gray-500">Items from your latest scan.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-600">Last Analysis Date</h3>
            <p className="mt-2 text-2xl font-bold text-gray-700">
              {new Date(dashboardData.report.analysis_date).toLocaleDateString()}
            </p>
            <p className="mt-1 text-sm text-gray-500">Time since last check.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-600">Data Sharing Summary</h3>
            <ul className="mt-2 text-gray-700 list-disc list-inside">
                {dashboardData.report.shared_data_summary.details.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const AlertsList = () => {
    if (loading) return <div className="text-center p-8 text-xl text-gray-600">Loading alerts...</div>;
    if (error) return <div className="text-center p-8 text-xl text-red-500">Error: {error}</div>;

    return (
      <div className="p-6 md:p-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Active Privacy Alerts</h2>
        <ul className="space-y-4">
          {alerts.length > 0 ? (
            alerts.map((alert) => (
              <li key={alert.id} className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-red-500">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-start space-y-2 md:space-y-0">
                  <h3 className="text-xl font-semibold text-gray-800">{alert.title}</h3>
                  <span className={`text-sm font-bold uppercase py-1 px-3 rounded-full ${
                    alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                    alert.severity === 'medium' ? 'bg-amber-100 text-amber-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {alert.severity}
                  </span>
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-500 text-lg">No active alerts found. You're all good!</p>
          )}
        </ul>
      </div>
    );
  };

  const ChecklistsList = () => {
    if (loading) return <div className="text-center p-8 text-xl text-gray-600">Loading checklists...</div>;
    if (error) return <div className="text-center p-8 text-xl text-red-500">Error: {error}</div>;

    return (
      <div className="p-6 md:p-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Security Checklists</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {checklists.length > 0 ? (
            checklists.map((checklist) => (
              <div key={checklist.id} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 transition-transform duration-200 hover:scale-[1.02]">
                <h3 className="text-xl font-semibold text-gray-800">{checklist.title}</h3>
                <p className="mt-2 text-sm text-gray-500">Complete these steps to improve your privacy.</p>
                <div className="mt-4 flex justify-end">
                  <button className="bg-indigo-500 text-white font-semibold py-2 px-4 rounded-full hover:bg-indigo-600 transition-colors duration-200">
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
  };

  // Login form component.
  const LoginForm = () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                id="identifier-input"
                name="identifier"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username or email"
                value={loginForm.identifier}
                onChange={(e) => setLoginForm({ ...loginForm, identifier: e.target.value })}
              />
            </div>
            <div>
              <input
                id="password-input"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              />
            </div>
          </div>
          {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Logging in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );

  // Conditional rendering based on authentication status.
  if (!authToken) {
    return <LoginForm />;
  }

  // Renders the main application view after successful login.
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'alerts':
        return <AlertsList />;
      case 'checklists':
        return <ChecklistsList />;
      default:
        return <Dashboard />;
    }
  };

  // Main application layout using Tailwind CSS for responsiveness.
  return (
    <div className="min-h-screen bg-gray-100 font-sans antialiased text-gray-800">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <NavBar />
        <main className="bg-white shadow-xl rounded-b-xl md:rounded-b-3xl">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}