const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Enable CORS for all requests to allow the frontend to connect
app.use(cors());

// Use express.json() to parse incoming JSON payloads
app.use(express.json());

// === Mock Data to Simulate a Database ===
// This data matches the structure of the API contract for read-only access.
const dashboardData = {
    privacy_score: 75,
    last_analysis_date: new Date().toISOString(),
    active_alerts_count: 3,
    pending_checklist_items_count: 7
};

const alertsData = {
    alerts: [
        { id: 'alert_1', title: 'Location Access Enabled', severity: 'high' },
        { id: 'alert_2', title: 'Old Password Found', severity: 'medium' },
        { id: 'alert_3', title: 'Unused App Permissions', severity: 'low' },
    ],
    pagination: { total_items: 3 }
};

const checklistsData = {
    checklists: [
        { id: 'chk_1', title: 'Secure Your Email Account' },
        { id: 'chk_2', title: 'Clean Up Social Media' },
        { id: 'chk_3', title: 'Improve Password Hygiene' },
    ]
};

// === API Endpoints ===

// GET endpoint for dashboard summary data
app.get('/api/dashboard/summary', (req, res) => {
    console.log('GET /api/dashboard/summary requested');
    // Simulate a slight delay to mimic network latency
    setTimeout(() => {
        res.json(dashboardData);
    }, 500);
});

// GET endpoint for alerts data
app.get('/api/alerts', (req, res) => {
    console.log('GET /api/alerts requested');
    setTimeout(() => {
        res.json(alertsData);
    }, 500);
});

// GET endpoint for checklists data
app.get('/api/checklists', (req, res) => {
    console.log('GET /api/checklists requested');
    setTimeout(() => {
        res.json(checklistsData);
    }, 500);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Node.js backend server running on http://localhost:${PORT}`);
});
