/*global Typed axios secret*/

// Config data loaded from centralized JSON file
let config = {};

// Load config from JSON file
(async () => {
	try {
		const response = await fetch(chrome.runtime.getURL('config.json'));
		config = await response.json();
		// Initialize typed examples after config is loaded
		if (typeof help === 'function') {
			help();
		}
	} catch (error) {
		console.error('Error loading config:', error);
		// Keep empty config as fallback
	}
})();

let dateContainnner, timeContainer;
let isVisible = true;
let typed;
const BGIMAGE_DELAY = 300; // 60 second * 5 mins = 300

const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

document.addEventListener('DOMContentLoaded', init);

function init() {
	timeContainer = document.getElementsByClassName('time')[0];
	dateContainnner = document.getElementsByClassName('date')[0];

	updateDate();
	window.requestAnimationFrame(updateTime);

	// help() will be called after config is loaded
	getBgImage();
	
	// Initialize notes functionality
	initNotesWidget();

	document.addEventListener('visibilitychange', onFocusUpdate);
	
	// Listen for wallpaper reset events from options page
	window.addEventListener('wallpaperReset', (event) => {
		console.log('Wallpaper reset event received:', event.detail);
		// Only force new image if this is an explicit reset event
		if (event.detail && event.detail.forceReset) {
			forceNewBgImage();
		} else {
			getBgImage();
		}
	});
	
	// Add keyboard shortcut for manual refresh (Ctrl+R or Cmd+R)
	document.addEventListener('keydown', (e) => {
		if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
			e.preventDefault();
			// Clear cache and get new image
			localStorage.removeItem('wallpaper');
			forceNewBgImage();
		}
	});
	
}

function help() {
	let options = [];

	for (var site in config) {
		options.push('goto ' + site + ' ' + config[site].param);
	}

	typed = new Typed('#message', {
		strings: options,
		shuffle: true,
		contentType: 'text',
		typeSpeed: 70,
		backDelay: 4000,
		startDelay: 4000,
		showCursor: false,
		loop: false
	});
}

function onFocusUpdate() {
	switch (document.visibilityState) {
	case 'visible':
		isVisible = true;
		updateTime();
		typed.start();
		break;
	case 'hidden':
		isVisible = false;
		if (!typed.isPaused) {
			typed.stop();
		}
		break;
	default:
		break;
	}
}

function updateTime() {
	var now = new Date();
	timeContainer.innerHTML = padNum(now.getHours()) + ':' + padNum(now.getMinutes()) + ':' + padNum(now.getSeconds());

	if (now.getHours() === 0 && now.getMinutes() === 0 && now.getSeconds() === 0) {
		updateDate();
	}

	if (isVisible) {
		window.requestAnimationFrame(updateTime);
	}
}

function updateDate() {
	var now = new Date();
	var dayName = day[now.getDay()];
	var dayNumber = now.getDate();
	var monthName = month[now.getMonth()];
	var year = now.getFullYear();
	
	dateContainnner.innerHTML = dayName + ', ' + dayNumber + nth(dayNumber) + ' ' + monthName + ' ' + year;
}

function padNum(num) {
	return (num > 9) ? num : '0' + num;
}

function nth(d) {
	let result = '';
	if (d > 3 && d < 21) {
		result = 'th';
	} else {
		switch (d % 10) {
		case 1:
			result = 'st';
			break;
		case 2:
			result = 'nd';
			break;
		case 3:
			result = 'rd';
			break;
		default:
			result = 'th';
		}
	}
	return '<sup>' + result + '</sup>';
}

function forceNewBgImage() {
	// Clear any existing wallpaper cache
	console.log('Force refreshing wallpaper - clearing cache');
	localStorage.removeItem('wallpaper');
	fetchNewWallpaper();
}

function getBgImage() {
	var then = localStorage.getItem('wallpaper');
	if(then){
		let now = new Date() / 1000;
		then = JSON.parse(then);
		let timeDiff = now - Number(then.timestamp);
		console.log('Cache check - Time diff:', timeDiff, 'BGIMAGE_DELAY:', BGIMAGE_DELAY);
		if(timeDiff < BGIMAGE_DELAY){
			console.log('Using cached wallpaper');
			updateWallpaper(then);
			return;
		}
		console.log('Cache expired, fetching new wallpaper');
	}
	console.log('No cache found, fetching new wallpaper');
	fetchNewWallpaper();
}

