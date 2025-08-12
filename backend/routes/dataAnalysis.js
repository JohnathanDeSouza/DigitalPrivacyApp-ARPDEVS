const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

const scans = {};
const reports = [];

router.post('/scan', authenticate, (req, res) => {
  const userId = req.user.id;
  const { scan_scope } = req.body || {};
  if (!scan_scope) return res.status(400).json({ error: 'Invalid input.' });

  scans[userId] = scans[userId] || { inProgress: false, lastReportId: null };
  if (scans[userId].inProgress) return res.status(429).json({ error: 'Scan already in progress.' });

  scans[userId].inProgress = true;
  const scanId = uuidv4();

  setTimeout(() => {
    const report = {
      id: uuidv4(),
      user_id: userId,
      analysis_date: new Date().toISOString(),
      shared_data_summary: { found: 3, details: ['email', 'username', 'phone (none)'] },
      scan_scope: scan_scope
    };
    reports.push(report);
    scans[userId].inProgress = false;
    scans[userId].lastReportId = report.id;
  }, 500);

  return res.status(202).json({ message: 'Data analysis scan initiated.', scan_id: scanId });
});

router.get('/reports/latest', authenticate, (req, res) => {
  const userId = req.user.id;
  const userReports = reports.filter(r => r.user_id === userId);
  if (!userReports.length) return res.status(404).json({ error: 'No reports found.' });

  userReports.sort((a, b) => new Date(b.analysis_date) - new Date(a.analysis_date));
  return res.status(200).json({ report: userReports[0] });
});

module.exports = router;