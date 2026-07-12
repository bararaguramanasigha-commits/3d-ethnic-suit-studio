// ==========================================
// CUTTING.JS - CUTTING CALCULATOR & LAYOUT
// ==========================================

function calculateCutting() {
  const chest = Number(document.getElementById('chest').value);
  const waist = Number(document.getElementById('waist').value);
  const hip = Number(document.getElementById('hip').value);
  const armhole = Number(document.getElementById('armhole').value);
  const sleeveLength = Number(document.getElementById('sleeve-length').value);
  const suitLength = Number(document.getElementById('suit-length').value);
  const bottomLength = Number(document.getElementById('bottom-length').value);
  const neckCirc = Number(document.getElementById('neck').value);
  const shoulder = Number(document.getElementById('shoulder').value);

  // Calculate cutting dimensions with seam allowances
  const parts = [
    {
      name: 'Front Bodice (Kameez)',
      formula: '(Chest / 4) + 2" Ease',
      width: ((chest / 4) + 2).toFixed(1),
      height: suitLength,
      seam: '1.5"',
      qty: 1
    },
    {
      name: 'Back Bodice',
      formula: '(Chest / 4) + 1.5" Ease',
      width: ((chest / 4) + 1.5).toFixed(1),
      height: suitLength,
      seam: '1.5"',
      qty: 1
    },
    {
      name: 'Side Panels (x2)',
      formula: '(Chest / 8) + 1.25" Ease',
      width: ((chest / 8) + 1.25).toFixed(1),
      height: suitLength,
      seam: '1.0"',
      qty: 2
    },
    {
      name: 'Sleeves (x2)',
      formula: '(Armhole / 2) + 1.5" Cap',
      width: ((armhole / 2) + 1.5).toFixed(1),
      height: sleeveLength,
      seam: '1.0"',
      qty: 2
    },
    {
      name: 'Bottom Panels (x2-4)',
      formula: '(Hip / 3) + Flare',
      width: ((hip / 3) + 4).toFixed(1),
      height: bottomLength,
      seam: '2.0"',
      qty: 3
    },
    {
      name: 'Neck Facing',
      formula: '(Neck Circ) + 1"',
      width: (neckCirc + 1).toFixed(1),
      height: '2.5',
      seam: '0.5"',
      qty: 1
    },
    {
      name: 'Collar (if applicable)',
      formula: '(Shoulder) x 1.5',
      width: (shoulder * 1.5).toFixed(1),
      height: '2.0',
      seam: '0.5"',
      qty: 1
    }
  ];

  // Populate table
  const tbody = document.querySelector('#cut-table tbody');
  tbody.innerHTML = '';
  let totalFabricNeeded = 0;

  parts.forEach(part => {
    const row = document.createElement('tr');
    const area = (parseFloat(part.width) * parseFloat(part.height) * part.qty).toFixed(1);
    totalFabricNeeded += parseFloat(area);
    
    row.innerHTML = `
      <td><strong>${part.name}</strong></td>
      <td>${part.formula}</td>
      <td>${part.width}" x ${part.height}" (${part.qty})</td>
      <td>${part.seam}</td>
    `;
    tbody.appendChild(row);
  });

  // Add total row
  const totalRow = document.createElement('tr');
  totalRow.style.fontWeight = 'bold';
  totalRow.style.borderTop = '2px solid var(--velvet-maroon)';
  totalRow.innerHTML = `
    <td>TOTAL FABRIC NEEDED</td>
    <td></td>
    <td>${(totalFabricNeeded / 144).toFixed(2)} sq. yards</td>
    <td></td>
  `;
  tbody.appendChild(totalRow);

  drawCuttingLayout(parts);
}

function drawCuttingLayout(parts) {
  const canvas = document.getElementById('layout-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background
  ctx.fillStyle = 'var(--bg-base)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Grid
  ctx.strokeStyle = 'rgba(197, 168, 128, 0.2)';
  ctx.lineWidth = 0.5;
  for (let i = 0; i < canvas.width; i += 20) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, canvas.height);
    ctx.stroke();
  }
  for (let i = 0; i < canvas.height; i += 20) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(canvas.width, i);
    ctx.stroke();
  }

  // Title
  ctx.fillStyle = '#6b1d33';
  ctx.font = 'bold 14px Arial';
  ctx.fillText('Fabric Cutting Layout Pattern', 15, 25);

  // Draw pattern pieces
  const patternPieces = [
    { name: 'Front', x: 20, y: 50, w: 70, h: 140, color: 'rgba(107, 29, 51, 0.1)' },
    { name: 'Back', x: 105, y: 50, w: 70, h: 140, color: 'rgba(197, 168, 128, 0.1)' },
    { name: 'Sleeve L', x: 190, y: 50, w: 50, h: 90, color: 'rgba(230, 63, 70, 0.1)' },
    { name: 'Sleeve R', x: 190, y: 150, w: 50, h: 90, color: 'rgba(230, 63, 70, 0.1)' },
    { name: 'Bottom', x: 260, y: 50, w: 80, h: 120, color: 'rgba(42, 157, 143, 0.1)' }
  ];

  patternPieces.forEach(piece => {
    ctx.fillStyle = piece.color;
    ctx.fillRect(piece.x, piece.y, piece.w, piece.h);
    ctx.strokeStyle = '#6b1d33';
    ctx.lineWidth = 2;
    ctx.strokeRect(piece.x, piece.y, piece.w, piece.h);
    
    ctx.fillStyle = '#1a1512';
    ctx.font = 'bold 11px Arial';
    ctx.fillText(piece.name, piece.x + 5, piece.y + piece.h / 2);
  });

  // Legend
  ctx.fillStyle = '#706257';
  ctx.font = '10px Arial';
  ctx.fillText('→ Grain Line Direction (keep parallel to selvage)', 15, canvas.height - 10);
}