function fetchNewWallpaper() {
    
	// Load user-selected queries from localStorage (set by options page), fallback to default if not set
	let defaultQueries = ['nature', 'animals', 'landscape', 'minimalist', 'abstract', 'architecture'];
	let userQueries = [];
	try {
		const stored = localStorage.getItem('unsplashQueries');
		if (stored) {
			const parsed = JSON.parse(stored);
			if (Array.isArray(parsed) && parsed.length > 0) {
				userQueries = parsed;
			}
		}
	} catch (e) {
		// fallback to default
	}
	// Randomly select one query to increase variety
	const availableQueries = userQueries.length > 0 ? userQueries : defaultQueries;
	const randomQuery = availableQueries[Math.floor(Math.random() * availableQueries.length)];
	
	// Add cache busting parameter to ensure different images
	const cacheBuster = Date.now();
	axios.get('https://api.unsplash.com/photos/random?client_id=' + secret.unsplash.API_KEY + '&orientation=landscape&query=' + encodeURIComponent(randomQuery) + '&count=1&' + cacheBuster)
		.then(response => {
			if (response.data && response.data.length > 0) {
				let data = response.data[0]; // Get first photo from the array
				// Handle cases where description might be null or empty
				let description = data.description || data.alt_description || 'Beautiful landscape photo';
				let o = {
					image: data.urls.regular,
					color: data.color,
					description: description,
					name: data.user.name,
					link: data.user.links.html,
					photo_link: data.links.html,
					timestamp: new Date()/1000
				};
				updateWallpaper(o);
				localStorage.setItem('wallpaper', JSON.stringify(o));
			}

		})
		// eslint-disable-next-line no-unused-vars
		.catch(error => {
			let o = {
				image: '../image/default.jpeg',
				color: '#000000',
				description: 'Default background image',
				name: 'Brandon Griggs',
				link: 'https://unsplash.com/@paralitik',
				timestamp: new Date()/1000
			};
			updateWallpaper(o);
		});
}

function updateWallpaper(wallpaper){
	document.body.style.backgroundImage = 'url(' + wallpaper.image + ')';
	document.body.style.backgroundColor = (wallpaper.color || '#000000');
	
	// Ensure description element exists and has content
	const descriptionElement = document.getElementById('description');
	if (descriptionElement) {
		descriptionElement.innerHTML = wallpaper.description || 'Beautiful photo';
	}
	
	document.getElementById('name').innerHTML = wallpaper.name;
	document.getElementById('link').href = wallpaper.link + '?utm_source=GoToExtension&utm_medium=referral';
	document.getElementById('photo_link').href = wallpaper.photo_link + '?utm_source=GoToExtension&utm_medium=referral';
}

// Notes Widget functionality
let notesData = [];
const MAX_NOTES = 50;
const MAX_NOTE_LENGTH = 150;
const NOTES_WIDGET_STORAGE_KEY = 'goToNotesWidgetState';
let notesToggleIgnoreClickUntil = 0; // suppress toggle click immediately after a drag

function initNotesWidget() {
	const addNoteBtn = document.getElementById('addNoteBtn');
	const notesWidget = document.getElementById('notesWidget');
	const notesPanel = document.getElementById('notesPanel');
	const notesToggle = document.getElementById('notesToggle');
	const notesCollapseBtn = document.getElementById('notesCollapseBtn');
	const notesDragHandle = document.querySelector('.notes-drag-handle');
	
	if (!addNoteBtn || !notesWidget || !notesPanel || !notesToggle || !notesCollapseBtn) {
		return; // Elements not found, skip initialization
	}
	
	// Load saved notes on initialization
	loadAllNotes();
	
	// Add event listeners
	addNoteBtn.addEventListener('click', addNewNote);

	// Initialize draggable & collapsed state
	applySavedNotesWidgetState();
	initNotesDrag(notesWidget, notesDragHandle, notesToggle);
	// Ensure within viewport after layout
	requestAnimationFrame(() => clampNotesWithinViewport(true));
	window.addEventListener('resize', () => clampNotesWithinViewport(true));
	window.addEventListener('orientationchange', () => clampNotesWithinViewport(true));

    // Collapse/expand events
    notesCollapseBtn.addEventListener('click', () => { setNotesCollapsed(true); clampNotesWithinViewport(true); });
    notesToggle.addEventListener('click', (e) => {
        if (Date.now() < notesToggleIgnoreClickUntil) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        setNotesCollapsed(false);
        clampNotesWithinViewport(true);
    });
	
	// Initial render
	renderNotesList();
}



