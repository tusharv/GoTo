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
let popularKeywordsContainer;
let searchInput;

// Popular keywords for quick access
const popularKeywords = [
	{ name: 'git', desc: 'GitHub search' },
	{ name: 'youtube', desc: 'YouTube videos' },
	{ name: 'gmail', desc: 'Gmail search' },
	{ name: 'drive', desc: 'Google Drive' },
	{ name: 'map', desc: 'Google Maps' },
	{ name: 'amazon', desc: 'Amazon shopping' },
	{ name: 'flipkart', desc: 'Flipkart shopping' },
	{ name: 'imdb', desc: 'IMDb movies' },
	{ name: 'bing', desc: 'Bing search' },
	{ name: 'ud', desc: 'Urban Dictionary' }
];

// init() will be called after config is loaded

function init(){
	tableContainner = document.getElementById('list');
	popularKeywordsContainer = document.getElementById('popular-keywords');
	searchInput = document.getElementById('keyword-search');

	// Populate popular keywords
	populatePopularKeywords();
	
	// Populate main table
	populateKeywordsTable();
	
	// Add search functionality
	if (searchInput) {
		searchInput.addEventListener('input', filterKeywords);
	}
	
	// Add FAQ functionality
	initFAQ();
}

function populatePopularKeywords() {
	if (!popularKeywordsContainer) return;
	
	popularKeywordsContainer.innerHTML = '';
	
	popularKeywords.forEach(keyword => {
		const keywordCard = document.createElement('div');
		keywordCard.className = 'keyword-card';
		keywordCard.innerHTML = `
			<div class="keyword-name">${keyword.name}</div>
			<div class="keyword-desc">${keyword.desc}</div>
		`;
		
		// Add click functionality to copy to clipboard
		keywordCard.addEventListener('click', () => {
			copyToClipboard(`goto ${keyword.name} `);
			showCopyFeedback(keywordCard);
		});
		
		popularKeywordsContainer.appendChild(keywordCard);
	});
}

function populateKeywordsTable() {
	if (!tableContainner) return;
	
	tableContainner.innerHTML = '';
	
	for(let site in config){
		let htmlString = '<tr><td><strong>{0}</strong></td><td>{1}</td><td><code>{2}</code></td></tr>';
		let example = config[site].param ? `goto ${site} ${config[site].param}` : `goto ${site}`;
		tableContainner.innerHTML += htmlString
			.replace('{0}', site)
			.replace('{1}', config[site].default)
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
		const example = row.querySelector('td:last-child').textContent.toLowerCase();
		
		if (keyword.includes(searchTerm) || website.includes(searchTerm) || example.includes(searchTerm)) {
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
