const path = require('path');
const { test, expect } = require('@playwright/test');
const { launchContextWithExtension } = require('./helpers/extension');

test.describe('Background messaging', () => {
  let context;
  let extensionId;
  let page;

  test.beforeAll(async () => {
    const root = path.resolve(__dirname, '../../');
    const launched = await launchContextWithExtension(root);
    context = launched.context;
    extensionId = launched.extensionId;
    page = await context.newPage();
  });

  test.afterAll(async () => {
    await context.close();
  });

  test('responds to testConfig message', async () => {
    await page.goto(`chrome-extension://${extensionId}/page/options.html`);
    const result = await page.evaluate(() => new Promise(resolve => {
      chrome.runtime.sendMessage({ action: 'testConfig' }, res => resolve(res));
    }));
    expect(result).toBeTruthy();
    expect(result.success).toBe(true);
    expect(result.configKeys).toContain('git');
    expect(result.configKeys).toContain('npm');
  });

  test('handles refreshConfig message', async () => {
    await page.goto(`chrome-extension://${extensionId}/page/options.html`);
    const result = await page.evaluate(() => new Promise(resolve => {
      chrome.runtime.sendMessage({ action: 'refreshConfig' }, res => resolve(res));
    }));
    // Background returns { success: true } for refreshConfig
    expect(result).toBeTruthy();
    expect(result.success).toBe(true);
  });
});