function addNewNote() {
	if (notesData.length >= MAX_NOTES) {
		alert(`Maximum ${MAX_NOTES} notes allowed.`);
		return;
	}
	
	const newNote = {
		id: generateNoteId(),
		content: '',
		timestamp: new Date().getTime(),
		isEditing: true,
		completed: false
	};
	
	notesData.unshift(newNote); // Add to beginning
	renderNotesList();
	saveAllNotes();
	
	// Focus on the new note
	setTimeout(() => {
		const newNoteTextarea = document.querySelector(`[data-note-id="${newNote.id}"] textarea`);
		if (newNoteTextarea) {
			newNoteTextarea.focus();
		}
	}, 100);
}

function generateNoteId() {
	return 'note_' + new Date().getTime() + '_' + Math.random().toString(36).substr(2, 9);
}

function renderNotesList() {
	const notesList = document.getElementById('notesList');
	if (!notesList) return;
	
	if (notesData.length === 0) {
		notesList.innerHTML = '<div class="notes-empty">No notes yet. Click "Add Note" to get started!</div>';
		return;
	}
	
	notesList.innerHTML = notesData.map(note => `
		<div class="note-item" data-note-id="${note.id}">
			<div class="note-row">
				<input type="checkbox" class="note-checkbox" ${note.completed ? 'checked' : ''} aria-label="Mark complete">
				${note.isEditing ? `
					<textarea 
						class="note-textarea" 
						placeholder="What's on your mind?"
						maxlength="${MAX_NOTE_LENGTH}"
					>${note.content}</textarea>
				` : `
					<div class="note-content${note.completed ? ' note-completed' : ''}">${note.content || 'Empty note'}</div>
				`}
				<button class="note-delete-btn" title="Delete note">×</button>
			</div>
			${note.isEditing ? `
				<div class="note-char-count">
					<span class="char-count">${note.content.length}/${MAX_NOTE_LENGTH}</span>
				</div>
			` : `
				<div class="note-timestamp">${formatNoteDate(note.timestamp)}</div>
			`}
		</div>
	`).join('');
	
	// Add event listeners after rendering
	addNoteEventListeners();
	// Update character counts for editing notes
	updateCharCounts();
}

// Notes widget: collapsed state persistence
function setNotesCollapsed(collapsed) {
	const notesWidget = document.getElementById('notesWidget');
	if (!notesWidget) return;
	if (collapsed) {
		notesWidget.classList.add('collapsed');
	} else {
		notesWidget.classList.remove('collapsed');
	}
	saveNotesWidgetState({ collapsed });
}

function applySavedNotesWidgetState() {
	const notesWidget = document.getElementById('notesWidget');
	if (!notesWidget) return;
	let saved = {};
	try {
		const raw = localStorage.getItem(NOTES_WIDGET_STORAGE_KEY);
		if (raw) saved = JSON.parse(raw) || {};
	} catch (e) {
		// ignore
	}
	if (saved.collapsed) notesWidget.classList.add('collapsed');
	if (typeof saved.left === 'number' && typeof saved.top === 'number') {
		// Switch to absolute position when a custom position exists
		notesWidget.style.left = saved.left + 'px';
		notesWidget.style.top = saved.top + 'px';
		notesWidget.style.right = 'auto';
		notesWidget.style.bottom = 'auto';
	}
	// Clamp to viewport after applying saved state
	clampNotesWithinViewport(true);
}

function saveNotesWidgetState(partial) {
	let prev = {};
	try {
		const raw = localStorage.getItem(NOTES_WIDGET_STORAGE_KEY);
		if (raw) prev = JSON.parse(raw) || {};
	} catch (e) {
		// ignore
	}
	const next = { ...prev, ...partial };
	try { localStorage.setItem(NOTES_WIDGET_STORAGE_KEY, JSON.stringify(next)); } catch (e) {}
}

