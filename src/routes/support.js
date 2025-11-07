import { Router } from 'express';

const router = Router();

router.post('/ticket', (req, res) => {
  const { email, subject, message } = req.body;
  if (!email || !subject) {
    return res.status(400).json({ error: 'email and subject required' });
  }

  res.json({
    status: 'received',
    to: 'contact@techandstream.com',
    payload: { email, subject, message }
  });
});

router.post('/punish', (req, res) => {
  const { target, reason } = req.body;
  if (!target) return res.status(400).json({ error: 'target required' });

  res.json({
    status: 'punish-scheduled',
    target,
    reason: reason || 'abuse'
  });
});

export default router;
