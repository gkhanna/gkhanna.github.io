// Backyard Camera Gallery Script

const STATE = {
    allImages: [],
    filteredImages: [],
    currentView: 'grid',
    currentFilter: '',
    currentTab: 'gallery',
    itemsPerPage: 12,
    currentPage: 1,
    currentImageIndex: -1,
    imagesByDate: {},
    calendarDate: new Date(),
};

const ALERT_TYPES = {
    'sky': { label: 'Sky Colors', color: '#f59e0b' },
    'motion': { label: 'Motion / Scene Change', color: '#3b82f6' },
    'brightness': { label: 'Lighting Change', color: '#10b981' },
};

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await loadImageData();
    setupEventListeners();
    renderGallery();
    updateStats();
    renderCalendar();
});

// Load image manifest from JSON
async function loadImageData() {
    try {
        const response = await fetch('./data/manifest.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        STATE.allImages = data.images || [];
        
        // Index images by date
        STATE.imagesByDate = {};
        STATE.allImages.forEach(img => {
            const date = new Date(img.timestamp).toLocaleDateString();
            if (!STATE.imagesByDate[date]) {
                STATE.imagesByDate[date] = [];
            }
            STATE.imagesByDate[date].push(img);
        });
        
        STATE.filteredImages = STATE.allImages.slice();
    } catch (error) {
        console.error('Failed to load image data:', error);
        STATE.allImages = [];
        STATE.filteredImages = [];
    }
}

// Setup event listeners
function setupEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tab = e.target.dataset.tab;
            switchTab(tab);
        });
    });

    // View toggle
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            setViewMode(e.target.dataset.view);
        });
    });

    // Filter
    document.getElementById('filter-type')?.addEventListener('change', (e) => {
        applyFilter(e.target.value);
    });

    // Load more
    document.querySelector('.load-more-btn')?.addEventListener('click', () => {
        STATE.currentPage++;
        renderGallery();
    });

    // Calendar
    document.querySelector('.calendar-btn.prev')?.addEventListener('click', () => {
        STATE.calendarDate.setMonth(STATE.calendarDate.getMonth() - 1);
        renderCalendar();
    });
    document.querySelector('.calendar-btn.next')?.addEventListener('click', () => {
        STATE.calendarDate.setMonth(STATE.calendarDate.getMonth() + 1);
        renderCalendar();
    });

    // Modal
    document.getElementById('imageModal')?.addEventListener('click', (e) => {
        if (e.target.id === 'imageModal') closeModal();
    });
    document.querySelector('.modal-close')?.addEventListener('click', closeModal);
    document.querySelector('.modal-prev-btn')?.addEventListener('click', showPrevImage);
    document.querySelector('.modal-next-btn')?.addEventListener('click', showNextImage);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!document.getElementById('imageModal').classList.contains('active')) return;
        if (e.key === 'ArrowLeft') showPrevImage();
        if (e.key === 'ArrowRight') showNextImage();
        if (e.key === 'Escape') closeModal();
    });
}

// Tab switching
function switchTab(tabName) {
    STATE.currentTab = tabName;
    document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`${tabName}-tab`)?.classList.add('active');
    document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');

    if (tabName === 'calendar') renderCalendar();
    if (tabName === 'stats') updateStats();
}

