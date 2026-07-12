// ==========================================
// MAIN.JS - APP INITIALIZATION & CONTROL
// ==========================================

const fabricPalette = [
  '#8a1c40', '#1e3a8a', '#0d9488', '#d97706', '#2d6a4f', '#6b1d33',
  '#ff6b6b', '#3b82f6', '#10b981', '#f59e0b', '#7c3aed', '#ef4444',
  '#ec4899', '#8b5cf6', '#06b6d4', '#f97316'
];

let selectedColor = fabricPalette[0];
let suitParams = {};
let isDarkTheme = localStorage.getItem('theme') === 'dark';

// ==========================================
// THEME MANAGEMENT
// ==========================================

function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  if (isDarkTheme) {
    document.body.classList.add('dark-theme');
  }
  themeToggle.addEventListener('click', toggleTheme);
}

function toggleTheme() {
  isDarkTheme = !isDarkTheme;
  document.body.classList.toggle('dark-theme');
  localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
  updateStatus('Theme changed!');
}

// ==========================================
// UI SETUP
// ==========================================

function setupFabricPalette() {
  const paletteNode = document.getElementById('fabric-palette');
  paletteNode.innerHTML = '';
  fabricPalette.forEach((color, idx) => {
    const dot = document.createElement('div');
    dot.className = 'fabric-dot' + (idx === 0 ? ' active' : '');
    dot.style.background = color;
    dot.title = color;
    dot.onclick = () => selectFabricColor(dot, color);
    paletteNode.appendChild(dot);
  });
}

function selectFabricColor(element, color) {
  document.querySelectorAll('.fabric-dot').forEach(dot => dot.classList.remove('active'));
  element.classList.add('active');
  selectedColor = color;
  applyMaterial();
  updateStatus('Color updated!');
}

function bindRangeInputs() {
  const inputs = ['chest', 'waist', 'hip', 'shoulder', 'neck', 'armhole', 'sleeve-length', 'suit-length', 'bottom-length'];
  
  inputs.forEach(id => {
    const element = document.getElementById(id);
    const valueDisplay = document.getElementById(id + '-val');
    
    element.addEventListener('input', () => {
      valueDisplay.textContent = element.value + '"';
      updateSuitFromMeasurements();
      calculateCutting();
    });
  });
}

function bindSelectChanges() {
  ['suit-style', 'neck-style', 'sleeve-style', 'bottom-style', 'dupatta-style', 'fabric-texture'].forEach(id => {
    document.getElementById(id).addEventListener('change', () => {
      updateStyle();
      calculateCutting();
    });
  });
}

function bindButtons() {
  document.getElementById('download-png').addEventListener('click', downloadPNG);
  document.getElementById('export-pdf').addEventListener('click', exportPDF);
  document.getElementById('save-meas').addEventListener('click', saveMeasurements);
  document.getElementById('load-meas').addEventListener('click', loadMeasurements);
  document.getElementById('reset-design').addEventListener('click', resetDesign);
  document.getElementById('calc-cut').addEventListener('click', calculateCutting);
  document.getElementById('print-cut').addEventListener('click', () => window.print());
  document.getElementById('prev-step').addEventListener('click', () => changeStep(-1));
  document.getElementById('next-step').addEventListener('click', () => changeStep(1));
  
  // Viewport controls
  document.getElementById('zoom-in').addEventListener('click', () => zoomCamera(1.2));
  document.getElementById('zoom-out').addEventListener('click', () => zoomCamera(0.8));
  document.getElementById('reset-view').addEventListener('click', resetView);
}

// ==========================================
// STYLE CONTROLLER
// ==========================================

function updateStyle() {
  const style = document.getElementById('suit-style').value;
  const neckStyle = document.getElementById('neck-style').value;
  const sleeveStyle = document.getElementById('sleeve-style').value;
  const bottomStyle = document.getElementById('bottom-style').value;
  const dupattas = document.getElementById('dupatta-style').value;

  const styleConfigs = {
    'pakistani': { topLenFactor: 1.0, flareFactor: 1.0, bottomType: 'pant' },
    'anarkali': { topLenFactor: 1.3, flareFactor: 3.0, bottomType: 'skirt' },
    'angrakha': { topLenFactor: 0.9, flareFactor: 1.1, bottomType: 'pant' },
    'palazzo': { topLenFactor: 1.0, flareFactor: 1.6, bottomType: 'palazzo' },
    'straight': { topLenFactor: 0.95, flareFactor: 0.9, bottomType: 'pant' },
    'sharara': { topLenFactor: 0.95, flareFactor: 2.2, bottomType: 'sharara' },
    'gharara': { topLenFactor: 0.85, flareFactor: 2.5, bottomType: 'sharara' },
    'salwar_kameez': { topLenFactor: 1.0, flareFactor: 1.2, bottomType: 'salwar' },
    'patiala': { topLenFactor: 0.9, flareFactor: 1.8, bottomType: 'salwar' },
    'churidar': { topLenFactor: 1.0, flareFactor: 0.95, bottomType: 'churidar' },
    'lehenga_choli': { topLenFactor: 0.4, flareFactor: 3.5, bottomType: 'skirt' },
    'a_line': { topLenFactor: 1.05, flareFactor: 1.8, bottomType: 'skirt' },
    'kaftan': { topLenFactor: 1.1, flareFactor: 2.0, bottomType: 'pant' },
    'kurta_set': { topLenFactor: 0.95, flareFactor: 1.3, bottomType: 'pant' },
    'jacket_style': { topLenFactor: 0.6, flareFactor: 1.0, bottomType: 'pant' },
    'punjabi': { topLenFactor: 0.9, flareFactor: 1.8, bottomType: 'salwar' }
  };

  const config = styleConfigs[style] || styleConfigs['pakistani'];
  suitParams = {
    ...config,
    neckStyle,
    sleeveStyle,
    bottomStyle,
    dupattas
  };

  updateSuitFromMeasurements();
  applyMaterial();
  updateStatus(`Style changed to ${style}`);
}

