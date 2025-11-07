import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    title: 'App Console',
    owner: 'kvnbbg.fr',
    contact: 'contact@techandstream.com',
    links: {
      docs: '/docs',
      announcement: '/announcement',
      tickets: '/support/ticket'
    }
  });
});

export default router;
