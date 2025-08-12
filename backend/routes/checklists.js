const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

const checklistsStore = {};

function ensureDemoData(userId) {
  checklistsStore[userId] = checklistsStore[userId] ||= [];
  if (!checklistsStore[userId].length) {
    const checklistId = uuidv4();
    const items = [
      { id: uuidv4(), description: 'Review app permissions', status: 'pending', last_updated: new Date().toISOString() },
      { id: uuidv4(), description: 'Remove old apps', status: 'completed', last_updated: new Date().toISOString() }
    ];
    checklistsStore[userId].push({ id: checklistId, title: 'Privacy basics', items });
  }
}

router.get('/:id', authenticate, (req, res) => {
  const userId = req.user.id;
  const id = req.params.id;
  ensureDemoData(userId);
  const checklist = checklistsStore[userId].find(c => c.id === id);
  if (!checklist) return res.status(404).json({ error: 'Checklist not found.' });
  return res.status(200).json({ checklist });
});

router.patch('/:checklist_id/items/:item_id/status', authenticate, (req, res) => {
  const userId = req.user.id;
  const { status } = req.body || {};
  if (!status) return res.status(400).json({ error: 'Invalid input.' });

  ensureDemoData(userId);
  const checklist = checklistsStore[userId].find(c => c.id === req.params.checklist_id);
  if (!checklist) return res.status(404).json({ error: 'Checklist not found.' });

  const item = checklist.items.find(it => it.id === req.params.item_id);
  if (!item) return res.status(404).json({ error: 'Item not found.' });

  const allowed = ['pending', 'completed', 'in_progress'];
  if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status.' });

  item.status = status;
  item.last_updated = new Date().toISOString();
  return res.status(200).json({ message: 'Checklist item status updated successfully.', item: { id: item.id, status: item.status, last_updated: item.last_updated } });
});

module.exports = router;