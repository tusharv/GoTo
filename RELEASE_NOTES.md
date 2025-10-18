# GoTo Extension - Release Notes

## Version 1.0.3 - Version Bump & Contributors Update

**Release Date:** October 2025

### ✨ What's New

- **Notes**: A lightweight Notes widget on the New Tab page
  - Add, edit, complete, and delete notes
  - Draggable panel with snap-back and viewport clamping
  - Collapsible with persistent state; quick toggle via footer button
  - Local-only storage (no sync/server), supports up to 50 notes
  - Character counter with soft/limit thresholds
- **Calendar Shortcut**: Added `cal` keyword to open Google Calendar; supports searching via `goto cal {query}`

### 🧾 Documentation & Metadata

- **Version Update**: Bumped extension version to `1.0.3` in `src/manifest.json`
- **Package Metadata**: Updated `package.json` version to `1.0.3`
- **Contributors (README.md)**:
  - Added `Iqra Khan` with Code and Research contributions
  - Added Code contribution link for `Vaibhav Jain`
  - Fixed duplicate contribution entry for `KIRAN SATDIVE`
- **all-contributors**: Synced `.all-contributorsrc` to reflect the above changes

### 🎯 Impact

- Minor feature additions and UI/UX improvements
- Backward compatible; no migrations required

### 🎨 UI & UX

- Refined Options and New Tab layouts, spacing, and affordances
- Improved wallpaper refresh behavior and helpful console messages
- Better empty states and focus management in Notes

### ✅ Changes since f9bc0207fb97fee224c03ebb8b4c5c4d277ef3b1

- Added Notes widget with drag/collapse, local storage, and completion support
- Introduced `cal` keyword for Google Calendar (with query support)
- UI fixes: responsive footer link, text overlap/outline corrections, duplicate class cleanup

---

## Version 1.0.1 - Code Cleanup & Debug Removal

**Release Date:** December 2024

### 🧹 Code Cleanup & Maintenance

This release focuses on cleaning up the codebase by removing development and debugging artifacts to prepare for production deployment.

#### ✨ What's New
- **Cleaner Options Page**: Removed development-only test button from the custom keywords section
- **Streamlined User Interface**: Simplified the custom keywords management interface by removing debug controls
- **Production-Ready Code**: Eliminated all debug logging and test functions from the codebase

#### 🔧 Changes Made

**Options Page (options.html)**
- Removed "Test Custom Keywords" button from the custom keywords management section
- Updated help text to remove references to debug functionality
- Streamlined the reset controls interface

**Options Script (options.js)**
- Removed `testCustomKeywords()` debug function
- Removed `testGetServiceLocally()` debug function  
- Eliminated all debug console.log statements from the `saveCustomKeywords()` function
- Removed test button event listeners and references
- Cleaned up variable declarations and initialization code

#### 🎯 Impact
- **Smaller Bundle Size**: Reduced JavaScript bundle size by removing unused debug code
- **Better Performance**: Eliminated unnecessary console logging operations
- **Cleaner Console**: No more debug output cluttering the browser console
- **Professional UI**: Removed development artifacts from the user interface

#### 🔄 Migration Notes
- No user data or settings are affected by this update
- All existing custom keywords and configurations remain intact
- No breaking changes to existing functionality

#### 🐛 Bug Fixes
- Fixed potential memory leaks from debug event listeners
- Resolved console pollution from debug logging statements

#### 📋 Technical Details
- Removed approximately 60 lines of debug code
- Eliminated 5 console.log statements from production code
- Cleaned up 2 unused JavaScript functions
- Removed 1 HTML button element and associated styling

---

### Previous Version: 1.0.0
- Custom keywords functionality
- Background image customization
- Enhanced options page with FAQ section

---

**Installation:** [Chrome Web Store](https://chrome.google.com/webstore/detail/goto/iabecofjidglogmhkccmgihafpoaccmd)

**Support:** For issues or feature requests, please visit our [GitHub repository](https://github.com/tusharv/GoTo)

**License:** GNU General Public License v3.0
