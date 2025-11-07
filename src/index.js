import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { config } from './config.js';

import appRoutes from './routes/app.js';
import announcementRoutes from './routes/announcement.js';
import docsRoutes from './routes/docs.js';
import aeRoutes from './routes/ae.js';
import supportRoutes from './routes/support.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({
    name: 'kvnbbg.fr API',
    version: '0.1.0',
    status: 'ok',
    sections: [
      '/app-console',
      '/announcement',
      '/docs',
      '/api/ae/*',
      '/support/*'
    ]
  });
});

app.use('/app-console', appRoutes);
app.use('/announcement', announcementRoutes);
app.use('/docs', docsRoutes);
app.use('/api/ae', aeRoutes);
app.use('/support', supportRoutes);

app.listen(config.port, () => {
  console.log(`kvnbbg.fr API running on http://0.0.0.0:${config.port}`);
});
