import { Router } from 'express';
import { callAliExpress } from '../services/aliexpress.js';
import { config } from '../config.js';

function handleAliExpressError(res, err, fallbackMessage) {
  const status = err?.response?.status && Number.isInteger(err.response.status) ? err.response.status : 500;
  const details = err?.response?.data || err.message;
  console.error('[AliExpress]', details);
  return res.status(status).json({ error: fallbackMessage, details });
}

const router = Router();

router.post('/auth/token/security/create', async (req, res) => {
  try {
    const { code, uuid } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'code is required' });
    }
    if (!config.ae.appKey || !config.ae.appSecret) {
      return res.status(500).json({ error: 'AliExpress credentials not configured' });
    }
    const data = await callAliExpress(
      '/auth/token/security/create',
      {
        code,
        uuid,
        client_id: config.ae.appKey,
        client_secret: config.ae.appSecret
      },
      { method: 'POST' }
    );
    res.json(data);
  } catch (err) {
    handleAliExpressError(res, err, 'aliexpress auth failed');
  }
});

router.post('/affiliate/link/generate', async (req, res) => {
  try {
    const {
      ship_to_country = 'FR',
      app_signature,
      promotion_link_type = 0,
      source_values,
      tracking_id
    } = req.body;

    if (!source_values) {
      return res.status(400).json({ error: 'source_values is required' });
    }

    const data = await callAliExpress('aliexpress.affiliate.link.generate', {
      ship_to_country,
      app_signature,
      promotion_link_type,
      source_values,
      tracking_id: tracking_id || config.ae.trackingId
    });

    res.json(data);
  } catch (err) {
    handleAliExpressError(res, err, 'link.generate failed');
  }
});

router.post('/affiliate/product/smartmatch', async (req, res) => {
  try {
    const {
      page_no = 1,
      product_id,
      site,
      target_currency = 'EUR',
      target_language = 'FR',
      tracking_id,
      device_id = 'kvnbbg-device',
      fields,
      keywords,
      country = 'FR'
    } = req.body;

    const data = await callAliExpress('aliexpress.affiliate.product.smartmatch', {
      page_no,
      product_id,
      site,
      target_currency,
      target_language,
      tracking_id: tracking_id || config.ae.trackingId,
      device_id,
      fields,
      keywords,
      country
    });

    res.json(data);
  } catch (err) {
    handleAliExpressError(res, err, 'smartmatch failed');
  }
});

router.post('/affiliate/featuredpromo/products', async (req, res) => {
  try {
    const {
      page_no = 1,
      page_size = 50,
      sort = 'commissionDesc',
      target_currency = 'EUR',
      target_language = 'FR',
      tracking_id,
      country = 'FR',
      category_id,
      promotion_name
    } = req.body;

    const data = await callAliExpress('aliexpress.affiliate.featuredpromo.products.get', {
      page_no,
      page_size,
      sort,
      target_currency,
      target_language,
      tracking_id: tracking_id || config.ae.trackingId,
      country,
      category_id,
      promotion_name
    });

    res.json(data);
  } catch (err) {
    handleAliExpressError(res, err, 'featuredpromo.products failed');
  }
});

export default router;
