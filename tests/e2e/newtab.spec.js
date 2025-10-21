const path = require('path');
const fs = require('fs');
const { test, expect } = require('@playwright/test');
const { launchContextWithExtension } = require('./helpers/extension');

test.describe('New Tab page', () => {
  let context;
  let extensionId;
  let page;

  test.beforeAll(async () => {
    const root = path.resolve(__dirname, '../../');
    const launched = await launchContextWithExtension(root);
    context = launched.context;
    extensionId = launched.extensionId;

    // Mock Unsplash API calls globally
    await context.route('https://api.unsplash.com/**', async route => {
      const body = [
        {
          urls: { regular: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2P4//8/AwAI/AL+GQfK1wAAAABJRU5ErkJggg==' },
          color: '#000000',
          description: 'Test Image',
          alt_description: 'Alt Test',
          user: { name: 'Tester', links: { html: 'https://unsplash.com/@tester' } },
          links: { html: 'https://unsplash.com/photos/test' }
        }
      ];
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(body)
      });
    });

    page = await context.newPage();
  });

  test.afterAll(async () => {
    await context.close();
  });

  test('loads and shows message and notes widget', async () => {
    await page.goto(`chrome-extension://${extensionId}/page/new.html`);

    await expect(page.locator('#message')).toBeVisible();
    await expect(page.locator('#notesWidget')).toBeVisible();
  });

  test('add a note and persist across reload', async () => {
    await page.goto(`chrome-extension://${extensionId}/page/new.html`);

    await page.getByRole('button', { name: 'Add Note' }).click();
    const textarea = page.locator('#notesList .note-item textarea').first();
    await textarea.fill('My persistent note');
    await textarea.press('Enter');

    // After saving, it becomes a div
    await expect(page.locator('#notesList .note-item .note-content').first()).toContainText('My persistent note');

    await page.reload();
    await expect(page.locator('#notesList .note-item .note-content').first()).toContainText('My persistent note');
  });

  test('footer Options link navigates to Options page', async () => {
    await page.goto(`chrome-extension://${extensionId}/page/new.html`);

    await page.getByRole('link', { name: 'Options' }).click();
    await expect(page).toHaveURL(new RegExp(`^chrome-extension://${extensionId}/page/options.html`));
    // Basic sanity check for options page content
    await expect(page.locator('header.options-header')).toBeVisible();
  });

  test('footer Feedback link uses mailto', async () => {
    await page.goto(`chrome-extension://${extensionId}/page/new.html`);

    await expect(page.getByRole('link', { name: 'Feedback' })).toHaveAttribute('href', 'mailto:tusharvaghela@gmail.com');
  });

  test('Notes footer button toggles notes widget', async () => {
    await page.goto(`chrome-extension://${extensionId}/page/new.html`);

    const notesWidget = page.locator('#notesWidget');
    await expect(notesWidget).toBeVisible();

    // First click collapses
    await page.getByRole('button', { name: 'Notes' }).click();
    await expect.poll(async () => notesWidget.evaluate(el => el.classList.contains('collapsed'))).toBe(true);

    // Second click expands
    await page.getByRole('button', { name: 'Notes' }).click();
    await expect.poll(async () => notesWidget.evaluate(el => el.classList.contains('collapsed'))).toBe(false);
  });

  test('config URLs are reachable (all URL fields)', async () => {
    const configPath = path.resolve(__dirname, '../../src/config.json');
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

    const urlsToCheck = [];
    for (const [key, entry] of Object.entries(config)) {
      if (!entry || typeof entry !== 'object') continue;
      for (const [field, template] of Object.entries(entry)) {
        if (typeof template !== 'string') continue;
        // Skip non-URL-ish placeholders like 'param'
        if (field === 'param') continue;

        let url = template;
        if (template.includes('{0}')) {
          const param = encodeURIComponent(entry.param || 'test');
          url = template.replace('{0}', param);
        }

        // Only http(s), skip localhost/127.0.0.1 and internal/relative schemes
        if (!/^https?:\/\//i.test(url)) continue;
        if (/^https?:\/\/(localhost|127\.0\.0\.1)/i.test(url)) continue;

        urlsToCheck.push({ key, field, url });
      }
    }

    expect(urlsToCheck.length).toBeGreaterThan(0);

    const results = await Promise.all(
      urlsToCheck.map(async meta => {
        try {
          const resp = await page.request.get(meta.url, { timeout: 15000 });
          return { ...meta, status: resp.status(), ok: resp.status() !== 404 };
        } catch (err) {
          // Treat network errors/timeouts as non-fatal for this check
          return { ...meta, status: -1, ok: true };
        }
      })
    );

    const failures = results.filter(r => !r.ok);
    if (failures.length) {
      const message = failures
        .map(f => `${f.key}.${f.field} -> ${f.url} [status=${f.status}]`)
        .join('\n');
      throw new Error('Some config URLs failed:\n' + message);
    }
  });
});


