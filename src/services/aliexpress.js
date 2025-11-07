import axios from 'axios';
import { config } from '../config.js';

const client = axios.create({
  baseURL: config.ae.baseUrl,
  timeout: 8000
});

function buildParams(params = {}) {
  return {
    ...params
  };
}

export async function callAliExpress(path, params = {}) {
  const payload = buildParams(params);
  const { data } = await client.post(path, payload);
  return data;
}
