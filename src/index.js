import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { config } from './config.js';

import appRoutes from './routes/app.js';
import announcementRoutes from './routes/announcement.js';
import docsRoutes from './routes/docs.js';
import aeRoutes from './routes/ae.js';
import supportRoutes from './routes/support.js';
import { renderLandingPage } from './services/ui.js';

const CONSTANTS = {
  jsonBodyLimit: '1mb',
  landing: {
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
  }
};

const logger = {
  info(message, meta = {}) {
    const entry = {
      level: 'info',
      message,
      ...meta,
      timestamp: new Date().toISOString()
    };
    process.stdout.write(`${JSON.stringify(entry)}\n`);
  },
  error(message, meta = {}) {
    const entry = {
      level: 'error',
      message,
      ...meta,
      timestamp: new Date().toISOString()
    };
    process.stderr.write(`${JSON.stringify(entry)}\n`);
  }
};

const app = express();

app.use(cors());
app.use(express.json({ limit: CONSTANTS.jsonBodyLimit }));
app.use(morgan('dev'));

/**
 * Respond with the landing payload as JSON or HTML.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const handleRootRequest = (req, res) => {
  const payload = { ...CONSTANTS.landing };

  if (req.accepts(['html', 'json']) === 'html') {
    res.type('html').send(renderLandingPage(payload));
    return;
  }

  res.json(payload);
};

app.get('/', handleRootRequest);

app.use('/app-console', appRoutes);
app.use('/announcement', announcementRoutes);
app.use('/docs', docsRoutes);
app.use('/api/ae', aeRoutes);
app.use('/support', supportRoutes);

const isVercelRuntime = process.env.VERCEL === '1';

if (!isVercelRuntime) {
  app.listen(config.port, () => {
    logger.info('kvnbbg.fr API running', {
      host: '0.0.0.0',
      port: config.port
    });
  });
}

export default app;