// View mode
function setViewMode(mode) {
    STATE.currentView = mode;
    document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-view="${mode}"]`)?.classList.add('active');
    
    document.getElementById('gallery-grid').style.display = mode === 'grid' ? 'grid' : 'none';
    document.getElementById('gallery-list').style.display = mode === 'list' ? 'flex' : 'none';
    
    STATE.currentPage = 1;
    renderGallery();
}

// Filter
function applyFilter(filterType) {
    STATE.currentFilter = filterType;
    STATE.currentPage = 1;
    
    if (!filterType) {
        STATE.filteredImages = STATE.allImages.slice();
    } else {
        STATE.filteredImages = STATE.allImages.filter(img => img.type === filterType);
    }
    
    renderGallery();
}

// Render gallery
function renderGallery() {
    const start = 0;
    const end = STATE.currentPage * STATE.itemsPerPage;
    const imagesToShow = STATE.filteredImages.slice(start, end);

    if (STATE.currentView === 'grid') {
        renderGridView(imagesToShow);
    } else {
        renderListView(imagesToShow);
    }

    // Show/hide load more button
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.style.display = end >= STATE.filteredImages.length ? 'none' : 'block';
    }
}

function renderGridView(images) {
    const container = document.getElementById('gallery-grid');
    container.innerHTML = images.map((img, idx) => `
        <div class="gallery-item" onclick="openModal(${STATE.allImages.indexOf(img)})">
            <img src="${img.thumb}" alt="${img.description}" loading="lazy">
            <div class="gallery-overlay">
                <div class="gallery-overlay-time">${new Date(img.timestamp).toLocaleString()}</div>
                <span class="gallery-overlay-type">${ALERT_TYPES[img.type]?.label || img.type}</span>
            </div>
        </div>
    `).join('');
}

function renderListView(images) {
    const container = document.getElementById('gallery-list');
    container.innerHTML = images.map((img) => `
        <div class="list-item" onclick="openModal(${STATE.allImages.indexOf(img)})">
            <div class="list-item-thumb">
                <img src="${img.thumb}" alt="${img.description}">
            </div>
            <div class="list-item-content">
                <div class="list-item-title">${new Date(img.timestamp).toLocaleString()}</div>
                <div class="list-item-meta">
                    <span class="list-item-type">${ALERT_TYPES[img.type]?.label || img.type}</span>
                    <span>${img.description.substring(0, 60)}...</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Modal
function openModal(index) {
    STATE.currentImageIndex = index;
    const img = STATE.allImages[index];
    
    document.getElementById('modalImage').src = img.full;
    document.getElementById('modalTitle').textContent = new Date(img.timestamp).toLocaleString();
    document.getElementById('modalTime').textContent = formatDate(new Date(img.timestamp));
    document.getElementById('modalDescription').textContent = img.description;
    
    const metricsHtml = Object.entries(img.metrics || {})
        .map(([key, value]) => `
            <div class="metric-row">
                <span class="metric-label">${formatMetricName(key)}:</span>
                <span class="metric-value">${formatMetricValue(key, value)}</span>
            </div>
        `).join('');
    document.getElementById('modalMetrics').innerHTML = metricsHtml;
    
    document.getElementById('imageModal').classList.add('active');
}

function closeModal() {
    document.getElementById('imageModal').classList.remove('active');
}

function showPrevImage() {
    if (STATE.currentImageIndex > 0) {
        openModal(STATE.currentImageIndex - 1);
    }
}

function showNextImage() {
    if (STATE.currentImageIndex < STATE.allImages.length - 1) {
        openModal(STATE.currentImageIndex + 1);
    }
}

// Calendar
function renderCalendar() {
    const year = STATE.calendarDate.getFullYear();
    const month = STATE.calendarDate.getMonth();
    
    document.getElementById('calendar-month').textContent = 
        STATE.calendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    let html = '<div class="calendar-grid">';
    
    // Day headers
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => {
        html += `<div class="calendar-day-header">${day}</div>`;
    });
    
    // Days
    let currentDate = new Date(startDate);
    while (currentDate.getMonth() !== month || currentDate.getDay() !== 0) {
        const dateStr = currentDate.toLocaleDateString();
        const isOtherMonth = currentDate.getMonth() !== month;
        const hasEvents = STATE.imagesByDate[dateStr] && STATE.imagesByDate[dateStr].length > 0;
        
        html += `
            <div class="calendar-day ${isOtherMonth ? 'other-month' : ''} ${hasEvents ? 'has-events' : ''}"
                 onclick="showCalendarDay('${dateStr}')">
                ${currentDate.getDate()}
            </div>
        `;
        
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    html += '</div>';
    document.getElementById('calendar').innerHTML = html;
    
    // Update info
    updateCalendarInfo();
}

