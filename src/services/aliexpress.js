import axios from 'axios';
import crypto from 'crypto';
import qs from 'qs';
import { config, ensureAliExpressCredentials } from '../config.js';

const CONSTANTS = {
  timeoutMs: 10000,
  contentType: {
    json: 'application/json',
    form: 'application/x-www-form-urlencoded;charset=utf-8'
  }
};

const client = axios.create({
  baseURL: config.ae.baseUrl,
  timeout: CONSTANTS.timeoutMs
});

const DEFAULT_TOP_PARAMS = {
  format: 'json',
  sign_method: 'hmac',
  simplify: 'true',
  v: '2.0'
};

function toAliTimestamp(date = new Date()) {
  return date.toISOString().replace('T', ' ').replace(/\.\d+Z$/, '');
}

function normalizeBusinessPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    return {};
  }

  const sanitized = {};
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined) return;
    if (value === null) return;
    if (typeof value === 'string' && value.trim() === '') return;
    sanitized[key] = value;
  });
  return sanitized;
}

function signTopRequest(params) {
  const filteredEntries = Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== '');
  const sortedKeys = filteredEntries
    .map(([key]) => key)
    .sort();

  const signSource = sortedKeys.reduce((acc, key) => acc + key + String(params[key]), '');

  return crypto.createHmac('md5', config.ae.appSecret).update(signSource).digest('hex').toUpperCase();
}

async function callTopApi(method, businessParams = {}) {
  ensureAliExpressCredentials();

  const payload = {
    ...DEFAULT_TOP_PARAMS,
    method,
    app_key: config.ae.appKey,
    timestamp: toAliTimestamp(),
    param_json: JSON.stringify(normalizeBusinessPayload(businessParams))
  };

  if (config.ae.accessToken) {
    payload.session = config.ae.accessToken;
  }

  payload.sign = signTopRequest(payload);

  const response = await client.post(
    config.ae.routerPath,
    qs.stringify(payload),
    {
      headers: {
        'Content-Type': CONSTANTS.contentType.form
      }
    }
  );

  return response.data;
}

async function callRestPath(path, data = {}, options = {}) {
  const method = (options.method || 'POST').toUpperCase();

  const normalized = normalizeBusinessPayload(data);

  const response = await client.request({
    url: path,
    method,
    data: method === 'GET' ? undefined : normalized,
    params: method === 'GET' ? normalized : undefined,
    headers: {
      'Content-Type': CONSTANTS.contentType.json,
      ...options.headers
    }
  });

  return response.data;
}

export async function callAliExpress(target, params = {}, options = {}) {
  if (!target) {
    throw new Error('AliExpress target (method or path) is required');
  }

  if (target.startsWith('/')) {
    return callRestPath(target, params, options);
  }

  return callTopApi(target, params);
}
