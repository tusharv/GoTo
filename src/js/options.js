// Config data loaded from centralized JSON file
let config = {};

// Load config from JSON file and initialize UI
(async () => {
	try {
		const response = await fetch(chrome.runtime.getURL('config.json'));
		config = await response.json();
		// Initialize UI after config is loaded
		if (typeof init === 'function') {
			init();
		}
	} catch (error) {
		console.error('Error loading config:', error);
		// Keep empty config as fallback
	}
})();

let tableContainner;
let searchInput;
let queriesListContainer;
let newQueryInput;
let addQueryBtn;
let resetDefaultsBtn;
let resetCurrentWallpaperBtn;

// Custom keywords elements
let customKeywordsList;
let newKeywordInput;
let newUrlInput;
let newSearchParamInput;
let newDescriptionInput;
let addCustomKeywordBtn;
let resetCustomKeywordsBtn;

// Popular keywords UI removed

// Default Unsplash queries
const DEFAULT_UNSPLASH_QUERIES = ['nature', 'animals', 'landscape', 'minimalist', 'abstract', 'architecture'];

// init() will be called after config is loaded

function init(){
	tableContainner = document.getElementById('list');
	// removed: popularKeywordsContainer
	searchInput = document.getElementById('keyword-search');
	queriesListContainer = document.getElementById('queries-list');
	newQueryInput = document.getElementById('new-query-input');
	addQueryBtn = document.getElementById('add-query-btn');
	resetDefaultsBtn = document.getElementById('reset-defaults-btn');
	resetCurrentWallpaperBtn = document.getElementById('reset-current-wallpaper-btn');

	// Custom keywords elements
	customKeywordsList = document.getElementById('custom-keywords-list');
	newKeywordInput = document.getElementById('new-keyword-input');
	newUrlInput = document.getElementById('new-url-input');
	newSearchParamInput = document.getElementById('new-search-param-input');
	newDescriptionInput = document.getElementById('new-description-input');
	addCustomKeywordBtn = document.getElementById('add-keyword-btn');
	resetCustomKeywordsBtn = document.getElementById('reset-custom-keywords-btn');

	// Removed: populatePopularKeywords()
	
	// Populate main table
	populateKeywordsTable();
	
	// Initialize custom keywords management
	initCustomKeywords();
	
	// Initialize Unsplash queries management
	initUnsplashQueries();
	
	// Add search functionality
	if (searchInput) {
		searchInput.addEventListener('input', filterKeywords);
	}
	
	// Add FAQ functionality
	initFAQ();
	
	// Initialize navigation functionality
	initNavigation();
}

// Removed: populatePopularKeywords()

function populateKeywordsTable() {
	if (!tableContainner) return;
	
	tableContainner.innerHTML = '';
	
	// Add default keywords
	for(let site in config){
		let htmlString = '<tr><td><strong>{0}</strong></td><td>{1}</td><td><code>{2}</code></td><td><span class="keyword-type default">Default</span></td></tr>';
		let example = config[site].param ? `goto ${site} ${config[site].param}` : `goto ${site}`;
		tableContainner.innerHTML += htmlString
			.replace('{0}', site)
			.replace('{1}', config[site].default)
			.replace('{2}', example);
	}
	
	// Add custom keywords
	const customKeywords = getCustomKeywords();
	for(let keyword of customKeywords){
		let htmlString = '<tr><td><strong>{0}</strong></td><td>{1}</td><td><code>{2}</code></td><td><span class="keyword-type custom">Custom</span></td></tr>';
		let example = keyword.searchParam ? `goto ${keyword.name} search term` : `goto ${keyword.name}`;
		tableContainner.innerHTML += htmlString
			.replace('{0}', keyword.name)
			.replace('{1}', keyword.url)
			.replace('{2}', example);
	}
}

function filterKeywords() {
	if (!searchInput || !tableContainner) return;
	
	const searchTerm = searchInput.value.toLowerCase();
	const rows = tableContainner.querySelectorAll('tr');
	
	rows.forEach(row => {
		const keyword = row.querySelector('td:first-child').textContent.toLowerCase();
		const website = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
		const example = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
		const type = row.querySelector('td:last-child').textContent.toLowerCase();
		
		if (keyword.includes(searchTerm) || website.includes(searchTerm) || example.includes(searchTerm) || type.includes(searchTerm)) {
			row.style.display = '';
		} else {
			row.style.display = 'none';
		}
	});
}

