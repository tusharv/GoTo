const path = require('path');
const { test, expect } = require('@playwright/test');
const { launchContextWithExtension } = require('./helpers/extension');

test.describe('Options page', () => {
  let context;
  let extensionId;
  let page;

  test.beforeAll(async () => {
    const root = path.resolve(__dirname, '../../');
    const launched = await launchContextWithExtension(root);
    context = launched.context;
    extensionId = launched.extensionId;
    page = await context.newPage();

    // Auto-accept any confirm dialogs used by options page
    await page.addInitScript(() => {
      window.confirm = () => true;
    });
  });

  test.afterAll(async () => {
    await context.close();
  });

  test('add and display a custom keyword', async () => {
    await page.goto(`chrome-extension://${extensionId}/page/options.html`);

    await page.locator('#new-keyword-input').fill('mytest');
    await page.locator('#new-url-input').fill('https://example.com');
    await page.locator('#new-description-input').fill('Example site');
    await page.locator('#add-keyword-btn').click();

    await expect(page.locator('#custom-keywords-list')).toContainText('mytest');
    await expect(page.locator('#custom-keywords-list')).toContainText('https://example.com');
  });

  // test('add a new Unsplash query and see it listed', async () => {
  //   await page.goto(`chrome-extension://${extensionId}/page/options.html#backgrounds`);
  //   await page.locator('#new-query-input').fill('new test query');
  //   await page.locator('#add-query-btn').click();
  //   await expect(page.locator('#queries-list')).toContainText('new test query');
  // });

  test('keywords table populated from config', async () => {
    await page.goto(`chrome-extension://${extensionId}/page/options.html#all-keywords`);
    await expect(page.locator('#list')).toContainText('git');
  });
});


