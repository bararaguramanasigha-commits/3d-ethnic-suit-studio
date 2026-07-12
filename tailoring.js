// ==========================================
// TAILORING.JS - MEASUREMENTS & PATTERN MAKING
// ==========================================

function updateSuitFromMeasurements() {
  if (!topMesh) return;

  const chest = Number(document.getElementById('chest').value);
  const waist = Number(document.getElementById('waist').value);
  const hip = Number(document.getElementById('hip').value);
  const armhole = Number(document.getElementById('armhole').value);
  const sleeveLen = Number(document.getElementById('sleeve-length').value);
  const suitLen = Number(document.getElementById('suit-length').value);
  const bottomLen = Number(document.getElementById('bottom-length').value);

  // Calculate top dimensions based on measurements
  const topLength = suitLen * (suitParams.topLenFactor || 1.0);
  const topRadius = chest * 0.18;
  const topWaist = waist * 0.16;

  topMesh.geometry = new THREE.CylinderGeometry(topRadius, topWaist, topLength, 32, 8, true);
  topMesh.position.set(0, 145 - (topLength / 2), 0);

  // Bottom dimensions
  const bottomBottomType = suitParams.bottomType || 'pant';
  const flareFactor = suitParams.flareFactor || 1.0;
  let bottomTopRadius, bottomBottomRadius;

  switch (bottomBottomType) {
    case 'skirt':
    case 'lehenga':
      bottomTopRadius = hip * 0.15;
      bottomBottomRadius = hip * 0.35 * flareFactor;
      break;
    case 'sharara':
    case 'gharara':
      bottomTopRadius = hip * 0.18;
      bottomBottomRadius = hip * 0.4 * flareFactor;
      break;
    case 'palazzo':
      bottomTopRadius = hip * 0.20;
      bottomBottomRadius = hip * 0.30;
      break;
    case 'salwar':
    case 'patiala':
      bottomTopRadius = hip * 0.22;
      bottomBottomRadius = hip * 0.28 * flareFactor;
      break;
    case 'churidar':
      bottomTopRadius = hip * 0.20;
      bottomBottomRadius = hip * 0.15;
      break;
    default: // pant
      bottomTopRadius = hip * 0.22;
      bottomBottomRadius = hip * 0.18;
  }

  bottomMesh.geometry = new THREE.CylinderGeometry(
    bottomTopRadius,
    bottomBottomRadius,
    bottomLen,
    32,
    8,
    true
  );
  bottomMesh.position.set(0, 85 - (bottomLen / 2), 0);

  // Sleeves
  const sleeveRadius = armhole * 0.12;
  const sleeveLengthScaled = sleeveLen * 2.2;

  sleeveL.geometry = new THREE.CylinderGeometry(sleeveRadius, sleeveRadius * 0.75, sleeveLengthScaled, 24, 6, true);
  sleeveR.geometry = sleeveL.geometry;

  sleeveL.position.set(-16 - sleeveRadius * 0.5, 132, 0);
  sleeveL.rotation.z = Math.PI / 10;

  sleeveR.position.set(16 + sleeveRadius * 0.5, 132, 0);
  sleeveR.rotation.z = -Math.PI / 10;

  // Sleeve visibility based on style
  const sleeveStyle = document.getElementById('sleeve-style').value;
  sleeveL.visible = sleeveR.visible = (sleeveStyle !== 'sleeveless');

  // Dupatta positioning
  const dupatStyle = document.getElementById('dupatta-style').value;
  if (dupatStyle === 'none') {
    dupattaMesh.visible = false;
  } else {
    dupattaMesh.visible = true;
    switch (dupatStyle) {
      case 'shoulder':
        dupattaMesh.position.set(12, 110, 8);
        dupattaMesh.rotation.set(0, 0, Math.PI / 6);
        break;
      case 'front':
        dupattaMesh.position.set(0, 115, 15);
        dupattaMesh.rotation.set(Math.PI / 8, 0, 0);
        break;
      case 'both':
        dupattaMesh.position.set(0, 105, 12);
        dupattaMesh.rotation.set(Math.PI / 6, 0, 0);
        break;
      case 'half':
        dupattaMesh.position.set(-8, 110, 10);
        dupattaMesh.rotation.set(Math.PI / 8, Math.PI / 6, 0);
        break;
    }
  }
}