function initFAQ() {
	const faqItems = document.querySelectorAll('.faq-item');
	
	faqItems.forEach(item => {
		const question = item.querySelector('.faq-question');
		
		question.addEventListener('click', () => {
			const isActive = item.classList.contains('active');
			
			// Close all other FAQ items
			faqItems.forEach(otherItem => {
				otherItem.classList.remove('active');
			});
			
			// Toggle current item
			if (!isActive) {
				item.classList.add('active');
			}
		});
	});
}

function copyToClipboard(text) {
	if (navigator.clipboard) {
		navigator.clipboard.writeText(text).catch(err => {
			console.error('Failed to copy text: ', err);
		});
	} else {
		// Fallback for older browsers
		const textArea = document.createElement('textarea');
		textArea.value = text;
		document.body.appendChild(textArea);
		textArea.select();
		document.execCommand('copy');
		document.body.removeChild(textArea);
	}
}

function showCopyFeedback(element) {
	const originalText = element.querySelector('.keyword-name').textContent;
	element.querySelector('.keyword-name').textContent = 'Copied!';
	element.style.background = '#38a169';
	
	setTimeout(() => {
		element.querySelector('.keyword-name').textContent = originalText;
		element.style.background = '';
	}, 1000);
}

// Unsplash Queries Management Functions
function initUnsplashQueries() {
	if (!queriesListContainer || !newQueryInput || !addQueryBtn || !resetDefaultsBtn) return;
	
	// Load and display current queries
	loadAndDisplayQueries();
	
	// Add event listeners
	addQueryBtn.addEventListener('click', addNewQuery);
	newQueryInput.addEventListener('keypress', (e) => {
		if (e.key === 'Enter') {
			addNewQuery();
		}
	});
	resetDefaultsBtn.addEventListener('click', resetToDefaults);
	if (resetCurrentWallpaperBtn) {
		resetCurrentWallpaperBtn.addEventListener('click', resetCurrentWallpaper);
	}
}

function loadAndDisplayQueries() {
	// Load queries from localStorage
	let queries = [];
	try {
		const stored = localStorage.getItem('unsplashQueries');
		if (stored) {
			const parsed = JSON.parse(stored);
			if (Array.isArray(parsed) && parsed.length > 0) {
				queries = parsed;
			}
		}
	} catch (e) {
		console.error('Error loading unsplash queries:', e);
	}
	
	// If no custom queries, use defaults
	if (queries.length === 0) {
		queries = [...DEFAULT_UNSPLASH_QUERIES];
	}
	
	displayQueries(queries);
}

function displayQueries(queries) {
	if (!queriesListContainer) return;
	
	queriesListContainer.innerHTML = '';
	
	if (queries.length === 0) {
		queriesListContainer.innerHTML = '<p class="no-queries">No queries found. Add some to customize your background images!</p>';
		return;
	}
	
	queries.forEach((query, index) => {
		const queryItem = document.createElement('div');
		queryItem.className = 'query-item';
		queryItem.innerHTML = `
			<div class="query-content">
				<input type="text" value="${query}" class="query-edit-input" data-index="${index}">
				<div class="query-actions">
					<button class="edit-btn" data-index="${index}" title="Edit">✏️</button>
					<button class="delete-btn" data-index="${index}" title="Delete">🗑️</button>
				</div>
			</div>
		`;
		
		// Add event listeners for edit and delete buttons
		const editBtn = queryItem.querySelector('.edit-btn');
		const deleteBtn = queryItem.querySelector('.delete-btn');
		const editInput = queryItem.querySelector('.query-edit-input');
		
		editBtn.addEventListener('click', () => toggleEditMode(queryItem, index));
		deleteBtn.addEventListener('click', () => deleteQuery(index));
		
		// Handle edit input changes
		editInput.addEventListener('blur', () => saveEdit(index));
		editInput.addEventListener('keypress', (e) => {
			if (e.key === 'Enter') {
				saveEdit(index);
			} else if (e.key === 'Escape') {
				cancelEdit(queryItem, index);
			}
		});
		
		queriesListContainer.appendChild(queryItem);
	});
}

function addNewQuery() {
	if (!newQueryInput) return;
	
	const query = newQueryInput.value.trim();
	if (!query) {
		showNotification('Please enter a search term', 'error');
		return;
	}
	
	// Load current queries
	let queries = getCurrentQueries();
	
	// Check if query already exists
	if (queries.includes(query.toLowerCase())) {
		showNotification('This query already exists', 'error');
		return;
	}
	
	// Add new query
	queries.push(query.toLowerCase());
	saveQueries(queries);
	displayQueries(queries);
	
	// Clear input
	newQueryInput.value = '';
	showNotification('Query added successfully!', 'success');
}

