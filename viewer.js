// ==========================================
// VIEWER.JS - THREE.JS SETUP & RENDERING
// ==========================================

let renderer, scene, camera, controls, animationId;
let fabricTextureCache = {};

function initThreeJS() {
  const canvas = document.getElementById('viewer');
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: true
  });
  
  renderer.setPixelRatio(window.devicePixelRatio || 1);
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowShadowMap;

  scene = new THREE.Scene();
  scene.background = null;
  scene.fog = new THREE.Fog(0xffffff, 500, 1500);

  const container = canvas.parentElement;
  const width = container.clientWidth;
  const height = container.clientHeight;
  
  camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 2000);
  camera.position.set(0, 120, 280);

  // Lighting setup
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(150, 200, 150);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  directionalLight.shadow.camera.left = -200;
  directionalLight.shadow.camera.right = 200;
  directionalLight.shadow.camera.top = 200;
  directionalLight.shadow.camera.bottom = -200;
  scene.add(directionalLight);

  const pointLight = new THREE.PointLight(0xffd700, 0.4);
  pointLight.position.set(-100, 150, 100);
  scene.add(pointLight);

  // Controls
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 100, 0);
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 150;
  controls.maxDistance = 500;
  controls.autoRotate = false;

  animate();
}

function animate() {
  animationId = requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

function onWindowResize() {
  const container = document.querySelector('.visualizer-viewport');
  if (!container) return;
  
  const width = container.clientWidth;
  const height = container.clientHeight;
  
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
}

function zoomCamera(factor) {
  const distance = camera.position.length();
  const newDistance = Math.max(150, Math.min(500, distance * factor));
  const scale = newDistance / distance;
  camera.position.multiplyScalar(scale);
  controls.object.updateProjectionMatrix();
  updateStatus('Zoomed');
}

function resetView() {
  camera.position.set(0, 120, 280);
  controls.target.set(0, 100, 0);
  controls.update();
  updateStatus('View reset');
}

function getFabricTexture(color, type) {
  const key = color + '|' + type;
  if (fabricTextureCache[key]) return fabricTextureCache[key];

  const size = 512;
  const cnv = document.createElement('canvas');
  cnv.width = cnv.height = size;
  const ctx = cnv.getContext('2d');

  // Base color
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, size, size);

  // Texture patterns
  switch (type) {
    case 'silk':
      const silkGrad = ctx.createLinearGradient(0, 0, size, size);
      silkGrad.addColorStop(0, color);
      silkGrad.addColorStop(0.5, lightenColor(color, 0.2));
      silkGrad.addColorStop(1, color);
      ctx.fillStyle = silkGrad;
      ctx.fillRect(0, 0, size, size);
      break;
    
    case 'velvet':
      for (let i = 0; i < 10000; i++) {
        ctx.fillStyle = Math.random() < 0.5 ? lightenColor(color, 0.05) : darkenColor(color, 0.05);
        ctx.fillRect(Math.random() * size, Math.random() * size, 2, 2);
      }
      break;
    
    case 'georgette':
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < size; i += 6) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, size);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(size, i);
        ctx.stroke();
      }
      break;
    
    case 'chiffon':
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      for (let i = 0; i < size; i += 8) {
        ctx.fillRect(i, i, 4, 4);
      }
      break;
    
    case 'banarasi':
      ctx.fillStyle = 'rgba(212, 175, 55, 0.3)';
      for (let i = 0; i < 60; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * size, Math.random() * size, 4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.2)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 20; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * size, 0);
        ctx.lineTo(Math.random() * size, size);
        ctx.stroke();
      }
      break;
  }

  const tex = new THREE.CanvasTexture(cnv);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  fabricTextureCache[key] = tex;
  return tex;
}

function lightenColor(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent * 100);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, ((num >> 8) & 0xFF) + amt);
  const B = Math.min(255, (num & 0xFF) + amt);
  return '#' + [R, G, B].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();
}

function darkenColor(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent * 100);
  const R = Math.max(0, (num >> 16) - amt);
  const G = Math.max(0, ((num >> 8) & 0xFF) - amt);
  const B = Math.max(0, (num & 0xFF) - amt);
  return '#' + [R, G, B].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();
}
