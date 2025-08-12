const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { usersStore, userProfilesStore } = require('./auth');

router.get('/me', authenticate, (req, res) => {
  const userId = req.user.id;
  const user = usersStore.find(u => u.id === userId);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const profile = userProfilesStore[userId] || null;
  return res.status(200).json({ user: { id: user.id, username: user.username, email: user.email }, user_profile: profile });
});

router.patch('/me', authenticate, (req, res) => {
  const userId = req.user.id;
  const { username, privacy_preferences } = req.body || {};

  const user = usersStore.find(u => u.id === userId);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  if (username) {
    const taken = usersStore.find(u => u.username === username && u.id !== userId);
    if (taken) return res.status(409).json({ error: 'Username already in use.' });
    user.username = username;
  }

  const profile = userProfilesStore[userId] ||= { privacy_score: 75, privacy_preferences: { receive_alerts: true, personalized_tips_enabled: true } };
  if (privacy_preferences && typeof privacy_preferences.receive_alerts === 'boolean') {
    profile.privacy_preferences.receive_alerts = privacy_preferences.receive_alerts;
  }

  return res.status(200).json({ message: 'User profile updated successfully.', user_profile: { privacy_preferences: profile.privacy_preferences } });
});

module.exports = router;