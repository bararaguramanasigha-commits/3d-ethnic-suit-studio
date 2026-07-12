// ==========================================
// STITCHING.JS - ANIMATED STITCHING GUIDE
// ==========================================

const stitchingSteps = [
  {
    title: '1. Prepare & Mark Pattern',
    description: 'Fold fabric along grain lines. Mark all points using tailor\'s chalk. Ensure pattern alignment with selvage edges for grain accuracy.',
    techniques: ['Grain alignment', 'Pattern marking', 'Fabric folding']
  },
  {
    title: '2. Cut All Pattern Pieces',
    description: 'Cut all pieces according to layout with seam allowances. Use sharp scissors and follow grain lines. Cut notches for matching seams.',
    techniques: ['Accurate cutting', 'Seam allowances', 'Notch marking']
  },
  {
    title: '3. Construct Shoulder Seams',
    description: 'Pin front and back pieces at shoulders with right sides facing. Stitch using 1/2" seam allowance. Press seams open and finish raw edges.',
    techniques: ['Shoulder stitching', 'Seam pressing', 'Edge finishing']
  },
  {
    title: '4. Attach Sleeves',
    description: 'Match sleeve cap to armhole, easing fullness smoothly. Pin and stitch with 1/2" allowance. Try on and adjust sleeve angle for comfort fit.',
    techniques: ['Sleeve easing', 'Armhole attachment', 'Sleeve adjustment']
  },
  {
    title: '5. Complete Side & Bottom Seams',
    description: 'Stitch continuous lines from sleeve cuffs through side seams to bottom hem. Finish with overcasting. Press all seams. Add hem stitching with hand or machine.',
    techniques: ['Side seaming', 'Hem stitching', 'Final pressing']
  },
  {
    title: '6. Add Neckline Facing & Buttons',
    description: 'Attach neck facing with bias binding. Press and stitch topstitching for crisp edge. Mark button positions and sew buttons with reinforced stitches.',
    techniques: ['Facing attachment', 'Button placement', 'Reinforced stitching']
  },
  {
    title: '7. Final Pressing & Details',
    description: 'Steam press entire garment. Add embellishments if desired. Attach dupatta/shawl. Try on and make final adjustments for perfect fit.',
    techniques: ['Final pressing', 'Embellishment', 'Fit testing']
  }
];

let currentStep = 0;

function renderStitching() {
  const step = stitchingSteps[currentStep];
  const container = document.getElementById('stitch-steps');
  
  container.innerHTML = `
    <div class="step-container">
      <div class="step-card">
        <strong style="color: var(--velvet-maroon); font-size: 1rem;">${step.title}</strong>
        <div style="margin-top: 8px; color: var(--text-muted); line-height: 1.6; font-size: 0.9rem;">
          ${step.description}
        </div>
        <div style="margin-top: 10px; display: flex; flex-wrap: wrap; gap: 6px;">
          ${step.techniques.map(t => `
            <span style="
              background: rgba(197, 168, 128, 0.2);
              color: var(--text-muted);
              padding: 4px 10px;
              border-radius: 12px;
              font-size: 0.75rem;
              font-weight: 600;
            ">${t}</span>
          `).join('')}
        </div>
      </div>
    </div>
  `;
  
  document.getElementById('step-counter').textContent = `${currentStep + 1} / ${stitchingSteps.length}`;
}

function changeStep(direction) {
  currentStep = Math.max(0, Math.min(stitchingSteps.length - 1, currentStep + direction));
  renderStitching();
  updateStatus(`Step ${currentStep + 1} of ${stitchingSteps.length}`);
}
