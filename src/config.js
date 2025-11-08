import 'dotenv/config';

const DEFAULT_AE_BASE_URL = 'https://api-sg.aliexpress.com';
const DEFAULT_ROUTER_PATH = '/router/rest';

function normalize(value) {
  return typeof value === 'string' && value.trim().length === 0 ? undefined : value;
}

export const config = {
  port: Number.parseInt(process.env.PORT, 10) || 3000,
  ae: {
    baseUrl: normalize(process.env.ALIEXPRESS_BASE_URL) || DEFAULT_AE_BASE_URL,
    routerPath: normalize(process.env.ALIEXPRESS_ROUTER_PATH) || DEFAULT_ROUTER_PATH,
    appKey: normalize(process.env.ALIEXPRESS_APP_KEY),
    appSecret: normalize(process.env.ALIEXPRESS_APP_SECRET),
    accessToken: normalize(process.env.ALIEXPRESS_ACCESS_TOKEN),
    trackingId: normalize(process.env.ALIEXPRESS_TRACKING_ID) || 'default'
  }
};

export function ensureAliExpressCredentials() {
  if (!config.ae.appKey || !config.ae.appSecret) {
    throw new Error('AliExpress credentials (ALIEXPRESS_APP_KEY and ALIEXPRESS_APP_SECRET) are required');
  }
}
