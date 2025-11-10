import axios from 'axios';
import crypto from 'crypto';
import qs from 'qs';
import { config, ensureAliExpressCredentials } from '../config.js';

const client = axios.create({
  baseURL: config.ae.baseUrl,
  timeout: 10000
});

const DEFAULT_TOP_PARAMS = {
  format: 'json',
  sign_method: 'hmac',
  simplify: 'true',
  v: '2.0'
};

const beijingFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Shanghai',
  hour12: false,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
});

function toAliTimestamp(date = new Date()) {
  const parts = beijingFormatter.formatToParts(date).reduce((acc, part) => {
    if (part.type !== 'literal') {
      acc[part.type] = part.value;
    }
    return acc;
  }, {});

  return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second}`;
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
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
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
      'Content-Type': 'application/json',
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
