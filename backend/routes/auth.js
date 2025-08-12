const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const { SECRET } = require('../middleware/auth');

const users = [];
const userProfiles = {};

router.post('/register', (req, res) => {
  const { username, email, password } = req.body || {};
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Invalid input.' });
  }

  const exists = users.find(u => u.username === username || u.email === email);
  if (exists) {
    return res.status(409).json({ error: 'User already exists.' });
  }

  const id = uuidv4();
  const user = { id, username, email, password };
  users.push(user);

  userProfiles[id] = {
    privacy_score: 75,
    privacy_preferences: {
      receive_alerts: true,
      personalized_tips_enabled: true
    }
  };

  const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, SECRET, { expiresIn: '7d' });

  return res.status(201).json({ message: 'User registered successfully.', user: { id: user.id, username, email }, access_token: token });
});

router.post('/login', (req, res) => {
  const { identifier, password } = req.body || {};
  if (!identifier || !password) return res.status(400).json({ error: 'Invalid input.' });

  const user = users.find(u => u.username === identifier || u.email === identifier);
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Authentication failed.' });
  }

  const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, SECRET, { expiresIn: '7d' });
  return res.status(200).json({ message: 'Login successful.', access_token: token });
});

module.exports = router;
module.exports.usersStore = users;
module.exports.userProfilesStore = userProfiles;