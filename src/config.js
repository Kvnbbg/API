import 'dotenv/config';

export const config = {
  port: process.env.PORT || 3000,
  ae: {
    baseUrl: process.env.ALIEXPRESS_BASE_URL,
    appKey: process.env.ALIEXPRESS_APP_KEY,
    appSecret: process.env.ALIEXPRESS_APP_SECRET,
    trackingId: process.env.ALIEXPRESS_TRACKING_ID || 'default'
  }
};
