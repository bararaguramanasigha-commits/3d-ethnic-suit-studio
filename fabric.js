// ==========================================
// FABRIC.JS - FABRIC MATERIALS & PHYSICS
// ==========================================

let suitGroup = new THREE.Group();
let topMesh, bottomMesh, sleeveL, sleeveR, dupattaMesh;

function buildSuitMeshes() {
  scene.add(suitGroup);

  // Top/Kameez
  const topGeom = new THREE.CylinderGeometry(1, 1, 1, 32, 8, true);
  const topMat = new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
    roughness: 0.5,
    metalness: 0.0
  });
  topMesh = new THREE.Mesh(topGeom, topMat);
  topMesh.castShadow = true;
  topMesh.receiveShadow = true;
  suitGroup.add(topMesh);

  // Bottom/Pants
  const bottomGeom = new THREE.CylinderGeometry(1, 1, 1, 32, 8, true);
  const bottomMat = new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
    roughness: 0.5,
    metalness: 0.0
  });
  bottomMesh = new THREE.Mesh(bottomGeom, bottomMat);
  bottomMesh.castShadow = true;
  bottomMesh.receiveShadow = true;
  suitGroup.add(bottomMesh);

  // Sleeves
  const sleeveGeom = new THREE.CylinderGeometry(1, 1, 1, 24, 6, true);
  const sleeveMat = new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
    roughness: 0.5,
    metalness: 0.0
  });
  
  sleeveL = new THREE.Mesh(sleeveGeom, sleeveMat);
  sleeveL.castShadow = true;
  sleeveL.receiveShadow = true;
  suitGroup.add(sleeveL);

  sleeveR = sleeveL.clone();
  sleeveR.castShadow = true;
  sleeveR.receiveShadow = true;
  suitGroup.add(sleeveR);

  // Dupatta
  const dupatGeom = new THREE.PlaneGeometry(18, 140, 8, 16);
  const dupatMat = new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.9,
    roughness: 0.4
  });
  dupattaMesh = new THREE.Mesh(dupatGeom, dupatMat);
  dupattaMesh.castShadow = true;
  dupattaMesh.receiveShadow = true;
  suitGroup.add(dupattaMesh);

  applyMaterial();
}

function applyMaterial() {
  const textureMode = document.getElementById('fabric-texture').value;
  const texture = getFabricTexture(selectedColor, textureMode);
  const roughnessValue = getRoughnessFromTexture(textureMode);

  [topMesh, bottomMesh, sleeveL, sleeveR, dupattaMesh].forEach(mesh => {
    if (mesh && mesh.material) {
      mesh.material.map = texture;
      mesh.material.color.set('#ffffff');
      mesh.material.roughness = roughnessValue;
      mesh.material.needsUpdate = true;
    }
  });
}

function getRoughnessFromTexture(type) {
  const roughnessMap = {
    'cotton': 0.8,
    'silk': 0.2,
    'velvet': 0.95,
    'georgette': 0.5,
    'chiffon': 0.3,
    'banarasi': 0.4
  };
  return roughnessMap[type] || 0.6;
}
