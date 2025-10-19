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
    // Wait for options.js to finish init (table populated)
    await page.waitForSelector('#list tr');

    await page.locator('#new-keyword-input').fill('mytest');
    await page.locator('#new-url-input').fill('https://example.com');
    await page.locator('#new-description-input').fill('Example site');
    await page.locator('#add-keyword-btn').click();

    await expect(page.locator('#custom-keywords-list')).toContainText('mytest');
    await expect(page.locator('#custom-keywords-list')).toContainText('https://example.com');
  });

  test('add a new Unsplash query and see it listed', async () => {
    await page.goto(`chrome-extension://${extensionId}/page/options.html#backgrounds`);
    // Wait for defaults to render so event listeners are attached
    await page.waitForSelector('#queries-list .query-item');
    await page.locator('#new-query-input').fill('new test query');
    await page.locator('#add-query-btn').click();
    // Values render inside input elements, not as text nodes
    await expect(page.locator('#queries-list input.query-edit-input[value="new test query"]').first()).toBeVisible();
  });

  test('keywords table populated from config', async () => {
    await page.goto(`chrome-extension://${extensionId}/page/options.html#all-keywords`);
    await expect(page.locator('#list')).toContainText('git');
  });
});