function deleteQuery(index) {
	let queries = getCurrentQueries();
	if (index >= 0 && index < queries.length) {
		queries.splice(index, 1);
		saveQueries(queries);
		displayQueries(queries);
		showNotification('Query deleted successfully!', 'success');
	}
}

function toggleEditMode(queryItem, index) {
	const editInput = queryItem.querySelector('.query-edit-input');
	const editBtn = queryItem.querySelector('.edit-btn');
	
	if (editInput.disabled) {
		// Enable edit mode
		editInput.disabled = false;
		editInput.focus();
		editInput.select();
		editBtn.textContent = '💾';
		editBtn.title = 'Save';
	} else {
		// Save changes
		saveEdit(index);
	}
}

function saveEdit(index) {
	const editInputs = document.querySelectorAll('.query-edit-input');
	const editInput = Array.from(editInputs).find(input => parseInt(input.dataset.index) === index);
	
	if (!editInput) return;
	
	const newQuery = editInput.value.trim();
	if (!newQuery) {
		showNotification('Query cannot be empty', 'error');
		return;
	}
	
	let queries = getCurrentQueries();
	
	// Check if query already exists (excluding current index)
	const existingIndex = queries.findIndex((q, i) => q === newQuery.toLowerCase() && i !== index);
	if (existingIndex !== -1) {
		showNotification('This query already exists', 'error');
		return;
	}
	
	// Update query
	queries[index] = newQuery.toLowerCase();
	saveQueries(queries);
	displayQueries(queries);
	showNotification('Query updated successfully!', 'success');
}

function cancelEdit(queryItem, index) {
	const editInput = queryItem.querySelector('.query-edit-input');
	const editBtn = queryItem.querySelector('.edit-btn');
	
	// Reset to original value
	let queries = getCurrentQueries();
	editInput.value = queries[index];
	editInput.disabled = true;
	editBtn.textContent = '✏️';
	editBtn.title = 'Edit';
}

function resetToDefaults() {
	if (confirm('Are you sure you want to reset to default queries? This will replace all your custom queries.')) {
		saveQueries([...DEFAULT_UNSPLASH_QUERIES]);
		displayQueries([...DEFAULT_UNSPLASH_QUERIES]);
		showNotification('Reset to defaults successfully!', 'success');
	}
}

function resetCurrentWallpaper() {
	// Clear the stored wallpaper to force a new one to be fetched
	localStorage.removeItem('wallpaper');
	
	showNotification('Wallpaper reset successfully! Loading new image...', 'success');
	
	// Trigger a custom event to notify other pages that wallpaper was reset
	// This allows the main page to listen for this event and reload the wallpaper
	const resetEvent = new CustomEvent('wallpaperReset', { detail: { forceReset: true } });
	window.dispatchEvent(resetEvent);
	
	// Also try to notify the opener window if it exists
	if (window.opener && !window.opener.closed) {
		window.opener.dispatchEvent(resetEvent);
	}
	
	// If we have access to the main page, try to call getBgImage directly
	if (window.opener && typeof window.opener.getBgImage === 'function') {
		window.opener.getBgImage();
	}
}

function getCurrentQueries() {
	let queries = [];
	try {
		const stored = localStorage.getItem('unsplashQueries');
		if (stored) {
			const parsed = JSON.parse(stored);
			if (Array.isArray(parsed) && parsed.length > 0) {
				queries = parsed;
			}
		}
	} catch (e) {
		console.error('Error loading queries:', e);
	}
	
	if (queries.length === 0) {
		queries = [...DEFAULT_UNSPLASH_QUERIES];
	}
	
	return queries;
}

function saveQueries(queries) {
	try {
		localStorage.setItem('unsplashQueries', JSON.stringify(queries));
	} catch (e) {
		console.error('Error saving queries:', e);
		showNotification('Error saving queries', 'error');
	}
}

function showNotification(message, type = 'info') {
	// Create notification element
	const notification = document.createElement('div');
	notification.className = `notification notification-${type}`;
	notification.textContent = message;
	
	// Style the notification
	notification.style.cssText = `
		position: fixed;
		top: 20px;
		right: 20px;
		padding: 12px 20px;
		border-radius: 6px;
		color: white;
		font-weight: 500;
		z-index: 10000;
		transform: translateX(100%);
		transition: transform 0.3s ease;
		background: ${type === 'success' ? '#38a169' : type === 'error' ? '#e53e3e' : '#3182ce'};
	`;
	
	document.body.appendChild(notification);
	
	// Animate in
	setTimeout(() => {
		notification.style.transform = 'translateX(0)';
	}, 100);
	
	// Remove after 3 seconds
	setTimeout(() => {
		notification.style.transform = 'translateX(100%)';
		setTimeout(() => {
			if (notification.parentNode) {
				notification.parentNode.removeChild(notification);
			}
		}, 300);
	}, 3000);
}

