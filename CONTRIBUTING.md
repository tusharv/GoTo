## Contributing to GoTo

Thanks for your interest in contributing! This guide will help you get the project running locally, understand required credentials, and submit changes smoothly.

### 1) Explore the extension
- **Install from Chrome Web Store**: Open `chrome://extensions`, search for "GoTo" or install via the store listing linked in `README.md` which is https://chromewebstore.google.com/detail/goto/iabecofjidglogmhkccmgihafpoaccmd .
- **See how it works**: After install, open a new tab or type `goto help` in the omnibox to view supported shortcuts. You can also open the options page from the extension card to explore features.

### 2) Run locally (unpacked)
1. Clone the repository
   ```bash
   git clone https://github.com/tusharv/GoTo
   cd GoTo
   ```
2. Create `src/js/secret.js` (see section below)
3. Load the extension
   - Open `chrome://extensions`
   - Toggle on Developer mode (top-right)
   - Click "Load unpacked" and select the `src` directory
4. Open a new tab to use GoTo

### 3) Unsplash API key (required for wallpapers)
GoTo fetches random background images from Unsplash. You’ll need a free API key.

- Sign in or create an account at `https://unsplash.com/join`
- Go to `https://unsplash.com/oauth/applications` and create a new application
- Copy the **Access Key** (public client key)

Note: For local development we only need the Access Key; do not commit any keys.

### 4) Configure `secret.js`
Create a file at `src/js/secret.js`:

```javascript
var secret = {
    "unsplash" : {
        "API_KEY" : "YOUR_UNSPLASH_ACCESS_KEY"
    }
}
```

- Keep this file local; it must not be committed. If needed, add or verify it’s in your global gitignore. The project reads `secret.unsplash.API_KEY` when calling Unsplash.

### 5) Development workflow
- Make changes under `src/`
- Reload the unpacked extension from `chrome://extensions` (click the refresh icon on the GoTo card)
- Open a new tab to verify your change. Use the options page for configurable settings.

### 6) Submitting changes
1. **Create an issue** describing the problem/feature, expected behavior, and approach
2. **Open a Pull Request** linking the issue
   - Keep PRs focused and small where possible
   - Include before/after notes or screenshots for UI changes
   - Ensure no secrets are committed (e.g., `src/js/secret.js`)

### 7) Release timing
- **Small changes**: typically published overnight
- **Major changes**: released within a week, then go live after Google Chrome Web Store review

### 8) Code style and notes
- Keep code readable with descriptive names and clear flow
- Avoid committing unrelated formatting or refactors with a feature/fix
- Respect existing file structure and avoid committing large assets

Thank you for contributing!


