import crypto from 'crypto';
import axios from 'axios';
import { config } from '../config.js';

const client = axios.create({
  baseURL: config.ae.baseUrl,
  timeout: 8000
});

function normalizeParams(params = {}) {
  const normalized = {};
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') {
      continue;
    }
    normalized[key] = typeof value === 'object' ? JSON.stringify(value) : value;
  }
  return normalized;
}

function signParams(params) {
  const entries = Object.entries(params).sort(([a], [b]) => a.localeCompare(b));
  const canonical = entries.map(([key, value]) => `${key}${value}`).join('');
  return crypto
    .createHash('md5')
    .update(`${config.ae.appSecret}${canonical}${config.ae.appSecret}`)
    .digest('hex')
    .toUpperCase();
}

function buildParams(params = {}) {
  const baseParams = {
    app_key: config.ae.appKey,
    sign_method: 'md5',
    ...params
  };

  const normalized = normalizeParams(baseParams);
  const sign = signParams(normalized);

  return {
    ...normalized,
    sign
  };
}

export async function callAliExpress(path, params = {}) {
  if (!config.ae.appKey || !config.ae.appSecret) {
    throw new Error('AliExpress credentials are not configured');
  }
  const payload = buildParams(params);
  const { data } = await client.post(path, payload);
  return data;
}
