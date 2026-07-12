// ==========================================
// MANNEQUIN.JS - 3D FEMALE MANNEQUIN MODEL
// ==========================================

let mannequinGroup = new THREE.Group();

function buildMannequin() {
  scene.add(mannequinGroup);

  const skinMat = new THREE.MeshStandardMaterial({
    color: 0xf4a898,
    roughness: 0.6,
    metalness: 0.0
  });

  const hairMat = new THREE.MeshStandardMaterial({
    color: 0x3d2817,
    roughness: 0.7
  });

  // Head
  const headGeom = new THREE.SphereGeometry(10, 32, 32);
  const head = new THREE.Mesh(headGeom, skinMat);
  head.position.set(0, 165, 0);
  head.castShadow = true;
  head.receiveShadow = true;
  mannequinGroup.add(head);

  // Hair
  const hairGeom = new THREE.SphereGeometry(10.5, 32, 32);
  const hair = new THREE.Mesh(hairGeom, hairMat);
  hair.position.set(0, 165, 0);
  hair.castShadow = true;
  mannequinGroup.add(hair);

  // Neck
  const neckGeom = new THREE.CylinderGeometry(3.5, 4.5, 10, 16);
  const neck = new THREE.Mesh(neckGeom, skinMat);
  neck.position.set(0, 152, 0);
  neck.castShadow = true;
  neck.receiveShadow = true;
  mannequinGroup.add(neck);

  // Upper Torso (Bust)
  const torsoGeom = new THREE.CylinderGeometry(16, 14, 50, 32);
  const torso = new THREE.Mesh(torsoGeom, skinMat);
  torso.position.set(0, 120, 0);
  torso.castShadow = true;
  torso.receiveShadow = true;
  mannequinGroup.add(torso);

  // Middle Torso
  const midTorsoGeom = new THREE.CylinderGeometry(14, 12, 25, 32);
  const midTorso = new THREE.Mesh(midTorsoGeom, skinMat);
  midTorso.position.set(0, 95, 0);
  midTorso.castShadow = true;
  midTorso.receiveShadow = true;
  mannequinGroup.add(midTorso);

  // Hip / Lower Torso
  const hipGeom = new THREE.CylinderGeometry(12, 16, 35, 32);
  const hips = new THREE.Mesh(hipGeom, skinMat);
  hips.position.set(0, 75, 0);
  hips.castShadow = true;
  hips.receiveShadow = true;
  mannequinGroup.add(hips);

  // Left Arm
  const armGeom = new THREE.CylinderGeometry(3.5, 3, 50, 16);
  const armMat = new THREE.MeshStandardMaterial({ color: 0xf4a898, roughness: 0.6 });
  const armL = new THREE.Mesh(armGeom, armMat);
  armL.position.set(-18, 130, 0);
  armL.rotation.z = Math.PI / 3;
  armL.castShadow = true;
  armL.receiveShadow = true;
  mannequinGroup.add(armL);

  // Right Arm
  const armR = new THREE.Mesh(armGeom, armMat);
  armR.position.set(18, 130, 0);
  armR.rotation.z = -Math.PI / 3;
  armR.castShadow = true;
  armR.receiveShadow = true;
  mannequinGroup.add(armR);

  // Left Leg
  const legGeom = new THREE.CylinderGeometry(3.5, 3.2, 70, 16);
  const legMat = new THREE.MeshStandardMaterial({ color: 0xf4a898, roughness: 0.6 });
  const legL = new THREE.Mesh(legGeom, legMat);
  legL.position.set(-7, 35, 0);
  legL.castShadow = true;
  legL.receiveShadow = true;
  mannequinGroup.add(legL);

  // Right Leg
  const legR = new THREE.Mesh(legGeom, legMat);
  legR.position.set(7, 35, 0);
  legR.castShadow = true;
  legR.receiveShadow = true;
  mannequinGroup.add(legR);

  // Stand Base
  const standGeom = new THREE.CylinderGeometry(1.5, 1.5, 90, 16);
  const standMat = new THREE.MeshStandardMaterial({ color: 0x808080, metalness: 0.7, roughness: 0.3 });
  const stand = new THREE.Mesh(standGeom, standMat);
  stand.position.set(0, 0, 0);
  stand.castShadow = true;
  mannequinGroup.add(stand);

  // Base Plate
  const basePlateGeom = new THREE.CylinderGeometry(22, 22, 3, 32);
  const basePlate = new THREE.Mesh(basePlateGeom, standMat);
  basePlate.position.set(0, -46, 0);
  basePlate.receiveShadow = true;
  mannequinGroup.add(basePlate);
}
