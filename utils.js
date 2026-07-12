// ==========================================
// UTILS.JS - UTILITY FUNCTIONS
// ==========================================

// Export functions already defined in main.js:
// - downloadPNG()
// - exportPDF()
// - saveMeasurements()
// - loadMeasurements()
// - resetDesign()
// - updateStatus()

// Additional utility functions

function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getInchesToCm(inches) {
  return (inches * 2.54).toFixed(1);
}

function getCmToInches(cm) {
  return (cm / 2.54).toFixed(1);
}

function calculateFabricNeeded(chest, suitLength, bottomLength) {
  const topArea = (chest * 0.5) * suitLength;
  const bottomArea = (chest * 0.6) * bottomLength;
  const sleevesArea = (chest * 0.4) * (suitLength * 0.5);
  const totalArea = topArea + bottomArea + sleevesArea;
  const fabricYards = (totalArea / 1296).toFixed(2); // Convert to square yards
  return {
    totalSqInches: totalArea.toFixed(0),
    totalSqYards: fabricYards,
    estimatedMeters: (parseFloat(fabricYards) * 0.836).toFixed(2)
  };
}

function generateMeasurementReport() {
  const chest = document.getElementById('chest').value;
  const waist = document.getElementById('waist').value;
  const hip = document.getElementById('hip').value;
  const shoulder = document.getElementById('shoulder').value;
  const neck = document.getElementById('neck').value;
  const armhole = document.getElementById('armhole').value;
  const sleeveLength = document.getElementById('sleeve-length').value;
  const suitLength = document.getElementById('suit-length').value;
  const bottomLength = document.getElementById('bottom-length').value;

  const report = `
    3D ETHNIC SUIT STUDIO - MEASUREMENT REPORT
    Generated: ${formatDate(new Date())}
    
    BODY MEASUREMENTS (Inches):
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    Chest:              ${chest}"
    Waist:              ${waist}"
    Hip:                ${hip}"
    Shoulder (across):  ${shoulder}"
    Neck (circumference): ${neck}"
    Armhole:            ${armhole}"
    
    GARMENT DIMENSIONS (Inches):
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    Sleeve Length:      ${sleeveLength}"
    Suit (Kameez) Length: ${suitLength}"
    Bottom Length:      ${bottomLength}"
    
    GARMENT SPECIFICATIONS:
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    Style:              ${document.getElementById('suit-style').value}
    Neck Style:         ${document.getElementById('neck-style').value}
    Sleeve Style:       ${document.getElementById('sleeve-style').value}
    Bottom Style:       ${document.getElementById('bottom-style').value}
    Dupatta Style:      ${document.getElementById('dupatta-style').value}
    Fabric Texture:     ${document.getElementById('fabric-texture').value}
  `;

  return report;
}

// Error handling
window.addEventListener('error', (e) => {
  console.error('App Error:', e.error);
  updateStatus('⚠️ An error occurred');
});

// Performance optimization
if ('requestIdleCallback' in window) {
  requestIdleCallback(() => {
    console.log('App initialized and idle');
  });
}