function showCalendarDay(dateStr) {
    const images = STATE.imagesByDate[dateStr] || [];
    const date = new Date(dateStr);
    document.getElementById('calendar-selected').textContent = 
        images.length > 0 
            ? `${images.length} alert${images.length !== 1 ? 's' : ''} on ${date.toLocaleDateString()}`
            : `No alerts on ${date.toLocaleDateString()}`;
}

function updateCalendarInfo() {
    const today = new Date().toLocaleDateString();
    const todayImages = STATE.imagesByDate[today] || [];
    document.getElementById('calendar-selected').textContent = 
        todayImages.length > 0
            ? `${todayImages.length} alert${todayImages.length !== 1 ? 's' : ''} today`
            : 'No alerts today';
}

// Stats
function updateStats() {
    const now = new Date();
    const today = now.toLocaleDateString();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const todayImages = STATE.allImages.filter(img => new Date(img.timestamp).toLocaleDateString() === today);
    const weekImages = STATE.allImages.filter(img => new Date(img.timestamp) >= weekAgo);
    const monthImages = STATE.allImages.filter(img => new Date(img.timestamp) >= monthAgo);
    
    document.getElementById('stat-total').textContent = STATE.allImages.length;
    document.getElementById('stat-today').textContent = todayImages.length;
    document.getElementById('stat-week').textContent = weekImages.length;
    document.getElementById('stat-month').textContent = monthImages.length;
    
    // Type chart
    const typeCounts = {};
    STATE.allImages.forEach(img => {
        typeCounts[img.type] = (typeCounts[img.type] || 0) + 1;
    });
    
    const typeChartHtml = Object.entries(typeCounts).map(([type, count]) => `
        <div style="margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span>${ALERT_TYPES[type]?.label || type}</span>
                <span style="color: var(--accent-light); font-weight: 600;">${count}</span>
            </div>
            <div style="background: var(--primary); border-radius: 0.25rem; height: 20px; overflow: hidden;">
                <div style="background: ${ALERT_TYPES[type]?.color || 'var(--accent)'}; height: 100%; width: ${(count / STATE.allImages.length) * 100}%; transition: width 0.3s;"></div>
            </div>
        </div>
    `).join('');
    document.getElementById('chart-type').innerHTML = typeChartHtml;
    
    // Hourly activity (last 7 days)
    const hourCounts = new Array(24).fill(0);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    STATE.allImages.forEach(img => {
        const imgDate = new Date(img.timestamp);
        if (imgDate >= sevenDaysAgo) {
            hourCounts[imgDate.getHours()]++;
        }
    });
    
    const maxHourCount = Math.max(...hourCounts, 1);
    const hoursChartHtml = hourCounts.map((count, hour) => `
        <div style="text-align: center; flex: 1;">
            <div style="background: var(--primary); border-radius: 0.25rem; height: 100px; margin-bottom: 0.5rem; display: flex; align-items: flex-end; justify-content: center;">
                <div style="background: var(--accent); width: 80%; height: ${(count / maxHourCount) * 100}%; border-radius: 0.25rem; transition: height 0.3s;"></div>
            </div>
            <small style="color: var(--text-muted);">${hour}h</small>
        </div>
    `).join('');
    document.getElementById('chart-hours').innerHTML = `<div style="display: flex; gap: 0.25rem; align-items: flex-end; height: 150px;">${hoursChartHtml}</div>`;
}

// Utilities
function formatDate(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('en-US', options);
}

function formatMetricName(name) {
    return name
        .replace(/_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
}

function formatMetricValue(key, value) {
    if (typeof value === 'number') {
        if (key.includes('fraction') || key.includes('ratio')) {
            return `${(value * 100).toFixed(1)}%`;
        }
        if (key.includes('delta') || key.includes('brightness') || key.includes('score')) {
            return value.toFixed(2);
        }
        return value.toFixed(2);
    }
    return String(value);
}
