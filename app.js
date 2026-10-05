/* ====================================
   ParkSmart – app.js
   Complete Smart Parking App Logic
   ==================================== */

'use strict';

// ============================================================
// DATA
// ============================================================
const PARKING_DATA = [
  {
    id: 'P001', name: 'Central Garage', addr: '12 MG Road, Near Metro Station',
    lat: 0.46, lng: 0.52, type: 'mall',
    total: 80, available: 32, ev: 6, covered: true, handicap: true,
    priceHour: 40, priceDay: 320, rating: 4.8, reviews: 214,
    floors: 3, features: ['CCTV', 'Lift', 'Security', 'Car Wash'],
    openHours: '24/7', dist: 0.4,
    slots: genSlots(80, 6, 3),
  },
  {
    id: 'P002', name: 'Metro Plaza Parking', addr: '5 Bund Garden Road',
    lat: 0.38, lng: 0.65, type: 'street',
    total: 40, available: 3, ev: 2, covered: false, handicap: true,
    priceHour: 20, priceDay: 160, rating: 4.2, reviews: 98,
    floors: 1, features: ['CCTV', 'Security'],
    openHours: '6 AM – 11 PM', dist: 0.8,
    slots: genSlots(40, 2, 1),
  },
  {
    id: 'P003', name: 'Airport Parking Zone', addr: 'Pune International Airport',
    lat: 0.25, lng: 0.3, type: 'airport',
    total: 200, available: 54, ev: 12, covered: true, handicap: true,
    priceHour: 80, priceDay: 600, rating: 4.6, reviews: 512,
    floors: 5, features: ['CCTV', 'Lift', 'Security', 'EV Charging', 'Car Wash', 'Valet'],
    openHours: '24/7', dist: 1.2,
    slots: genSlots(200, 12, 5),
  },
  {
    id: 'P004', name: 'City Hospital Lot', addr: '44 Deccan Gymkhana',
    lat: 0.7, lng: 0.42, type: 'hospital',
    total: 60, available: 0, ev: 0, covered: false, handicap: true,
    priceHour: 15, priceDay: 120, rating: 3.9, reviews: 63,
    floors: 1, features: ['CCTV', 'Security'],
    openHours: '24/7', dist: 1.5,
    slots: genSlots(60, 0, 1),
  },
  {
    id: 'P005', name: 'Phoenix Mall Parking', addr: 'Nagar Road, Phoenix Market City',
    lat: 0.58, lng: 0.72, type: 'mall',
    total: 300, available: 112, ev: 18, covered: true, handicap: true,
    priceHour: 30, priceDay: 250, rating: 4.7, reviews: 830,
    floors: 4, features: ['CCTV', 'Lift', 'Security', 'EV Charging', 'Car Wash'],
    openHours: '10 AM – 10 PM', dist: 2.1,
    slots: genSlots(300, 18, 4),
  },
  {
    id: 'P006', name: 'FC Road Multi-Level', addr: 'Fergusson College Road',
    lat: 0.62, lng: 0.3, type: 'mall',
    total: 100, available: 17, ev: 4, covered: true, handicap: false,
    priceHour: 25, priceDay: 200, rating: 4.4, reviews: 175,
    floors: 3, features: ['CCTV', 'Lift', 'EV Charging'],
    openHours: '7 AM – 11 PM', dist: 2.8,
    slots: genSlots(100, 4, 3),
  },
  {
    id: 'P007', name: 'Koregaon Park Open Lot', addr: 'Lane 5, Koregaon Park',
    lat: 0.55, lng: 0.58, type: 'street',
    total: 25, available: 8, ev: 0, covered: false, handicap: false,
    priceHour: 10, priceDay: 80, rating: 3.5, reviews: 34,
    floors: 1, features: ['Security'],
    openHours: '8 AM – 10 PM', dist: 0.6,
    slots: genSlots(25, 0, 1),
  },
];

function genSlots(total, evCount, floors) {
  const slots = [];
  const perFloor = Math.ceil(total / floors);
  let id = 1;
  for (let f = 0; f < floors; f++) {
    const count = Math.min(perFloor, total - f * perFloor);
    for (let s = 0; s < count; s++) {
      const isEV = evCount > 0 && s < Math.ceil(evCount / floors);
      const occupancyRate = 0.45;
      const occ = Math.random() < occupancyRate;
      slots.push({
        id: `${String.fromCharCode(65 + f)}${String(id).padStart(2, '0')}`,
        floor: f,
        isEV,
        occupied: occ,
      });
      id++;
    }
  }
  return slots;
}

const BOOKINGS = {
  active: [
    {
      id: 'BK001', parkingId: 'P001', parkingName: 'Central Garage',
      slot: 'A05', floor: 'Ground',
      startTime: new Date(Date.now() - 45 * 60000), duration: 120,
      vehicle: 'MH12-AB-1234', amount: 80, status: 'parked',
    }
  ],
  upcoming: [
    {
      id: 'BK002', parkingId: 'P005', parkingName: 'Phoenix Mall Parking',
      slot: 'C12', floor: '3rd Floor',
      startTime: new Date(Date.now() + 3 * 3600000), duration: 180,
      vehicle: 'MH12-AB-1234', amount: 90, status: 'upcoming',
    }
  ],
  history: [
    {
      id: 'BK003', parkingId: 'P003', parkingName: 'Airport Parking Zone',
      slot: 'B07', floor: '2nd Floor',
      startTime: new Date(Date.now() - 2 * 86400000), duration: 360,
      vehicle: 'MH12-AB-1234', amount: 480, status: 'completed',
    },
    {
      id: 'BK004', parkingId: 'P002', parkingName: 'Metro Plaza Parking',
      slot: 'A03', floor: 'Ground',
      startTime: new Date(Date.now() - 5 * 86400000), duration: 60,
      vehicle: 'MH12-AB-1234', amount: 20, status: 'completed',
    },
    {
      id: 'BK005', parkingId: 'P007', parkingName: 'Koregaon Park Open Lot',
      slot: 'A08', floor: 'Ground',
      startTime: new Date(Date.now() - 7 * 86400000), duration: 90,
      vehicle: 'MH12-AB-1234', amount: 15, status: 'cancelled',
    },
  ]
};

// ============================================================
// STATE
// ============================================================
let state = {
  activeView: 'map',
  selectedParking: null,
  selectedSlot: null,
  selectedFloor: 0,
  reservationData: { duration: 2, vehicle: 'MH12-AB-1234', plate: 'MH12-AB-1234' },
  paymentMethod: 'upi',
  bookingTab: 'active',
  timerRunning: false,
  timerStart: null,
  timerDuration: 120,
  timerInterval: null,
  mapZoom: 1,
  evOnly: false,
  filterChip: 'all',
  activeCategory: 'all',
  issueType: null,
  issueSeverity: 'medium',
};

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.getElementById('splash-screen').style.display = 'none';
    document.getElementById('app').classList.remove('hidden');
    initMap();
    renderParkingList();
    renderFindList();
    renderBookingContent();
    // start active booking timer display
    if (BOOKINGS.active.length > 0) {
      startTimerPill();
    }
  }, 3000);
});

