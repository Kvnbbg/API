import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    title: 'Announcements',
    items: [
      {
        id: '2024-01',
        message: 'Bienvenue sur la nouvelle API kvnbbg.fr',
        published_at: '2024-01-01T00:00:00Z'
      }
    ],
    contact: 'contact@techandstream.com'
  });
});

export default router;
