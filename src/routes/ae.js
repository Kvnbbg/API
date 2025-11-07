import { Router } from 'express';
import { callAliExpress } from '../services/aliexpress.js';
import { config } from '../config.js';

const router = Router();

router.post('/auth/token/security/create', async (req, res) => {
  try {
    const { code, uuid } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'code is required' });
    }
    const data = await callAliExpress('/auth/token/security/create', {
      code,
      uuid
    });
    res.json(data);
  } catch (err) {
    console.error(err?.response?.data || err.message);
    res.status(500).json({ error: 'aliexpress auth failed' });
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
    console.error(err?.response?.data || err.message);
    res.status(500).json({ error: 'link.generate failed' });
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
    console.error(err?.response?.data || err.message);
    res.status(500).json({ error: 'smartmatch failed' });
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
    console.error(err?.response?.data || err.message);
    res.status(500).json({ error: 'featuredpromo.products failed' });
  }
});

export default router;