// ============================================================
// VIEW SWITCHING
// ============================================================
function switchView(view) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById(`view-${view}`).classList.add('active');
  document.getElementById(`nav-${view}`).classList.add('active');
  state.activeView = view;
  if (view === 'booking') renderBookingContent();
}

// ============================================================
// MAP RENDERING
// ============================================================
function initMap() {
  const canvas = document.getElementById('map-canvas');
  const ctx = canvas.getContext('2d');
  const container = document.getElementById('map-container');
  
  function resize() {
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    drawMap(ctx, canvas.width, canvas.height);
  }

  resize();
  window.addEventListener('resize', resize);
  renderMapPins();
}

function drawMap(ctx, w, h) {
  ctx.clearRect(0, 0, w, h);
  
  // Background
  ctx.fillStyle = '#0e1218';
  ctx.fillRect(0, 0, w, h);
  
  // Grid / city blocks
  const colors = {
    block: '#141820',
    road: '#1a1f2c',
    roadLight: '#1e2435',
    park: '#0f1a15',
    water: '#0d1520',
  };
  
  // Draw roads
  ctx.strokeStyle = colors.road;
  ctx.lineWidth = 16;
  
  const roads = [
    // horizontal
    [0, h*0.25, w, h*0.25], [0, h*0.5, w, h*0.5], [0, h*0.75, w, h*0.75],
    [0, h*0.12, w, h*0.12], [0, h*0.62, w, h*0.62],
    // vertical
    [w*0.2, 0, w*0.2, h], [w*0.45, 0, w*0.45, h], [w*0.7, 0, w*0.7, h],
    [w*0.85, 0, w*0.85, h], [w*0.1, 0, w*0.1, h],
  ];
  
  roads.forEach(([x1, y1, x2, y2]) => {
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
    ctx.stroke();
  });
  
  // Road center lines
  ctx.strokeStyle = '#252d42';
  ctx.lineWidth = 1;
  ctx.setLineDash([12, 8]);
  roads.forEach(([x1, y1, x2, y2]) => {
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
    ctx.stroke();
  });
  ctx.setLineDash([]);
  
  // City blocks
  const blocks = [
    [w*0.22, h*0.27, w*0.2, h*0.2],
    [w*0.47, h*0.27, w*0.2, h*0.2],
    [w*0.22, h*0.52, w*0.2, h*0.2],
    [w*0.47, h*0.52, w*0.2, h*0.2],
    [w*0.72, h*0.27, w*0.1, h*0.2],
    [w*0.72, h*0.52, w*0.1, h*0.2],
    [w*0.12, h*0.14, w*0.06, h*0.1],
    [w*0.72, h*0.14, w*0.1, h*0.1],
    [w*0.22, h*0.77, w*0.2, h*0.2],
    [w*0.47, h*0.77, w*0.2, h*0.2],
  ];
  
  blocks.forEach(([x, y, bw, bh]) => {
    ctx.fillStyle = colors.block;
    ctx.strokeStyle = '#1e2538';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(x, y, bw, bh, 3);
    ctx.fill(); ctx.stroke();
  });
  
  // Park area
  ctx.fillStyle = 'rgba(34,197,94,0.04)';
  ctx.strokeStyle = 'rgba(34,197,94,0.1)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(w*0.02, h*0.52, w*0.15, h*0.2, 4);
  ctx.fill(); ctx.stroke();
  
  // Street labels
  ctx.fillStyle = '#2e3558';
  ctx.font = `bold ${Math.max(8, w*0.025)}px Inter, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('MG Road', w*0.5, h*0.24);
  ctx.fillText('FC Road', w*0.5, h*0.49);
  ctx.fillText('Bund Garden Rd', w*0.5, h*0.74);
  ctx.textAlign = 'left';
}

function renderMapPins() {
  const container = document.getElementById('map-pins');
  const map = document.getElementById('map-container');
  container.innerHTML = '';
  
  PARKING_DATA.forEach((p, i) => {
    const pin = document.createElement('div');
    pin.className = 'map-pin';
    pin.style.left = (p.lng * 100) + '%';
    pin.style.top = (p.lat * 100) + '%';
    pin.style.animationDelay = (i * 0.06) + 's';
    
    let colorClass = p.available > 10 ? 'green' : p.available > 0 ? 'amber' : 'red';
    if (p.ev > 0 && state.evOnly) colorClass = 'blue';
    if (state.evOnly && p.ev === 0) { pin.style.opacity = '0.3'; }
    
    const label = p.ev > 0 ? `⚡${p.available}` : p.available;
    
    pin.innerHTML = `<div class="pin-bubble ${colorClass}" style="border-bottom-color: inherit">${label}</div>`;
    pin.addEventListener('click', () => openParkingDetail(p.id));
    container.appendChild(pin);
  });
}

function centerMap() { showToast('📍 Centered on your location', 'info'); }
function zoomIn() { showToast('🔍 Zoomed in', 'info'); }
function zoomOut() { showToast('🔍 Zoomed out', 'info'); }
function toggleEVFilter() {
  state.evOnly = !state.evOnly;
  const btn = document.getElementById('ev-toggle-btn');
  btn.classList.toggle('active', state.evOnly);
  renderMapPins();
  showToast(state.evOnly ? '⚡ EV filter ON' : 'EV filter OFF', 'info');
}
function focusSearch() { switchView('find'); setTimeout(() => document.getElementById('find-input').focus(), 100); }
function toggleChip(el, filter) {
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  state.filterChip = filter;
  renderParkingList();
}

// ============================================================
// PARKING LIST (Map Bottom Sheet)
// ============================================================
function renderParkingList() {
  const container = document.getElementById('parking-list');
  let data = [...PARKING_DATA].sort((a, b) => a.dist - b.dist);
  
  if (state.filterChip === 'available') data = data.filter(p => p.available > 0);
  if (state.filterChip === 'ev') data = data.filter(p => p.ev > 0);
  if (state.filterChip === 'covered') data = data.filter(p => p.covered);
  if (state.filterChip === 'cheap') data = data.sort((a, b) => a.priceHour - b.priceHour);
  
  container.innerHTML = data.map(p => buildParkingCard(p)).join('');
}

function buildParkingCard(p) {
  const avClass = p.available > 10 ? 'avail' : p.available > 0 ? 'few' : 'full';
  const avBadge = p.available > 10 ? 'green' : p.available > 0 ? 'amber' : 'red';
  const avLabel = p.available > 0 ? `${p.available} Available` : 'Full';
  const evBadge = p.ev > 0 ? `<span class="badge blue"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>${p.ev} EV</span>` : '';
  const covBadge = p.covered ? `<span class="badge teal">🏠 Covered</span>` : '';
  const btnLabel = p.available === 0 ? 'Full' : 'Reserve';
  const btnClass = p.available === 0 ? 'btn-disabled' : 'btn-primary-sm';
  const btnDisabled = p.available === 0 ? 'disabled' : '';
  
  return `
    <div class="parking-card ${avClass}" onclick="openParkingDetail('${p.id}')">
      <div class="card-top">
        <div>
          <p class="card-name">${p.name}</p>
          <p class="card-addr">${p.addr}</p>
          <div class="card-badges">
            <span class="badge ${avBadge}"><span class="dot ${avBadge} sm"></span>${avLabel}</span>
            ${evBadge}${covBadge}
          </div>
        </div>
        <div>
          <div class="card-distance">${p.dist} km<small>${Math.round(p.dist * 12)} min</small></div>
        </div>
      </div>
      <div class="card-bottom">
        <div>
          <div class="card-price">₹${p.priceHour}<span>/hr</span></div>
          <div class="card-rating">★ ${p.rating} (${p.reviews})</div>
        </div>
        <div class="card-actions">
          <button class="btn-sm btn-outline" onclick="event.stopPropagation(); openNavModal('${p.id}')">Navigate</button>
          <button class="btn-sm ${btnClass}" ${btnDisabled} onclick="event.stopPropagation(); ${p.available > 0 ? `openSlotSelection('${p.id}')` : ''}">
            ${btnLabel}
          </button>
        </div>
      </div>
    </div>`;
}

// ============================================================
// FIND LIST
// ============================================================
function renderFindList() {
  const container = document.getElementById('find-list');
  const query = (document.getElementById('find-input')?.value || '').toLowerCase();
  let data = [...PARKING_DATA].sort((a, b) => a.dist - b.dist);
  
  if (state.activeCategory !== 'all') data = data.filter(p => p.type === state.activeCategory);
  if (query) data = data.filter(p => p.name.toLowerCase().includes(query) || p.addr.toLowerCase().includes(query));
  
  if (data.length === 0) {
    container.innerHTML = `<div class="empty-state"><div class="empty-icon">🔍</div><p class="empty-title">No Results</p><p class="empty-sub">Try a different search term</p></div>`;
    return;
  }
  
  container.innerHTML = data.map(p => {
    const avColor = p.available > 10 ? 'green' : p.available > 0 ? 'amber' : 'red';
    const icons = { mall: '🏬', airport: '✈️', hospital: '🏥', street: '🛣️' };
    return `
      <div class="find-card" onclick="openParkingDetail('${p.id}')">
        <div class="find-card-icon ${avColor}">${icons[p.type] || '🅿️'}</div>
        <div class="find-card-body">
          <p class="find-card-name">${p.name}</p>
          <p class="find-card-addr">${p.addr}</p>
          <div class="find-card-meta">
            <span class="badge ${avColor}"><span class="dot ${avColor} sm"></span>${p.available} spots</span>
            ${p.ev > 0 ? `<span class="badge blue">⚡ ${p.ev} EV</span>` : ''}
            ${p.covered ? `<span class="badge teal">Covered</span>` : ''}
          </div>
        </div>
        <div class="find-card-right">
          <div class="find-card-price">₹${p.priceHour}/hr</div>
          <div class="find-card-dist">${p.dist} km</div>
          <div class="card-rating" style="font-size:0.7rem;margin-top:2px">★ ${p.rating}</div>
        </div>
      </div>`;
  }).join('');
}

function filterParkingList() { renderFindList(); }
function setCat(el, cat) {
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  state.activeCategory = cat;
  renderFindList();
}

// ============================================================
// PARKING DETAIL MODAL
// ============================================================
function openParkingDetail(id) {
  const p = PARKING_DATA.find(x => x.id === id);
  if (!p) return;
  state.selectedParking = p;
  
  const avClass = p.available > 10 ? 'green' : p.available > 0 ? 'amber' : 'red';
  const content = `
    <div class="mheader">
      <button class="mheader-back" onclick="closeModal('modal-detail')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <h3>${p.name}</h3>
    </div>
    <div class="detail-hero">
      <p class="detail-name">${p.name}</p>
      <p class="detail-addr">📍 ${p.addr}</p>
      <div class="detail-stats">
        <div class="dstat">
          <div class="dstat-val ${avClass}">${p.available}</div>
          <div class="dstat-lbl">Available</div>
        </div>
        <div class="dstat">
          <div class="dstat-val red">${p.total - p.available}</div>
          <div class="dstat-lbl">Occupied</div>
        </div>
        <div class="dstat">
          <div class="dstat-val blue">${p.ev}</div>
          <div class="dstat-lbl">EV Spots</div>
        </div>
        <div class="dstat">
          <div class="dstat-val" style="color:var(--amber)">★${p.rating}</div>
          <div class="dstat-lbl">${p.reviews} Reviews</div>
        </div>
      </div>
    </div>

    <div class="detail-section">
      <p class="detail-section-title">Amenities</p>
      <div class="amenity-grid">
        ${[
          { icon: '🏠', label: 'Covered', has: p.covered },
          { icon: '⚡', label: 'EV Charging', has: p.ev > 0 },
          { icon: '♿', label: 'Accessible', has: p.handicap },
          { icon: '📹', label: 'CCTV', has: p.features.includes('CCTV') },
          { icon: '🛗', label: 'Elevator', has: p.features.includes('Lift') },
          { icon: '🛡️', label: 'Security', has: p.features.includes('Security') },
          { icon: '🚿', label: 'Car Wash', has: p.features.includes('Car Wash') },
          { icon: '🚘', label: 'Valet', has: p.features.includes('Valet') },
        ].map(a => `
          <div class="amenity-item ${a.has ? 'yes' : ''}">
            <span class="amen-icon">${a.has ? a.icon : '❌'}</span>
            <span>${a.label}</span>
          </div>`).join('')}
      </div>
    </div>

    <div class="detail-section">
      <p class="detail-section-title">Pricing</p>
      <div class="price-row"><span class="price-label">Per Hour</span><span class="price-val">₹${p.priceHour}</span></div>
      <div class="price-row"><span class="price-label">Per Day</span><span class="price-val">₹${p.priceDay}</span></div>
      <div class="price-row"><span class="price-label">EV Charging</span><span class="price-val">${p.ev > 0 ? '₹8/kWh' : 'N/A'}</span></div>
      <div class="price-row"><span class="price-label">Open Hours</span><span class="price-val">${p.openHours}</span></div>
      <div class="price-row"><span class="price-label">Floors</span><span class="price-val">${p.floors}</span></div>
    </div>

    <div class="detail-cta">
      ${p.available === 0
        ? `<button class="btn-full outline" style="flex:0.4" onclick="openNavModal('${p.id}')">📍 Navigate</button>
           <button class="btn-full danger" style="flex:0.6" disabled>🅿️ Lot Full</button>`
        : `<button class="btn-full outline" style="flex:0.4" onclick="closeModal('modal-detail'); openNavModal('${p.id}')">📍 Navigate</button>
           <button class="btn-full primary" style="flex:0.6" onclick="closeModal('modal-detail'); openSlotSelection('${p.id}')">
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
             Reserve Slot
           </button>`
      }
    </div>`;
  
  document.getElementById('detail-content').innerHTML = content;
  openModal('modal-detail');
}

// ============================================================
// SLOT SELECTION MODAL
// ============================================================
function openSlotSelection(id) {
  const p = PARKING_DATA.find(x => x.id === id);
  if (!p) return;
  state.selectedParking = p;
  state.selectedSlot = null;
  state.selectedFloor = 0;
  renderSlotModal(p);
  openModal('modal-slots');
}

function renderSlotModal(p) {
  const floorSlots = p.slots.filter(s => s.floor === state.selectedFloor);
  const floorLabels = Array.from({ length: p.floors }, (_, i) => ['Ground', '1st', '2nd', '3rd', '4th', '5th'][i]);
  
  const slotsHTML = floorSlots.map(s => {
    let cls = s.occupied ? 'occ' : (s.isEV ? 'ev' : 'avail');
    if (state.selectedSlot?.id === s.id) cls = 'selected';
    const evIcon = s.isEV ? `<span class="ev-icon">⚡</span>` : '';
    return `<div class="slot-cell ${cls}" onclick="${s.occupied ? '' : `selectSlot('${s.id}')`}" title="${s.id}">
      ${evIcon}
      <span class="slot-num">${s.id}</span>
      <span class="slot-type">${s.isEV ? 'EV' : ''}</span>
    </div>`;
  }).join('');
  
  const selectedInfo = state.selectedSlot
    ? `<div class="slot-selected-info">
        <div>
          <p class="slot-sel-name">Slot ${state.selectedSlot.id}</p>
          <p class="slot-sel-meta">${floorLabels[state.selectedFloor]} Floor • ${state.selectedSlot.isEV ? '⚡ EV Spot' : 'Standard'}</p>
        </div>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      </div>`
    : `<div style="padding:10px;text-align:center;color:var(--text-muted);font-size:0.82rem;margin-bottom:12px">👆 Tap a slot to select</div>`;
  
  const content = `
    <div class="mheader">
      <button class="mheader-back" onclick="closeModal('modal-slots')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <h3>Select Slot – ${p.name}</h3>
    </div>
    <div class="slot-legend">
      <div class="legend-item"><div class="legend-box avail"></div>Available</div>
      <div class="legend-item"><div class="legend-box occ"></div>Occupied</div>
      <div class="legend-item"><div class="legend-box ev"></div>EV</div>
      <div class="legend-item"><div class="legend-box selected"></div>Selected</div>
    </div>
    <div class="floor-tabs">
      ${floorLabels.map((lbl, i) => `
        <button class="floor-tab ${i === state.selectedFloor ? 'active' : ''}" onclick="switchFloor(${i})">${lbl} Floor</button>
      `).join('')}
    </div>
    <div class="slot-grid">${slotsHTML}</div>
    <div class="slot-cta">
      ${selectedInfo}
      <button class="btn-full primary" onclick="state.selectedSlot ? (closeModal('modal-slots'), openReservation()) : showToast('Please select a slot first', 'error')" ${state.selectedSlot ? '' : 'style="opacity:0.5"'}>
        Continue to Reserve
      </button>
    </div>`;
  
  document.getElementById('slots-content').innerHTML = content;
}

function switchFloor(floor) {
  state.selectedFloor = floor;
  state.selectedSlot = null;
  renderSlotModal(state.selectedParking);
}

function selectSlot(slotId) {
  const slot = state.selectedParking.slots.find(s => s.id === slotId);
  if (!slot || slot.occupied) return;
  state.selectedSlot = slot;
  renderSlotModal(state.selectedParking);
  showToast(`✓ Slot ${slotId} selected`, 'success');
}

// ============================================================
// RESERVATION MODAL
// ============================================================
function openReservation() {
  const p = state.selectedParking;
  const slot = state.selectedSlot;
  const floorLabels = ['Ground', '1st', '2nd', '3rd', '4th', '5th'];
  
  function calcTotal(dur) {
    const base = p.priceHour * dur;
    const convenience = 5;
    const gst = Math.round(base * 0.18);
    return { base, convenience, gst, total: base + convenience + gst };
  }
  
  function buildReserveHTML() {
    const dur = state.reservationData.duration;
    const fees = calcTotal(dur);
    return `
      <div class="mheader">
        <button class="mheader-back" onclick="closeModal('modal-reserve'); openSlotSelection('${p.id}')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h3>Reserve Slot ${slot.id}</h3>
      </div>
      <div class="reserve-form">
        <div class="rfield">
          <label class="rfield-label">Parking Location</label>
          <div style="padding:10px 14px;background:var(--surface);border-radius:var(--radius-md);font-size:0.875rem;color:var(--text-secondary)">
            📍 ${p.name} – Slot <strong style="color:var(--teal)">${slot.id}</strong> (${floorLabels[slot.floor]} Floor)
          </div>
        </div>
        <div class="rfield">
          <label class="rfield-label">Vehicle</label>
          <select class="rfield-select" id="res-vehicle" onchange="state.reservationData.plate = this.value">
            <option value="MH12-AB-1234">🚗 MH12-AB-1234 (Honda City)</option>
            <option value="MH12-CD-5678">🚙 MH12-CD-5678 (Tata Nexon EV)</option>
          </select>
        </div>
        <div class="rfield">
          <label class="rfield-label">Duration</label>
          <div class="duration-btns">
            ${[1, 2, 3, 4, 6, 8].map(d => `
              <button class="dur-btn ${state.reservationData.duration === d ? 'active' : ''}" onclick="setDuration(${d})">${d}h</button>
            `).join('')}
          </div>
        </div>
        <div class="rfield-row">
          <div class="rfield">
            <label class="rfield-label">Date</label>
            <input type="date" class="rfield-input" id="res-date" value="${new Date().toISOString().split('T')[0]}" />
          </div>
          <div class="rfield">
            <label class="rfield-label">Start Time</label>
            <input type="time" class="rfield-input" id="res-time" value="${new Date().toTimeString().slice(0,5)}" />
          </div>
        </div>
        <div class="price-summary" id="price-summary">
          <div class="ps-row"><span class="ps-label">₹${p.priceHour}/hr × ${dur} hr</span><span class="ps-val">₹${fees.base}</span></div>
          <div class="ps-row"><span class="ps-label">Convenience Fee</span><span class="ps-val">₹${fees.convenience}</span></div>
          <div class="ps-row"><span class="ps-label">GST (18%)</span><span class="ps-val">₹${fees.gst}</span></div>
          <div class="ps-row"><span class="ps-label">Total</span><span class="ps-val ps-total">₹${fees.total}</span></div>
        </div>
        <button class="btn-full primary" style="margin-bottom:16px" onclick="closeModal('modal-reserve'); openPayment()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
          Proceed to Payment
        </button>
      </div>`;
  }
  
  document.getElementById('reserve-content').innerHTML = buildReserveHTML();
  openModal('modal-reserve');
  
  window.setDuration = function(d) {
    state.reservationData.duration = d;
    const fees = calcTotal(d);
    document.getElementById('reserve-content').innerHTML = buildReserveHTML();
  };
}

// ============================================================
// PAYMENT MODAL
// ============================================================
function openPayment() {
  const p = state.selectedParking;
  const slot = state.selectedSlot;
  const dur = state.reservationData.duration;
  const base = p.priceHour * dur;
  const gst = Math.round(base * 0.18);
  const total = base + 5 + gst;
  
  const methods = [
    { id: 'upi', icon: '📱', name: 'UPI', sub: 'PhonePe, GPay, Paytm' },
    { id: 'card', icon: '💳', name: 'Credit/Debit Card', sub: 'Visa, Mastercard, RuPay' },
    { id: 'wallet', icon: '👛', name: 'ParkSmart Wallet', sub: '₹2,400 available' },
    { id: 'netbanking', icon: '🏦', name: 'Net Banking', sub: 'All major banks' },
  ];
  
  const content = `
    <div class="mheader">
      <button class="mheader-back" onclick="closeModal('modal-payment'); openReservation()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <h3>Complete Payment</h3>
    </div>
    <div style="padding: 0 16px 8px">
      <div class="price-summary" style="margin-bottom:16px">
        <div class="ps-row"><span class="ps-label">📍 ${p.name}</span></div>
        <div class="ps-row"><span class="ps-label">Slot ${slot.id} • ${dur} Hour(s)</span></div>
        <div class="ps-row" style="padding-top:8px;border-top:1px solid var(--border)">
          <span class="ps-label" style="font-size:1rem;font-weight:700">Total Amount</span>
          <span class="ps-total" style="font-size:1.3rem">₹${total}</span>
        </div>
      </div>
    </div>
    <div class="payment-methods">
      ${methods.map(m => `
        <div class="pay-method ${state.paymentMethod === m.id ? 'selected' : ''}" onclick="selectPayMethod('${m.id}')">
          <span class="pay-icon">${m.icon}</span>
          <div class="pay-info">
            <p class="pay-name">${m.name}</p>
            <p class="pay-sub">${m.sub}</p>
          </div>
          <div class="pay-radio"></div>
        </div>
      `).join('')}
    </div>
    <div style="padding:0 16px">
      <button class="btn-full primary" onclick="processPayment(${total})">
        🔒 Pay ₹${total} Securely
      </button>
      <p style="text-align:center;font-size:0.7rem;color:var(--text-muted);margin-top:10px;margin-bottom:16px">
        🔐 Secured by 256-bit SSL encryption
      </p>
    </div>`;
  
  document.getElementById('payment-content').innerHTML = content;
  openModal('modal-payment');
}

function selectPayMethod(id) {
  state.paymentMethod = id;
  document.querySelectorAll('.pay-method').forEach(m => {
    m.classList.toggle('selected', m.getAttribute('onclick').includes(id));
  });
}

function processPayment(total) {
  const btn = document.querySelector('#payment-content .btn-full');
  if (btn) { btn.textContent = '⏳ Processing...'; btn.disabled = true; }
  
  setTimeout(() => {
    closeModal('modal-payment');
    showPaymentSuccess(total);
    state.timerRunning = true;
    state.timerStart = Date.now();
    state.timerDuration = state.reservationData.duration * 60;
    startTimerPill();
    // Add to active bookings
    BOOKINGS.active.unshift({
      id: 'BK' + Date.now(),
      parkingId: state.selectedParking.id,
      parkingName: state.selectedParking.name,
      slot: state.selectedSlot.id,
      floor: ['Ground', '1st', '2nd', '3rd', '4th', '5th'][state.selectedSlot.floor] + ' Floor',
      startTime: new Date(),
      duration: state.reservationData.duration * 60,
      vehicle: state.reservationData.plate,
      amount: total,
      status: 'parked',
    });
  }, 2000);
}

function showPaymentSuccess(total) {
  const p = state.selectedParking;
  const slot = state.selectedSlot;
  const bookingId = 'BK' + Date.now().toString().slice(-6);
  
  const content = `
    <div class="success-screen">
      <div class="success-icon">🎉</div>
      <h3 class="success-title">Booking Confirmed!</h3>
      <p class="success-sub">Your parking slot has been reserved</p>
      <div class="success-details">
        <div class="success-row"><span class="success-row-lbl">Booking ID</span><span class="success-row-val gradient-text">${bookingId}</span></div>
        <div class="success-row"><span class="success-row-lbl">Location</span><span class="success-row-val">${p.name}</span></div>
        <div class="success-row"><span class="success-row-lbl">Slot</span><span class="success-row-val">${slot.id}</span></div>
        <div class="success-row"><span class="success-row-lbl">Duration</span><span class="success-row-val">${state.reservationData.duration} hour(s)</span></div>
        <div class="success-row"><span class="success-row-lbl">Amount Paid</span><span class="success-row-val" style="color:var(--teal)">₹${total}</span></div>
        <div class="success-row"><span class="success-row-lbl">Payment</span><span class="success-row-val" style="color:var(--green)">✓ Success</span></div>
      </div>
      <div style="display:flex;gap:10px">
        <button class="btn-full outline" onclick="closeModal('modal-reserve'); openNavModal('${p.id}')">📍 Navigate</button>
        <button class="btn-full primary" onclick="closeModal('modal-reserve'); openTimerModal()">⏱ View Timer</button>
      </div>
    </div>`;
  
  document.getElementById('reserve-content').innerHTML = content;
  openModal('modal-reserve');
  showToast('✓ Booking confirmed! Timer started', 'success');
}

// ============================================================
// NAVIGATION MODAL
// ============================================================
function openNavModal(id) {
  const p = PARKING_DATA.find(x => x.id === id) || state.selectedParking;
  if (!p) return;
  
  const steps = [
    { icon: '↑', desc: `Head north on MG Road`, dist: '200 m' },
    { icon: '→', desc: `Turn right onto FC Road`, dist: '350 m' },
    { icon: '↑', desc: `Continue straight for 400m`, dist: '400 m' },
    { icon: '←', desc: `Turn left – ${p.name} on right`, dist: '50 m' },
    { icon: '🅿️', desc: `Arrive at ${p.name}`, dist: '' },
  ];
  
  const content = `
    <div class="mheader">
      <button class="mheader-back" onclick="closeModal('modal-nav')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <h3>Navigate to ${p.name}</h3>
    </div>
    <div class="nav-map-preview">
      <canvas class="nav-route-canvas" id="nav-route-canvas"></canvas>
      <div class="nav-route-info">
        <span class="nav-route-badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" stroke-width="2.5"><path d="M3 12h18M12 3l9 9-9 9"/></svg>
          ${p.dist} km • ~${Math.round(p.dist * 12)} min walk
        </span>
      </div>
    </div>
    <div class="nav-steps">
      ${steps.map(s => `
        <div class="nav-step">
          <div class="nav-step-icon">${s.icon}</div>
          <div>
            <p class="nav-step-desc">${s.desc}</p>
            ${s.dist ? `<p class="nav-step-dist">${s.dist}</p>` : ''}
          </div>
        </div>`).join('')}
    </div>
    <div style="padding:16px;display:flex;gap:10px">
      <button class="btn-full outline" onclick="closeModal('modal-nav')">Cancel</button>
      <button class="btn-full primary" onclick="startNavigation('${p.id}')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
        Start Navigation
      </button>
    </div>`;
  
  document.getElementById('nav-content').innerHTML = content;
  openModal('modal-nav');
  
  setTimeout(() => {
    const canvas = document.getElementById('nav-route-canvas');
    if (canvas) drawNavRoute(canvas);
  }, 50);
}

function drawNavRoute(canvas) {
  const w = canvas.clientWidth; const h = canvas.clientHeight;
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = '#0e1218'; ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = '#1a1f2c'; ctx.lineWidth = 20;
  
  [[0, h*0.4, w, h*0.4], [w*0.35, 0, w*0.35, h]].forEach(([x1,y1,x2,y2]) => {
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  });
  
  // Route
  ctx.strokeStyle = '#00d4aa'; ctx.lineWidth = 3; ctx.setLineDash([6, 4]);
  ctx.beginPath();
  ctx.moveTo(w*0.5, h*0.75);
  ctx.lineTo(w*0.5, h*0.4);
  ctx.lineTo(w*0.35, h*0.4);
  ctx.lineTo(w*0.35, h*0.25);
  ctx.stroke(); ctx.setLineDash([]);
  
  // Start
  ctx.fillStyle = '#00d4aa'; ctx.beginPath(); ctx.arc(w*0.5, h*0.75, 7, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = 'white'; ctx.lineWidth = 2; ctx.stroke();
  
  // End
  ctx.fillStyle = '#7c3aed'; ctx.beginPath(); ctx.arc(w*0.35, h*0.25, 8, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = 'white'; ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = 'white'; ctx.font = 'bold 9px Inter'; ctx.textAlign = 'center';
  ctx.fillText('P', w*0.35, h*0.25 + 3.5);
}

function startNavigation(id) {
  closeModal('modal-nav');
  showToast('🚗 Navigation started!', 'success');
}

// ============================================================
// TIMER MODAL & PILL
// ============================================================
let pillInterval = null;
function startTimerPill() {
  const pill = document.getElementById('timer-pill');
  pill.classList.remove('hidden');
  
  if (pillInterval) clearInterval(pillInterval);
  pillInterval = setInterval(() => {
    const booking = BOOKINGS.active[0];
    if (!booking) return;
    const elapsed = Math.floor((Date.now() - booking.startTime.getTime()) / 1000);
    const remaining = Math.max(0, booking.duration * 60 - elapsed);
    document.getElementById('timer-pill-text').textContent = formatTime(remaining);
    if (remaining === 0) clearInterval(pillInterval);
  }, 1000);
}

function openTimerModal() {
  const booking = BOOKINGS.active[0];
  if (!booking) { showToast('No active parking session', 'info'); return; }
  
  const elapsed = Math.floor((Date.now() - booking.startTime.getTime()) / 1000);
  const total = booking.duration * 60;
  const remaining = Math.max(0, total - elapsed);
  const progress = (remaining / total);
  const circumference = 440;
  const dash = circumference * progress;
  const color = progress > 0.5 ? '#00d4aa' : progress > 0.25 ? '#f59e0b' : '#ef4444';
  
  const content = `
    <div class="mheader">
      <button class="mheader-back" onclick="closeModal('modal-timer')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <h3>Parking Timer</h3>
    </div>
    <div class="timer-display">
      <div class="timer-circle">
        <svg class="timer-svg" width="160" height="160" viewBox="0 0 160 160">
          <circle class="timer-track" cx="80" cy="80" r="70"/>
          <circle class="timer-progress" cx="80" cy="80" r="70"
            stroke="${color}"
            stroke-dashoffset="${circumference - dash}"
            style="stroke-dasharray:${circumference}"
            id="timer-prog-circle"/>
        </svg>
        <div>
          <div class="timer-time" id="modal-timer-disp">${formatTime(remaining)}</div>
          <span class="timer-label">Time Remaining</span>
        </div>
      </div>
    </div>
    <div class="timer-info">
      <div class="tinfo">
        <p class="tinfo-val">${booking.parkingName.split(' ')[0]}</p>
        <p class="tinfo-lbl">Location</p>
      </div>
      <div class="tinfo">
        <p class="tinfo-val">${booking.slot}</p>
        <p class="tinfo-lbl">Slot</p>
      </div>
      <div class="tinfo">
        <p class="tinfo-val">${formatTime(elapsed)}</p>
        <p class="tinfo-lbl">Elapsed</p>
      </div>
      <div class="tinfo">
        <p class="tinfo-val">₹${booking.amount}</p>
        <p class="tinfo-lbl">Total Paid</p>
      </div>
    </div>
    <div class="timer-actions">
      <button class="btn-full secondary" onclick="extendParking()">
        ⏰ Extend Time
      </button>
      <button class="btn-full danger" onclick="endParking()">
        🚗 End & Leave
      </button>
    </div>`;
  
  document.getElementById('timer-content').innerHTML = content;
  openModal('modal-timer');
  
  // Live update
  const timerInterval = setInterval(() => {
    if (!document.getElementById('modal-timer-disp')) { clearInterval(timerInterval); return; }
    const el = Math.floor((Date.now() - booking.startTime.getTime()) / 1000);
    const rem = Math.max(0, total - el);
    document.getElementById('modal-timer-disp').textContent = formatTime(rem);
    const prog = rem / total;
    const c = prog > 0.5 ? '#00d4aa' : prog > 0.25 ? '#f59e0b' : '#ef4444';
    const circle = document.getElementById('timer-prog-circle');
    if (circle) {
      circle.style.strokeDashoffset = circumference - circumference * prog;
      circle.style.stroke = c;
    }
    if (rem === 0) clearInterval(timerInterval);
  }, 1000);
}

function extendParking() {
  closeModal('modal-timer');
  showToast('🎉 Time extended by 1 hour (+₹40)', 'success');
  if (BOOKINGS.active[0]) BOOKINGS.active[0].duration += 60;
}

function endParking() {
  closeModal('modal-timer');
  const booking = BOOKINGS.active.shift();
  if (booking) {
    booking.status = 'completed';
    BOOKINGS.history.unshift(booking);
  }
  document.getElementById('timer-pill').classList.add('hidden');
  if (pillInterval) clearInterval(pillInterval);
  showToast('✓ Parking session ended. Safe travels!', 'success');
}

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

// ============================================================
// BOOKING VIEW
// ============================================================
function renderBookingContent() {
  const container = document.getElementById('booking-content');
  const tab = state.bookingTab;
  const items = BOOKINGS[tab];
  
  if (!items || items.length === 0) {
    const msgs = {
      active: { icon: '🅿️', title: 'No Active Session', sub: 'Find and reserve a parking spot to get started' },
      upcoming: { icon: '📅', title: 'No Upcoming Bookings', sub: 'Schedule your next parking reservation' },
      history: { icon: '📋', title: 'No History Yet', sub: 'Your completed bookings will appear here' },
    };
    const m = msgs[tab];
    container.innerHTML = `<div class="empty-state"><div class="empty-icon">${m.icon}</div><p class="empty-title">${m.title}</p><p class="empty-sub">${m.sub}</p></div>`;
    return;
  }
  
  container.innerHTML = items.map(b => buildBookingCard(b, tab)).join('');
  
  // Start timers for active
  if (tab === 'active') {
    items.forEach(b => {
      const el = document.getElementById(`timer-${b.id}`);
      if (!el) return;
      const upd = () => {
        const elapsed = Math.floor((Date.now() - b.startTime.getTime()) / 1000);
        const rem = Math.max(0, b.duration * 60 - elapsed);
        el.textContent = formatTime(rem);
      };
      upd();
      setInterval(upd, 1000);
    });
  }
}

function buildBookingCard(b, tab) {
  const startFmt = b.startTime.toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  const endTime = new Date(b.startTime.getTime() + b.duration * 60000);
  const endFmt = endTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const statusClass = { parked: 'parked', upcoming: 'upcoming', completed: 'completed', cancelled: 'cancelled' }[b.status];
  const statusLabel = { parked: 'Parked', upcoming: 'Upcoming', completed: 'Completed', cancelled: 'Cancelled' }[b.status];
  const cardClass = { active: 'active-card', upcoming: 'upcoming-card', history: 'history-card' }[tab];
  
  const timerSection = tab === 'active' ? `
    <div class="bcard-timer">
      <div>
        <p class="bcard-timer-label">Time Remaining</p>
        <div class="bcard-timer-disp" id="timer-${b.id}">--:--</div>
      </div>
      <button class="bcard-extend-btn" onclick="extendParking()">+ Extend</button>
    </div>` : '';
  
  const actions = tab === 'active' ? `
    <div class="bcard-actions">
      <button class="btn-block secondary" onclick="openNavModal('${b.parkingId}')">📍 Navigate</button>
      <button class="btn-block primary" onclick="openTimerModal()">⏱ Timer</button>
      <button class="btn-block danger" onclick="endParking()">🚗 End</button>
    </div>` : tab === 'upcoming' ? `
    <div class="bcard-actions">
      <button class="btn-block secondary" onclick="openNavModal('${b.parkingId}')">📍 Navigate</button>
      <button class="btn-block danger" onclick="cancelUpcoming('${b.id}')">✕ Cancel</button>
    </div>` : `
    <div class="bcard-actions">
      <button class="btn-block secondary" onclick="openParkingDetail('${b.parkingId}')">Re-book</button>
      ${b.status === 'completed' ? `<button class="btn-block secondary" onclick="showToast('Invoice sent to email ✉️','success')">📄 Invoice</button>` : ''}
    </div>`;
  
  return `
    <div class="booking-card ${cardClass}">
      <div class="bcard-header">
        <div>
          <p class="bcard-name">${b.parkingName}</p>
          <p class="bcard-slot">Slot ${b.slot} • ${b.floor}</p>
        </div>
        <span class="bcard-status ${statusClass}">${statusLabel}</span>
      </div>
      <div class="bcard-row">
        <div class="bcard-info">
          <p class="bcard-label">Check-in</p>
          <p class="bcard-val">${startFmt}</p>
        </div>
        <div class="bcard-info">
          <p class="bcard-label">Duration</p>
          <p class="bcard-val">${Math.floor(b.duration / 60)}h ${b.duration % 60 > 0 ? b.duration % 60 + 'm' : ''}</p>
        </div>
        <div class="bcard-info">
          <p class="bcard-label">Amount</p>
          <p class="bcard-val" style="color:var(--teal)">₹${b.amount}</p>
        </div>
      </div>
      ${timerSection}
      <div class="bcard-info" style="margin-bottom:10px">
        <p class="bcard-label">Vehicle</p>
        <p class="bcard-val">🚗 ${b.vehicle}</p>
      </div>
      ${actions}
    </div>`;
}

function switchBookingTab(el, tab) {
  document.querySelectorAll('.btab').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  state.bookingTab = tab;
  renderBookingContent();
}

function cancelUpcoming(id) {
  const idx = BOOKINGS.upcoming.findIndex(b => b.id === id);
  if (idx > -1) {
    const b = BOOKINGS.upcoming.splice(idx, 1)[0];
    b.status = 'cancelled';
    BOOKINGS.history.unshift(b);
    renderBookingContent();
    showToast('Booking cancelled. Refund in 2-3 days.', 'info');
  }
}

// ============================================================
// ISSUE REPORT MODAL
// ============================================================
function openIssueReport() {
  state.issueType = null;
  state.issueSeverity = 'medium';
  
  const issues = [
    { id: 'slot', icon: '🅿️', name: 'Slot Occupied' },
    { id: 'security', icon: '🛡️', name: 'Security Issue' },
    { id: 'payment', icon: '💳', name: 'Payment Failed' },
    { id: 'ev', icon: '⚡', name: 'EV Charger Down' },
    { id: 'cleanliness', icon: '🧹', name: 'Cleanliness' },
    { id: 'other', icon: '❓', name: 'Other' },
  ];
  
  const content = `
    <div class="mheader">
      <button class="mheader-back" onclick="closeModal('modal-issue')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <h3>Report an Issue</h3>
    </div>
    <div style="padding:0 16px 10px">
      <p style="font-size:0.82rem;color:var(--text-muted)">Help us improve. Tell us what went wrong.</p>
    </div>
    <p style="padding:0 16px;font-size:0.75rem;font-weight:700;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px">Issue Type</p>
    <div class="issue-types">
      ${issues.map(i => `
        <button class="issue-type" onclick="selectIssueType('${i.id}', this)">
          <span class="issue-type-icon">${i.icon}</span>
          <span class="issue-type-name">${i.name}</span>
        </button>`).join('')}
    </div>
    <div class="issue-form">
      <label style="font-size:0.75rem;font-weight:700;color:var(--text-secondary);display:block;margin-bottom:6px">Severity</label>
      <div class="issue-severity">
        <button class="severity-btn low" onclick="selectSeverity('low', this)">🟢 Low</button>
        <button class="severity-btn medium active" onclick="selectSeverity('medium', this)">🟡 Medium</button>
        <button class="severity-btn high" onclick="selectSeverity('high', this)">🔴 High</button>
      </div>
      <textarea class="issue-textarea" id="issue-desc" placeholder="Describe the issue in detail..."></textarea>
      <button class="btn-full primary" onclick="submitIssue()" style="margin-bottom:16px">
        📤 Submit Report
      </button>
    </div>`;
  
  document.getElementById('issue-content').innerHTML = content;
  openModal('modal-issue');
}

function selectIssueType(id, el) {
  state.issueType = id;
  document.querySelectorAll('.issue-type').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
}

function selectSeverity(sev, el) {
  state.issueSeverity = sev;
  document.querySelectorAll('.severity-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
}

function submitIssue() {
  if (!state.issueType) { showToast('Please select an issue type', 'error'); return; }
  closeModal('modal-issue');
  showToast('✓ Report submitted. We\'ll fix it soon!', 'success');
}

// ============================================================
// NOTIFICATIONS
// ============================================================
function showNotifications() {
  const notifs = [
    { color: 'var(--teal)', title: '⏰ Parking Reminder', body: 'Your parking at Central Garage expires in 30 minutes.', time: '2 min ago' },
    { color: 'var(--green)', title: '✓ Booking Confirmed', body: 'Slot A05 at Central Garage reserved for 2 hours.', time: '45 min ago' },
    { color: 'var(--amber)', title: '⚡ EV Charging Complete', body: 'Your vehicle at Phoenix Mall is fully charged.', time: '1 hr ago' },
    { color: 'var(--blue)', title: '💳 Payment Received', body: '₹80 paid for Central Garage booking BK001.', time: '2 hr ago' },
    { color: 'var(--purple)', title: '🎉 New Offer', body: 'Get 20% off on weekday bookings this month!', time: '1 day ago' },
  ];
  
  const content = `
    <div class="mheader">
      <button class="mheader-back" onclick="closeModal('modal-notif')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <h3>Notifications</h3>
    </div>
    ${notifs.map(n => `
      <div class="notif-item">
        <div class="notif-dot2" style="background:${n.color}"></div>
        <div>
          <p class="notif-title">${n.title}</p>
          <p class="notif-body">${n.body}</p>
          <p class="notif-time">${n.time}</p>
        </div>
      </div>`).join('')}`;
  
  document.getElementById('notif-content').innerHTML = content;
  openModal('modal-notif');
}

// ============================================================
// FILTER MODAL
// ============================================================
function openFilters() {
  const content = `
    <div class="mheader">
      <button class="mheader-back" onclick="closeModal('modal-filter')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <h3>Filter Parking</h3>
    </div>
    <div class="filter-section">
      <p class="filter-title">Max Distance</p>
      <input type="range" class="range-input" min="0.5" max="10" step="0.5" value="5" oninput="document.getElementById('dist-val').textContent=this.value+'km'" />
      <div class="range-labels"><span>0.5 km</span><span id="dist-val">5km</span><span>10 km</span></div>
    </div>
    <div class="filter-section">
      <p class="filter-title">Max Price / Hour</p>
      <input type="range" class="range-input" min="10" max="200" step="10" value="100" oninput="document.getElementById('price-val').textContent='₹'+this.value" />
      <div class="range-labels"><span>₹10</span><span id="price-val">₹100</span><span>₹200</span></div>
    </div>
    <div class="filter-section">
      <p class="filter-title">Amenities</p>
      ${[
        ['EV Charging', true],['Covered Parking', false],['24/7 Access', true],
        ['CCTV Security', true],['Car Wash', false],['Valet', false],
      ].map(([label, on]) => `
        <div class="toggle-row">
          <span class="toggle-label">${label}</span>
          <button class="toggle ${on ? 'on' : ''}" onclick="this.classList.toggle('on')"></button>
        </div>`).join('')}
    </div>
    <div style="padding:16px">
      <button class="btn-full primary" onclick="applyFilters()">Apply Filters</button>
    </div>`;
  
  document.getElementById('filter-content').innerHTML = content;
  openModal('modal-filter');
}

function applyFilters() {
  closeModal('modal-filter');
  showToast('✓ Filters applied', 'success');
  renderParkingList();
}

// ============================================================
// PROFILE MODALS
// ============================================================
function showProfileModal(type) {
  const contents = {
    vehicle: `
      <div class="mheader"><button class="mheader-back" onclick="closeModal('modal-profile')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg></button><h3>My Vehicles</h3></div>
      <div style="padding:16px">
        ${[{ plate:'MH12-AB-1234', name:'Honda City', type:'Petrol' }, { plate:'MH12-CD-5678', name:'Tata Nexon EV', type:'EV ⚡' }].map(v => `
          <div class="pmenu-item" style="margin-bottom:8px">
            <span class="pmenu-icon">🚗</span>
            <div><p style="font-weight:700">${v.name}</p><p style="font-size:0.75rem;color:var(--text-muted)">${v.plate} • ${v.type}</p></div>
            <svg class="pmenu-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          </div>`).join('')}
        <button class="btn-full primary" style="margin-top:8px">+ Add Vehicle</button>
      </div>`,
    payment: `
      <div class="mheader"><button class="mheader-back" onclick="closeModal('modal-profile')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg></button><h3>Payment Methods</h3></div>
      <div style="padding:16px">
        ${[{ icon:'📱', name:'PhonePe UPI', sub:'alex@axl' }, { icon:'💳', name:'HDFC Credit Card', sub:'**** **** **** 4521' }, { icon:'👛', name:'ParkSmart Wallet', sub:'₹2,400 balance' }].map(m => `
          <div class="pmenu-item" style="margin-bottom:8px">
            <span class="pmenu-icon">${m.icon}</span>
            <div><p style="font-weight:700">${m.name}</p><p style="font-size:0.75rem;color:var(--text-muted)">${m.sub}</p></div>
            <svg class="pmenu-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          </div>`).join('')}
        <button class="btn-full primary" style="margin-top:8px">+ Add Payment Method</button>
      </div>`,
    notifications: `
      <div class="mheader"><button class="mheader-back" onclick="closeModal('modal-profile')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg></button><h3>Notification Settings</h3></div>
      <div class="filter-section">
        ${[['Parking Reminders', true],['Booking Confirmations', true],['Payment Alerts', true],['EV Charging Updates', true],['Offers & Promotions', false],['Push Notifications', true]].map(([l,on]) => `
          <div class="toggle-row"><span class="toggle-label">${l}</span><button class="toggle ${on?'on':''}" onclick="this.classList.toggle('on')"></button></div>`).join('')}
      </div>`,
    faq: `
      <div class="mheader"><button class="mheader-back" onclick="closeModal('modal-profile')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg></button><h3>Help & FAQ</h3></div>
      <div style="padding:16px">
        ${[['How do I cancel a booking?','Go to Bookings → Upcoming → Cancel. Refund within 2-3 business days.'],['Can I extend parking time?','Yes! Open the timer and tap "Extend Time" to add more time.'],['What if my slot is taken?','Report it via the issue report button. We will reassign you immediately.'],['How does EV charging work?','Select an EV slot during booking. Charging starts automatically upon arrival.']].map(([q,a]) => `
          <div style="margin-bottom:16px">
            <p style="font-weight:700;font-size:0.88rem;margin-bottom:4px">Q: ${q}</p>
            <p style="color:var(--text-muted);font-size:0.8rem">A: ${a}</p>
          </div>`).join('')}
      </div>`,
    about: `
      <div class="mheader"><button class="mheader-back" onclick="closeModal('modal-profile')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg></button><h3>About ParkSmart</h3></div>
      <div style="text-align:center;padding:24px 16px">
        <div style="font-size:3rem;margin-bottom:8px">🅿️</div>
        <h3 class="gradient-text" style="font-size:1.4rem;font-weight:900;margin-bottom:4px">ParkSmart</h3>
        <p style="color:var(--text-muted);font-size:0.82rem;margin-bottom:16px">Version 2.4.1 • Built with ❤️</p>
        <p style="color:var(--text-secondary);font-size:0.84rem;line-height:1.6">Smart parking for modern cities. Find, reserve, and navigate to parking spots in real-time. Supporting EV charging, seamless payments, and a greener future.</p>
      </div>`,
  };
  
  document.getElementById('profile-modal-inner').innerHTML = contents[type] || '';
  openModal('modal-profile');
}

// ============================================================
// MODAL HELPERS
// ============================================================
function openModal(id) {
  document.getElementById(id).classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  document.getElementById(id).classList.add('hidden');
  document.body.style.overflow = '';
}

function closeModalOutside(e, id) {
  if (e.target.id === id) closeModal(id);
}

// ============================================================
// TOAST
// ============================================================
function showToast(msg, type = 'info') {
  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type]}</span>${msg}`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}