// ==========================================
// STATUS UPDATES
// ==========================================

function updateStatus(message) {
  const status = document.getElementById('status-msg');
  status.textContent = message;
  setTimeout(() => {
    status.textContent = 'Ready';
  }, 2500);
}

// ==========================================
// MEASUREMENT STORAGE
// ==========================================

function saveMeasurements() {
  const measurements = {
    chest: document.getElementById('chest').value,
    waist: document.getElementById('waist').value,
    hip: document.getElementById('hip').value,
    shoulder: document.getElementById('shoulder').value,
    neck: document.getElementById('neck').value,
    armhole: document.getElementById('armhole').value,
    sleeveLength: document.getElementById('sleeve-length').value,
    suitLength: document.getElementById('suit-length').value,
    bottomLength: document.getElementById('bottom-length').value,
    suitStyle: document.getElementById('suit-style').value,
    fabricColor: selectedColor,
    fabricTexture: document.getElementById('fabric-texture').value,
    timestamp: new Date().toISOString()
  };

  localStorage.setItem('suitMeasurements', JSON.stringify(measurements));
  updateStatus('Measurements saved!');
}

function loadMeasurements() {
  const saved = localStorage.getItem('suitMeasurements');
  if (!saved) {
    updateStatus('No saved measurements found');
    return;
  }

  const measurements = JSON.parse(saved);
  document.getElementById('chest').value = measurements.chest;
  document.getElementById('waist').value = measurements.waist;
  document.getElementById('hip').value = measurements.hip;
  document.getElementById('shoulder').value = measurements.shoulder;
  document.getElementById('neck').value = measurements.neck;
  document.getElementById('armhole').value = measurements.armhole;
  document.getElementById('sleeve-length').value = measurements.sleeveLength;
  document.getElementById('suit-length').value = measurements.suitLength;
  document.getElementById('bottom-length').value = measurements.bottomLength;
  document.getElementById('suit-style').value = measurements.suitStyle;
  document.getElementById('fabric-texture').value = measurements.fabricTexture;

  // Update display values
  document.getElementById('chest-val').textContent = measurements.chest + '"';
  document.getElementById('waist-val').textContent = measurements.waist + '"';
  document.getElementById('hip-val').textContent = measurements.hip + '"';
  document.getElementById('shoulder-val').textContent = measurements.shoulder + '"';
  document.getElementById('neck-val').textContent = measurements.neck + '"';
  document.getElementById('armhole-val').textContent = measurements.armhole + '"';
  document.getElementById('sleeve-length-val').textContent = measurements.sleeveLength + '"';
  document.getElementById('suit-length-val').textContent = measurements.suitLength + '"';
  document.getElementById('bottom-length-val').textContent = measurements.bottomLength + '"';

  updateStyle();
  updateStatus('Measurements loaded!');
}

function resetDesign() {
  document.getElementById('suit-style').value = 'pakistani';
  document.getElementById('neck-style').value = 'round';
  document.getElementById('sleeve-style').value = 'full';
  document.getElementById('bottom-style').value = 'straight';
  document.getElementById('dupatta-style').value = 'none';
  document.getElementById('fabric-texture').value = 'cotton';
  document.getElementById('chest').value = 38;
  document.getElementById('waist').value = 32;
  document.getElementById('hip').value = 40;
  document.getElementById('shoulder').value = 15;
  document.getElementById('neck').value = 13;
  document.getElementById('armhole').value = 18;
  document.getElementById('sleeve-length').value = 18;
  document.getElementById('suit-length').value = 42;
  document.getElementById('bottom-length').value = 38;

  selectedColor = fabricPalette[0];

  document.querySelectorAll('.fabric-dot').forEach((d, i) => {
    d.classList.toggle('active', i === 0);
  });

  ['chest', 'waist', 'hip', 'shoulder', 'neck', 'armhole', 'sleeve-length', 'suit-length', 'bottom-length'].forEach(id => {
    document.getElementById(id + '-val').textContent = document.getElementById(id).value + '"';
  });

  updateStyle();
  updateStatus('Design reset to defaults');
}

// ==========================================
// EXPORT FUNCTIONS
// ==========================================

function downloadPNG() {
  const link = document.createElement('a');
  link.download = `3d-suit-design-${new Date().toISOString().split('T')[0]}.png`;
  link.href = renderer.domElement.toDataURL('image/png');
  link.click();
  updateStatus('PNG downloaded!');
}

function exportPDF() {
  const element = document.querySelector('.studio-container');
  const opt = {
    margin: 10,
    filename: `3d-suit-design-${new Date().toISOString().split('T')[0]}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
  };
  html2pdf().set(opt).save();
  updateStatus('PDF exported!');
}

// ==========================================
// APP INITIALIZATION
// ==========================================

function initializeApp() {
  console.log('Initializing 3D Ethnic Suit Studio...');
  
  initTheme();
  setupFabricPalette();
  bindRangeInputs();
  bindSelectChanges();
  bindButtons();
  
  initThreeJS();
  buildMannequin();
  buildSuitMeshes();
  
  loadMeasurements();
  updateStyle();
  calculateCutting();
  renderStitching();
  
  updateStatus('App loaded successfully!');
  console.log('✓ 3D Ethnic Suit Studio Ready');
}

window.addEventListener('load', initializeApp);
window.addEventListener('resize', onWindowResize);
