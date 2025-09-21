import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import AlertsList from './components/AlertsList';
import Checklists from './components/Checklists';
import Auth from './components/Auth';

export default function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [authMode, setAuthMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [checklists, setChecklists] = useState([]);
  const [selectedChecklist, setSelectedChecklist] = useState(null);
  const [loginForm, setLoginForm] = useState({ identifier: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ username: '', email: '', password: '' });

  const API_BASE_URL = 'http://localhost:3000';

  const fetchData = async (endpoint, options = {}) => {
    // ... (keep the fetchData function from the previous step, it's unchanged)
    const { method = 'GET', body = null } = options;
    const headers = authToken ? { 'Authorization': `Bearer ${authToken}` } : {};
    if (body) {
      headers['Content-Type'] = 'application/json';
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError("Session expired. Please log in again.");
          handleLogout();
        }
        const err = new Error(`HTTP error! status: ${response.status}`);
        err.status = response.status;
        const responseBody = await response.json().catch(() => ({ error: "An unknown error occurred" }));
        err.message = responseBody.error || err.message;
        throw err;
      }
      const text = await response.text();
      return text ? JSON.parse(text) : {};
    } catch (err) {
      console.error(`Fetch error for ${endpoint}:`, err);
      setError(err.message || "Failed to communicate with the server. Please ensure your backend is running.");
      throw err;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await fetchData('/api/auth/login', { method: 'POST', body: loginForm });
      localStorage.setItem('authToken', data.access_token);
      setAuthToken(data.access_token);
      setCurrentPage('dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await fetchData('/api/auth/register', { method: 'POST', body: registerForm });
      localStorage.setItem('authToken', data.access_token);
      setAuthToken(data.access_token);
      setCurrentPage('dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setAuthToken(null);
    localStorage.removeItem('authToken');
    setDashboardData(null);
    setAlerts([]);
    setChecklists([]);
    setSelectedChecklist(null);
    setCurrentPage('dashboard');
    setAuthMode('login');
  };

  const refreshDashboard = async () => {
    try {
      const userProfileResult = await fetchData('/api/users/me');
      let latestReportResult;
      try {
        latestReportResult = await fetchData('/api/data-analysis/reports/latest');
      } catch (err) {
        if (err.status === 404) {
          latestReportResult = {
            report: {
              isNewUser: true,
              analysis_date: new Date().toISOString(),
              shared_data_summary: { found: 0, details: ['No scan performed yet.'] }
            }
          };
        } else { throw err; }
      }
      setDashboardData({
        user: userProfileResult.user,
        user_profile: userProfileResult.user_profile,
        report: latestReportResult.report,
      });
    } catch (err) { 
      // error is already set by fetchData
    }
  };

  const handleInitiateScan = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchData('/api/data-analysis/scan', { method: 'POST', body: { scan_scope: 'full' } });
      alert(result.message + ' Your new report will be available in a moment. The dashboard will refresh automatically.');
      setTimeout(() => {
        refreshDashboard();
      }, 1000);
    } catch (err) {
      setError(err.message || "Failed to start scan.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewChecklist = async (checklistId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchData(`/api/checklists/${checklistId}`);
      setSelectedChecklist(result.checklist);
      setCurrentPage('checklistDetail');
    } catch (err) {
      // error is set by fetchData
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateChecklistItemStatus = async (checklistId, itemId, status) => {
    try {
      const result = await fetchData(`/api/checklists/${checklistId}/items/${itemId}/status`, { method: 'PATCH', body: { status } });
      setSelectedChecklist(prev => ({
        ...prev,
        items: prev.items.map(item =>
          item.id === itemId ? { ...item, status: result.item.status, last_updated: result.item.last_updated } : item
        ),
      }));
    } catch (err) {
      // error is set by fetchData
    }
  };

  useEffect(() => {
    if (!authToken || currentPage === 'checklistDetail') return;
    const fetchPageData = async () => {
      setLoading(true);
      setError(null);
      try {
        switch (currentPage) {
          case 'dashboard':
            await refreshDashboard();
            break;
          case 'alerts':
            const alertsResult = await fetchData('/api/alerts');
            setAlerts(alertsResult.alerts || []);
            break;
          case 'checklists':
            setSelectedChecklist(null);
            const checklistsResult = await fetchData('/api/checklists');
            setChecklists(checklistsResult.checklists || []);
            break;
          default:
            break;
        }
      } catch (err) {
        // error is already set by fetchData
      } finally {
        setLoading(false);
      }
    };
    fetchPageData();
  }, [currentPage, authToken]);

  if (!authToken) {
    return (
      <Auth
        authMode={authMode}
        setAuthMode={setAuthMode}
        loginForm={loginForm}
        setLoginForm={setLoginForm}
        handleLogin={handleLogin}
        registerForm={registerForm}
        setRegisterForm={setRegisterForm}
        handleRegister={handleRegister}
        loading={loading}
        error={error}
      />
    );
  }

  const renderPage = () => {
    if (loading && !dashboardData) {
      return (
        <div className="flex justify-center items-center p-20">
          <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      );
    }
    if (error && (currentPage === 'dashboard' && !dashboardData)) {
        return <div className="text-center p-8 text-xl text-red-500">Error: {error}</div>;
    }

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard dashboardData={dashboardData} handleInitiateScan={handleInitiateScan} loading={loading} />;
      case 'alerts':
        return <AlertsList alerts={alerts} />;
      case 'checklists':
      case 'checklistDetail':
        return <Checklists
            checklists={checklists}
            selectedChecklist={selectedChecklist}
            handleViewChecklist={handleViewChecklist}
            handleUpdateChecklistItemStatus={handleUpdateChecklistItemStatus}
            setCurrentPage={setCurrentPage}
            setSelectedChecklist={setSelectedChecklist}
        />;
      default:
        return <Dashboard dashboardData={dashboardData} handleInitiateScan={handleInitiateScan} loading={loading} />;
    }
  };

  return (
    <Layout
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      handleLogout={handleLogout}
    >
      {renderPage()}
    </Layout>
  );
}