// Notes widget: drag support (mouse + touch)
function initNotesDrag(notesWidget, dragHandle, toggleButton) {
	if (!notesWidget || !dragHandle) return;

	let isDragging = false;
	let offsetX = 0;
	let offsetY = 0;
    let moved = false;

	function getPointerPosition(evt) {
		if (evt.touches && evt.touches.length) {
			return { x: evt.touches[0].clientX, y: evt.touches[0].clientY };
		}
		return { x: evt.clientX, y: evt.clientY };
	}

	function onPointerDown(evt) {
		const { x, y } = getPointerPosition(evt);
		const rect = notesWidget.getBoundingClientRect();
		isDragging = true;
        moved = false;
		offsetX = x - rect.left;
		offsetY = y - rect.top;
		notesWidget.style.transition = 'none';
		notesWidget.style.left = rect.left + 'px';
		notesWidget.style.top = rect.top + 'px';
		notesWidget.style.right = 'auto';
		notesWidget.style.bottom = 'auto';
		document.addEventListener('mousemove', onPointerMove);
		document.addEventListener('mouseup', onPointerUp);
		document.addEventListener('touchmove', onPointerMove, { passive: false });
		document.addEventListener('touchend', onPointerUp);
		if (evt.cancelable) evt.preventDefault();
	}

	function clamp(val, min, max) { return Math.max(min, Math.min(max, val)); }

	function onPointerMove(evt) {
		if (!isDragging) return;
		if (evt.cancelable) evt.preventDefault();
		const { x, y } = getPointerPosition(evt);
		const newLeft = x - offsetX;
		const newTop = y - offsetY;
		const maxLeft = window.innerWidth - notesWidget.offsetWidth;
		const maxTop = window.innerHeight - notesWidget.offsetHeight;
		notesWidget.style.left = clamp(newLeft, 0, Math.max(0, maxLeft)) + 'px';
		notesWidget.style.top = clamp(newTop, 0, Math.max(0, maxTop)) + 'px';
        moved = true;
	}

	function onPointerUp() {
		if (!isDragging) return;
		isDragging = false;
		document.removeEventListener('mousemove', onPointerMove);
		document.removeEventListener('mouseup', onPointerUp);
		document.removeEventListener('touchmove', onPointerMove);
		document.removeEventListener('touchend', onPointerUp);
		// Clamp and persist final position
		clampNotesWithinViewport(true);
        if (moved) {
            // Suppress click on toggle for a short time after drag end
            notesToggleIgnoreClickUntil = Date.now() + 250;
        }
	}

	dragHandle.addEventListener('mousedown', onPointerDown);
	dragHandle.addEventListener('touchstart', onPointerDown, { passive: false });

	// Allow dragging from the round toggle when collapsed
	if (toggleButton) {
		toggleButton.addEventListener('mousedown', onPointerDown);
		toggleButton.addEventListener('touchstart', onPointerDown, { passive: false });
	}
}

// Ensure the widget stays within viewport bounds
function clampNotesWithinViewport(persist = true) {
	const notesWidget = document.getElementById('notesWidget');
	if (!notesWidget) return;
	const computed = getComputedStyle(notesWidget);
	if (computed.position !== 'fixed') return; // respect mobile relative layout

	const widgetRect = notesWidget.getBoundingClientRect();
	let left = widgetRect.left;
	let top = widgetRect.top;

	// If left/top styles exist, prefer them
	if (notesWidget.style.left) left = parseInt(notesWidget.style.left, 10) || left;
	if (notesWidget.style.top) top = parseInt(notesWidget.style.top, 10) || top;

	const maxLeft = Math.max(0, window.innerWidth - notesWidget.offsetWidth);
	const maxTop = Math.max(0, window.innerHeight - notesWidget.offsetHeight);

	const clampedLeft = Math.min(Math.max(0, left), maxLeft);
	const clampedTop = Math.min(Math.max(0, top), maxTop);

	// Apply if changed or if right/bottom were being used
	if (notesWidget.style.right !== 'auto' || notesWidget.style.bottom !== 'auto' || clampedLeft !== left || clampedTop !== top) {
		notesWidget.style.left = clampedLeft + 'px';
		notesWidget.style.top = clampedTop + 'px';
		notesWidget.style.right = 'auto';
		notesWidget.style.bottom = 'auto';
		if (persist) saveNotesWidgetState({ left: clampedLeft, top: clampedTop });
	}
}

function addNoteEventListeners() {
	// Add event listeners for note content and delete buttons
	document.querySelectorAll('.note-content').forEach(contentDiv => {
		contentDiv.addEventListener('click', () => {
			const noteId = contentDiv.closest('.note-item').dataset.noteId;
			editNote(noteId);
		});
	});
	
	document.querySelectorAll('.note-delete-btn').forEach(deleteBtn => {
		deleteBtn.addEventListener('click', () => {
			const noteId = deleteBtn.closest('.note-item').dataset.noteId;
			deleteNote(noteId);
		});
	});
	
	// Checkbox toggle
	document.querySelectorAll('.note-checkbox').forEach(checkbox => {
		checkbox.addEventListener('change', (e) => {
			const noteId = checkbox.closest('.note-item').dataset.noteId;
			setNoteCompleted(noteId, e.target.checked);
		});
	});

	document.querySelectorAll('.note-textarea').forEach(textarea => {
		const noteId = textarea.closest('.note-item').dataset.noteId;
		
		textarea.addEventListener('blur', () => {
			saveNote(noteId, textarea.value);
		});
		
		textarea.addEventListener('keydown', (event) => {
			handleNoteKeydown(event, noteId);
		});
	});
}