// Navigation functionality
function initNavigation() {
	const navLinks = document.querySelectorAll('.nav-link');
	
	// Add click event listeners for smooth scrolling
	navLinks.forEach(link => {
		link.addEventListener('click', (e) => {
			e.preventDefault();
			const targetId = link.getAttribute('href').substring(1);
			const targetSection = document.getElementById(targetId);
			
			if (targetSection) {
				// Calculate offset to account for sticky header
				const headerHeight = document.querySelector('.options-header').offsetHeight;
				const targetPosition = targetSection.offsetTop - headerHeight - 20;
				
				window.scrollTo({
					top: targetPosition,
					behavior: 'smooth'
				});
				
				// Update active link
				updateActiveNavLink(link);
			}
		});
	});
	
	// Add scroll listener to highlight active section
	window.addEventListener('scroll', highlightActiveSection);
}

function updateActiveNavLink(activeLink) {
	const navLinks = document.querySelectorAll('.nav-link');
	navLinks.forEach(link => {
		link.classList.remove('active');
	});
	activeLink.classList.add('active');
}

function highlightActiveSection() {
	const sections = document.querySelectorAll('section[id]');
	const headerHeight = document.querySelector('.options-header').offsetHeight;
	const scrollPosition = window.scrollY + headerHeight + 100;
	
	let activeSection = null;
	
	sections.forEach(section => {
		const sectionTop = section.offsetTop;
		const sectionBottom = sectionTop + section.offsetHeight;
		
		if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
			activeSection = section;
		}
	});
	
	if (activeSection) {
		const navLinks = document.querySelectorAll('.nav-link');
		navLinks.forEach(link => {
			link.classList.remove('active');
			if (link.getAttribute('href') === `#${activeSection.id}`) {
				link.classList.add('active');
			}
		});
	}
}

// Custom Keywords Management Functions
function initCustomKeywords() {
	if (!customKeywordsList || !newKeywordInput || !newUrlInput || !addCustomKeywordBtn || !resetCustomKeywordsBtn) return;
	
	// Load and display current custom keywords
	loadAndDisplayCustomKeywords();
	
	// Add event listeners
	addCustomKeywordBtn.addEventListener('click', addNewCustomKeyword);
	resetCustomKeywordsBtn.addEventListener('click', resetCustomKeywords);
	
	// Add enter key support for form inputs
	[newKeywordInput, newUrlInput, newSearchParamInput, newDescriptionInput].forEach(input => {
		if (input) {
			input.addEventListener('keypress', (e) => {
				if (e.key === 'Enter') {
					addNewCustomKeyword();
				}
			});
		}
	});
}

function loadAndDisplayCustomKeywords() {
	const customKeywords = getCustomKeywords();
	displayCustomKeywords(customKeywords);
}

function displayCustomKeywords(customKeywords) {
	if (!customKeywordsList) return;
	
	customKeywordsList.innerHTML = '';
	
	if (customKeywords.length === 0) {
		customKeywordsList.innerHTML = '<div class="no-custom-keywords">No custom keywords found. Add some to get started!</div>';
		return;
	}
	
	customKeywords.forEach((keyword, index) => {
		const keywordItem = document.createElement('div');
		keywordItem.className = 'custom-keyword-item';
		keywordItem.innerHTML = `
			<div class="custom-keyword-header">
				<div class="custom-keyword-info">
					<div class="custom-keyword-name">${keyword.name}</div>
					<div class="custom-keyword-url">${keyword.url}</div>
					<div class="custom-keyword-description">${keyword.description || 'No description'}</div>
				</div>
				<div class="custom-keyword-actions">
					<button class="custom-keyword-edit-btn" data-index="${index}" title="Edit">✏️ Edit</button>
					<button class="custom-keyword-delete-btn" data-index="${index}" title="Delete">🗑️ Delete</button>
				</div>
			</div>
			<div class="custom-keyword-params">
				<strong>Search Parameter:</strong> 
				<code>${keyword.searchParam || 'None'}</code>
			</div>
		`;
		
		// Add event listeners for edit and delete buttons
		const editBtn = keywordItem.querySelector('.custom-keyword-edit-btn');
		const deleteBtn = keywordItem.querySelector('.custom-keyword-delete-btn');
		
		editBtn.addEventListener('click', () => editCustomKeyword(index));
		deleteBtn.addEventListener('click', () => deleteCustomKeyword(index));
		
		customKeywordsList.appendChild(keywordItem);
	});
}

