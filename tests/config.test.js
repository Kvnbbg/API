import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';

const ORIGINAL_ENV = Object.freeze({ ...process.env });

async function loadConfigModule() {
  const uniqueSpecifier = `../src/config.js?test=${randomUUID()}`;
  return import(uniqueSpecifier);
}

test('config uses default AliExpress endpoints when env vars are absent', async (t) => {
  process.env = { ...ORIGINAL_ENV };
  delete process.env.ALIEXPRESS_BASE_URL;
  delete process.env.ALIEXPRESS_ROUTER_PATH;
  delete process.env.ALIEXPRESS_TRACKING_ID;

  t.after(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  const { config } = await loadConfigModule();

  assert.equal(config.ae.baseUrl, 'https://api-sg.aliexpress.com');
  assert.equal(config.ae.routerPath, '/router/rest');
  assert.equal(config.ae.trackingId, 'default');
});

test('ensureAliExpressCredentials throws when credentials are missing', async (t) => {
  process.env = { ...ORIGINAL_ENV };
  delete process.env.ALIEXPRESS_APP_KEY;
  delete process.env.ALIEXPRESS_APP_SECRET;

  t.after(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  const { ensureAliExpressCredentials } = await loadConfigModule();
  assert.throws(() => ensureAliExpressCredentials(), /AliExpress credentials/);
});

test('ensureAliExpressCredentials does not throw when credentials are present', async (t) => {
  process.env = {
    ...ORIGINAL_ENV,
    ALIEXPRESS_APP_KEY: 'demo-key',
    ALIEXPRESS_APP_SECRET: 'demo-secret'
  };

  t.after(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  const { ensureAliExpressCredentials } = await loadConfigModule();
  assert.doesNotThrow(() => ensureAliExpressCredentials());
});
