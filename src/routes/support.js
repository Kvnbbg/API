import { Router } from 'express';

const router = Router();

const CONSTANTS = {
  maxLength: {
    email: 254,
    subject: 140,
    message: 2000,
    target: 120,
    reason: 280
  },
  defaultReason: 'abuse'
};

const toTrimmedString = (value) => (typeof value === 'string' ? value.trim() : '');
const isNonEmptyString = (value) => value.length > 0;

router.post('/ticket', (req, res) => {
  const email = toTrimmedString(req.body?.email);
  const subject = toTrimmedString(req.body?.subject);
  const message = toTrimmedString(req.body?.message);

  if (!isNonEmptyString(email) || !isNonEmptyString(subject)) {
    return res.status(400).json({ error: 'email and subject required' });
  }
  if (email.length > CONSTANTS.maxLength.email || subject.length > CONSTANTS.maxLength.subject) {
    return res.status(400).json({ error: 'email or subject too long' });
  }
  if (message.length > CONSTANTS.maxLength.message) {
    return res.status(400).json({ error: 'message too long' });
  }

  res.json({
    status: 'received',
    to: 'contact@techandstream.com',
    payload: { email, subject, message }
  });
});

router.post('/punish', (req, res) => {
  const target = toTrimmedString(req.body?.target);
  const reason = toTrimmedString(req.body?.reason) || CONSTANTS.defaultReason;

  if (!isNonEmptyString(target)) {
    return res.status(400).json({ error: 'target required' });
  }
  if (target.length > CONSTANTS.maxLength.target || reason.length > CONSTANTS.maxLength.reason) {
    return res.status(400).json({ error: 'target or reason too long' });
  }

  res.json({
    status: 'punish-scheduled',
    target,
    reason
  });
});

export default router;