async function addNewCustomKeyword() {
	if (!newKeywordInput || !newUrlInput) return;
	
	const keyword = newKeywordInput.value.trim().toLowerCase();
	const url = newUrlInput.value.trim();
	const searchParam = newSearchParamInput.value.trim() || '';
	const description = newDescriptionInput.value.trim() || '';
	
	// Validation
	if (!keyword) {
		showNotification('Please enter a keyword', 'error');
		return;
	}
	
	if (!url) {
		showNotification('Please enter a URL', 'error');
		return;
	}
	
	// Check if URL is valid
	try {
		new URL(url);
	} catch {
		showNotification('Please enter a valid URL', 'error');
		return;
	}
	
	// Check if keyword already exists (in default config or custom keywords)
	if (config[keyword]) {
		showNotification('This keyword already exists in default keywords', 'error');
		return;
	}
	
	const customKeywords = getCustomKeywords();
	if (customKeywords.find(k => k.name === keyword)) {
		showNotification('This custom keyword already exists', 'error');
		return;
	}
	
	// Add new custom keyword
	const newKeyword = {
		name: keyword,
		url: url,
		searchParam: searchParam,
		description: description,
		timestamp: Date.now()
	};
	
	customKeywords.push(newKeyword);
	await saveCustomKeywords(customKeywords);
	displayCustomKeywords(customKeywords);
	
	// Clear form
	newKeywordInput.value = '';
	newUrlInput.value = '';
	newSearchParamInput.value = '';
	newDescriptionInput.value = '';
	
	// Update main keywords table
	populateKeywordsTable();
	showNotification('Custom keyword added successfully!', 'success');
}

async function editCustomKeyword(index) {
	const customKeywords = getCustomKeywords();
	const keyword = customKeywords[index];
	
	if (!keyword) return;
	
	// Fill form with existing values
	newKeywordInput.value = keyword.name;
	newUrlInput.value = keyword.url;
	newSearchParamInput.value = keyword.searchParam || '';
	newDescriptionInput.value = keyword.description || '';
	
	// Remove the keyword being edited
	customKeywords.splice(index, 1);
	await saveCustomKeywords(customKeywords);
	displayCustomKeywords(customKeywords);
	
	// Update main keywords table and popular keywords
	populateKeywordsTable();
	
	showNotification('Keyword loaded for editing. Make changes and click Add Keyword.', 'info');
}

async function deleteCustomKeyword(index) {
	if (confirm('Are you sure you want to delete this custom keyword?')) {
		const customKeywords = getCustomKeywords();
		if (index >= 0 && index < customKeywords.length) {
			customKeywords.splice(index, 1);
			await saveCustomKeywords(customKeywords);
			displayCustomKeywords(customKeywords);
			
			// Update main keywords table and popular keywords
	populateKeywordsTable();
			
			showNotification('Custom keyword deleted successfully!', 'success');
		}
	}
}

async function resetCustomKeywords() {
	if (confirm('Are you sure you want to clear all custom keywords? This action cannot be undone.')) {
		await saveCustomKeywords([]);
		displayCustomKeywords([]);
		// Update main keywords table
		populateKeywordsTable();
		
		showNotification('All custom keywords cleared successfully!', 'success');
	}
}

function getCustomKeywords() {
	let customKeywords = [];
	try {
		const stored = localStorage.getItem('customKeywords');
		if (stored) {
			const parsed = JSON.parse(stored);
			if (Array.isArray(parsed)) {
				customKeywords = parsed;
			}
		}
	} catch (e) {
		console.error('Error loading custom keywords:', e);
	}
	return customKeywords;
}

async function saveCustomKeywords(customKeywords) {
	try {
		// Save to localStorage for immediate UI updates
		localStorage.setItem('customKeywords', JSON.stringify(customKeywords));
		
		// Also save to Chrome storage for background script access (if available)
		if (chrome && chrome.storage && chrome.storage.local) {
			await chrome.storage.local.set({ customKeywords: customKeywords });
		}
		
		// Trigger background script refresh (if available)
		if (chrome && chrome.runtime && chrome.runtime.sendMessage) {
			chrome.runtime.sendMessage({ action: 'refreshConfig' });
		}
	} catch (e) {
		console.error('Error saving custom keywords:', e);
		showNotification('Error saving custom keywords', 'error');
	}
}

// Listen for messages from background script
if (chrome && chrome.runtime && chrome.runtime.onMessage) {
	chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
		if (request.action === 'getCustomKeywords') {
			const customKeywords = getCustomKeywords();
			sendResponse({ customKeywords: customKeywords });
		}
	});
}