function handleNoteKeydown(event, noteId) {
	if (event.key === 'Enter' && !event.shiftKey) {
		event.preventDefault();
		saveNote(noteId, event.target.value);
	}
	if (event.key === 'Escape') {
		cancelNoteEdit(noteId);
	}
	
	// Update character count in real-time
	setTimeout(() => updateCharCount(noteId, event.target.value.length), 0);
}

function updateCharCount(noteId, length) {
	const noteItem = document.querySelector(`[data-note-id="${noteId}"]`);
	const charCountSpan = noteItem?.querySelector('.char-count');
	if (charCountSpan) {
		charCountSpan.textContent = `${length}/${MAX_NOTE_LENGTH}`;
		charCountSpan.className = 'char-count';
		if (length >= MAX_NOTE_LENGTH * 0.9) charCountSpan.classList.add('char-count-warning');
		if (length >= MAX_NOTE_LENGTH) charCountSpan.classList.add('char-count-limit');
	}
}

function updateCharCounts() {
	document.querySelectorAll('.note-textarea').forEach(textarea => {
		const noteId = textarea.closest('.note-item').dataset.noteId;
		updateCharCount(noteId, textarea.value.length);
		
		textarea.addEventListener('input', () => {
			updateCharCount(noteId, textarea.value.length);
		});
	});
}

function editNote(noteId) {
	const note = notesData.find(n => n.id === noteId);
	if (!note) return;
	
	note.isEditing = true;
	renderNotesList();
	
	setTimeout(() => {
		const textarea = document.querySelector(`[data-note-id="${noteId}"] textarea`);
		if (textarea) {
			textarea.focus();
			textarea.setSelectionRange(textarea.value.length, textarea.value.length);
		}
	}, 50);
}

function saveNote(noteId, content) {
	const note = notesData.find(n => n.id === noteId);
	if (!note) return;
	
	content = content.trim();
	
	if (content === '') {
		deleteNote(noteId);
		return;
	}
	
	note.content = content;
	note.isEditing = false;
	note.timestamp = new Date().getTime();
	
	renderNotesList();
	saveAllNotes();
}

function setNoteCompleted(noteId, completed) {
	const note = notesData.find(n => n.id === noteId);
	if (!note) return;
	note.completed = !!completed;
	// Only re-render display if not editing; editing uses textarea
	if (!note.isEditing) {
		renderNotesList();
	}
	saveAllNotes();
}

function cancelNoteEdit(noteId) {
	const note = notesData.find(n => n.id === noteId);
	if (!note) return;
	
	if (note.content === '') {
		deleteNote(noteId);
		return;
	}
	
	note.isEditing = false;
	renderNotesList();
}

function deleteNote(noteId) {
	const noteIndex = notesData.findIndex(n => n.id === noteId);
	if (noteIndex === -1) return;
	
	const note = notesData[noteIndex];
	if (note.content && !confirm('Are you sure you want to delete this note?')) {
		return;
	}
	
	notesData.splice(noteIndex, 1);
	renderNotesList();
	saveAllNotes();
}



function formatNoteDate(timestamp) {
	const now = new Date();
	const noteDate = new Date(timestamp);
	const diffTime = now - noteDate;
	const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
	
	if (diffDays === 0) {
		return noteDate.toLocaleTimeString('en-US', { 
			hour: '2-digit', 
			minute: '2-digit',
			hour12: false 
		});
	} else if (diffDays === 1) {
		return 'Yesterday';
	} else if (diffDays < 7) {
		return `${diffDays}d ago`;
	} else {
		return noteDate.toLocaleDateString('en-US', { 
			month: 'short', 
			day: 'numeric' 
		});
	}
}

function saveAllNotes() {
	try {
		localStorage.setItem('goToNotesWidget', JSON.stringify(notesData));
		console.log('Notes saved successfully');
	} catch (error) {
		console.error('Error saving notes:', error);
	}
}

function loadAllNotes() {
	try {
		const savedNotes = localStorage.getItem('goToNotesWidget');
		if (savedNotes) {
			notesData = JSON.parse(savedNotes);
			// Ensure no notes are in editing mode after load
			notesData.forEach(note => note.isEditing = false);
			console.log('Notes loaded successfully');
		}
	} catch (error) {
		console.error('Error loading notes:', error);
		// Clear corrupted data
		localStorage.removeItem('goToNotesWidget');
		notesData = [];
	}
}
