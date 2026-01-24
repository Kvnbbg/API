import { Router } from 'express';
import { callAliExpress } from '../services/aliexpress.js';
import { config } from '../config.js';

const CONSTANTS = {
  defaults: {
    shipToCountry: 'FR',
    promotionLinkType: 0,
    pageNo: 1,
    pageSize: 50,
    sort: 'commissionDesc',
    targetCurrency: 'EUR',
    targetLanguage: 'FR',
    deviceId: 'kvnbbg-device',
    country: 'FR'
  },
  errors: {
    authFailed: 'aliexpress auth failed',
    linkGenerateFailed: 'link.generate failed',
    smartmatchFailed: 'smartmatch failed',
    featuredPromoFailed: 'featuredpromo.products failed'
  }
};

const logger = {
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

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

function handleAliExpressError(res, err, fallbackMessage) {
  const status = err?.response?.status && Number.isInteger(err.response.status) ? err.response.status : 500;
  const errorMessage = err?.message || 'Unknown error';
  logger.error('AliExpress request failed', {
    status,
    errorMessage,
    path: err?.config?.url
  });
  return res.status(status).json({ error: fallbackMessage });
}

const router = Router();

router.post('/auth/token/security/create', async (req, res) => {
  try {
    const { code, uuid } = req.body;
    if (!isNonEmptyString(code)) {
      return res.status(400).json({ error: 'code is required' });
    }
    if (uuid !== undefined && !isNonEmptyString(uuid)) {
      return res.status(400).json({ error: 'uuid must be a non-empty string' });
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
    handleAliExpressError(res, err, CONSTANTS.errors.authFailed);
  }
});

router.post('/affiliate/link/generate', async (req, res) => {
  try {
    const {
      ship_to_country = CONSTANTS.defaults.shipToCountry,
      app_signature,
      promotion_link_type = CONSTANTS.defaults.promotionLinkType,
      source_values,
      tracking_id
    } = req.body;

    if (!isNonEmptyString(source_values)) {
      return res.status(400).json({ error: 'source_values is required' });
    }
    if (app_signature !== undefined && !isNonEmptyString(app_signature)) {
      return res.status(400).json({ error: 'app_signature must be a non-empty string' });
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
    handleAliExpressError(res, err, CONSTANTS.errors.linkGenerateFailed);
  }
});

router.post('/affiliate/product/smartmatch', async (req, res) => {
  try {
    const {
      page_no = CONSTANTS.defaults.pageNo,
      product_id,
      site,
      target_currency = CONSTANTS.defaults.targetCurrency,
      target_language = CONSTANTS.defaults.targetLanguage,
      tracking_id,
      device_id = CONSTANTS.defaults.deviceId,
      fields,
      keywords,
      country = CONSTANTS.defaults.country
    } = req.body;

    if (!isNonEmptyString(product_id) && !isNonEmptyString(keywords)) {
      return res.status(400).json({ error: 'product_id or keywords is required' });
    }

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
    handleAliExpressError(res, err, CONSTANTS.errors.smartmatchFailed);
  }
});

router.post('/affiliate/featuredpromo/products', async (req, res) => {
  try {
    const {
      page_no = CONSTANTS.defaults.pageNo,
      page_size = CONSTANTS.defaults.pageSize,
      sort = CONSTANTS.defaults.sort,
      target_currency = CONSTANTS.defaults.targetCurrency,
      target_language = CONSTANTS.defaults.targetLanguage,
      tracking_id,
      country = CONSTANTS.defaults.country,
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
    handleAliExpressError(res, err, CONSTANTS.errors.featuredPromoFailed);
  }
});

export default router;
