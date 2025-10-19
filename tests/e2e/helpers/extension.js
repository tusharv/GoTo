const fs = require('fs');
const os = require('os');
const path = require('path');
const { chromium } = require('@playwright/test');

async function tryGetIdFromServiceWorker(context) {
  // Poll longer to allow MV3 service worker to spin up lazily
  for (let i = 0; i < 50; i++) {
    const workers = context.serviceWorkers();
    if (workers.length > 0) {
      const url = workers[0].url();
      const match = url.match(/^chrome-extension:\/\/([a-p]{32})\//);
      if (match) return match[1];
    }
    await new Promise(r => setTimeout(r, 200));
  }
  return null;
}

async function tryGetIdFromNewTab(context) {
  const page = await context.newPage();
  try {
    // Attempt common new tab URLs to trigger chrome_url_overrides
    for (const url of ['chrome://newtab', 'chrome://new-tab-page']) {
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded' });
      } catch (_) {}
      const current = page.url();
      const match = current.match(/^chrome-extension:\/\/([a-p]{32})\//);
      if (match) return match[1];
    }
  } finally {
    await page.close();
  }
  return null;
}

async function tryGetIdFromPreferences(userDataDir, extensionPath) {
  // Chromium stores extension settings keyed by id in the Preferences file
  // Example path: <userDataDir>/Default/Preferences
  const prefPath = path.join(userDataDir, 'Default', 'Preferences');
  // Wait up to ~10s for Preferences to be written
  for (let i = 0; i < 50; i++) {
    try {
      if (fs.existsSync(prefPath)) {
        const raw = fs.readFileSync(prefPath, 'utf-8');
        const json = JSON.parse(raw);
        const settings = json?.extensions?.settings;
        if (settings && typeof settings === 'object') {
          // Find the extension whose path matches our loaded extension
          for (const [id, info] of Object.entries(settings)) {
            const installPath = info?.path || info?.location?.path || '';
            // Some Chromium variants store absolute paths; normalize both sides
            if (installPath && path.resolve(installPath) === path.resolve(extensionPath)) {
              return id;
            }
            // Fallback: match by manifest name if available
            if (info?.manifest?.name === 'GoTo') {
              return id;
            }
          }
          // If only one extension is present in settings, assume it is ours
          const ids = Object.keys(settings);
          if (ids.length === 1) return ids[0];
        }
      }
    } catch (_) {
      // Ignore parse errors while file is being written; retry
    }
    await new Promise(r => setTimeout(r, 200));
  }
  return null;
}

async function launchContextWithExtension(projectRoot) {
  // Resolve extension path and verify manifest exists
  const extensionPath = path.join(projectRoot, 'src');
  const manifestPath = path.join(extensionPath, 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    throw new Error(`manifest.json not found at ${manifestPath}. projectRoot used: ${projectRoot}`);
  }
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pw-goto-'));

  const context = await chromium.launchPersistentContext(userDataDir, {
    headless: false,
    args: [
      `--disable-extensions-except=${extensionPath}`,
      `--load-extension=${extensionPath}`,
    ],
  });

  // Strategy 1: navigate to new tab and parse URL for ID
  let extensionId = await tryGetIdFromNewTab(context);

  // Strategy 2: fall back to service worker URL
  if (!extensionId) {
    extensionId = await tryGetIdFromServiceWorker(context);
  }

  // Strategy 3: read from Chromium Preferences (robust for MV3 lazy workers)
  if (!extensionId) {
    extensionId = await tryGetIdFromPreferences(userDataDir, extensionPath);
  }

  if (!extensionId) {
    throw new Error('Could not determine extension ID after loading');
  }

  return { context, extensionId };
}

module.exports = { launchContextWithExtension };


