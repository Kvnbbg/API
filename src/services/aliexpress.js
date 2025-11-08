import axios from 'axios';
import crypto from 'node:crypto';
import { config } from '../config.js';

const client = axios.create({
  baseURL: config.ae.baseUrl,
  timeout: 8000
});

const ALIEXPRESS_ROUTER_PATH = '/router/rest';

function formatTimestamp(date = new Date()) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function normalizeParams(path, params = {}) {
  const baseParams = {
    app_key: config.ae.appKey,
    format: 'json',
    sign_method: 'md5',
    timestamp: formatTimestamp(),
    v: '2.0'
  };

  if (!path.startsWith('/')) {
    baseParams.method = path;
  }

  const merged = {
    ...baseParams,
    ...params
  };

  return Object.entries(merged).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      acc[key] = value;
    }
    return acc;
  }, {});
}

function signParams(params) {
  const sortedKeys = Object.keys(params).sort();
  const signBase = sortedKeys.reduce((acc, key) => acc + key + params[key], '');
  const stringToSign = `${config.ae.appSecret}${signBase}${config.ae.appSecret}`;
  return crypto.createHash('md5').update(stringToSign, 'utf8').digest('hex').toUpperCase();
}

function buildParams(path, params = {}) {
  const normalized = normalizeParams(path, params);
  const sign = signParams(normalized);
  return {
    ...normalized,
    sign
  };
}

export async function callAliExpress(path, params = {}) {
  const payload = buildParams(path, params);
  const requestPath = path.startsWith('/') ? path : ALIEXPRESS_ROUTER_PATH;
  const { data } = await client.post(requestPath, payload);
  return data;
}
