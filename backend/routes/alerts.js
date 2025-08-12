const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');

const alertsStore = {};

router.get('/', authenticate, (req, res) => {
  const userId = req.user.id;
  alertsStore[userId] = alertsStore[userId] ||= [];

  if (!alertsStore[userId].length) {
    for (let i = 1; i <= 3; i++) {
      alertsStore[userId].push({ id: `${userId}-a${i}`, title: `Privacy alert ${i}`, severity: i === 1 ? 'high' : 'medium' });
    }
  }

  const limit = parseInt(req.query.limit || '10');
  const offset = parseInt(req.query.offset || '0');
  const items = alertsStore[userId].slice(offset, offset + limit);
  return res.status(200).json({ alerts: items, pagination: { total_items: alertsStore[userId].length, limit, offset } });
});

module.exports = router;