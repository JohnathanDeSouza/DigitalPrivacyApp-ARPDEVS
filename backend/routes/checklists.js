const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

const checklistsStore = {};

// Helper function to create some demo data for a user if they don't have any
function ensureDemoData(userId) {
  if (!checklistsStore[userId] || checklistsStore[userId].length === 0) {
    const checklist1Id = uuidv4();
    const checklist2Id = uuidv4();
    checklistsStore[userId] = [
      {
        id: checklist1Id,
        title: 'Social Media Privacy',
        items: [
          { id: uuidv4(), description: 'Review your Facebook privacy settings', status: 'pending', last_updated: new Date().toISOString() },
          { id: uuidv4(), description: 'Set your Instagram account to private', status: 'completed', last_updated: new Date().toISOString() },
          { id: uuidv4(), description: 'Limit ad tracking on X (Twitter)', status: 'in_progress', last_updated: new Date().toISOString() },
        ]
      },
      {
        id: checklist2Id,
        title: 'Device Security',
        items: [
          { id: uuidv4(), description: 'Enable two-factor authentication for your accounts', status: 'pending', last_updated: new Date().toISOString() },
          { id: uuidv4(), description: 'Update your operating system', status: 'pending', last_updated: new Date().toISOString() },
        ]
      }
    ];
  }
}

// NEW: Route to get all checklists for the authenticated user
router.get('/', authenticate, (req, res) => {
  const userId = req.user.id;
  ensureDemoData(userId);
  
  // We return a summary of checklists, not all the items
  const checklistSummaries = checklistsStore[userId].map(c => ({
    id: c.id,
    title: c.title
  }));

  return res.status(200).json({ checklists: checklistSummaries });
});

// Route to get a specific checklist by its ID
router.get('/:id', authenticate, (req, res) => {
  const userId = req.user.id;
  const id = req.params.id;
  ensureDemoData(userId);
  const checklist = checklistsStore[userId].find(c => c.id === id);
  if (!checklist) {
    return res.status(404).json({ error: 'Checklist not found.' });
  }
  return res.status(200).json({ checklist });
});

// Route to update the status of a checklist item
router.patch('/:checklist_id/items/:item_id/status', authenticate, (req, res) => {
  const userId = req.user.id;
  const { status } = req.body || {};
  if (!status) {
    return res.status(400).json({ error: 'Invalid input.' });
  }

  ensureDemoData(userId);
  const checklist = checklistsStore[userId].find(c => c.id === req.params.checklist_id);
  if (!checklist) {
    return res.status(404).json({ error: 'Checklist not found.' });
  }

  const item = checklist.items.find(it => it.id === req.params.item_id);
  if (!item) {
    return res.status(404).json({ error: 'Item not found.' });
  }

  const allowed = ['pending', 'completed', 'in_progress'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ error: 'Invalid status.' });
  }

  item.status = status;
  item.last_updated = new Date().toISOString();
  return res.status(200).json({
    message: 'Checklist item status updated successfully.',
    item: { id: item.id, status: item.status, last_updated: item.last_updated }
  });
});

module.exports = router;