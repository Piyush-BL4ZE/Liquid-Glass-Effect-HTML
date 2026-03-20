const scene = document.getElementById('scene');
const lens = document.getElementById('lens');
const lensContent = document.getElementById('lensContent');
const template = document.getElementById('sceneCloneTemplate');

const state = {
  x: 102,
  y: 272,
  active: false,
  pointerId: null,
  offsetX: 0,
  offsetY: 0,
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function buildLensClone() {
  const clone = template.content.firstElementChild.cloneNode(true);
  lensContent.replaceChildren(clone);
  syncLens();
}

function syncLens() {
  const sceneRect = scene.getBoundingClientRect();
  const lensRect = lens.getBoundingClientRect();
  const scale = 1.12;
  const offsetX = -(state.x + 40) * scale + lens.offsetWidth * 0.49;
  const offsetY = -(state.y + 40) * scale + lens.offsetHeight * 0.49;

  lens.style.setProperty('--lens-x', `${state.x}px`);
  lens.style.setProperty('--lens-y', `${state.y}px`);

  lensContent.style.width = `${sceneRect.width}px`;
  lensContent.style.height = `${sceneRect.height}px`;
  lensContent.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;

  const shadowShiftX = ((state.x + lensRect.width / 2) / sceneRect.width - 0.5) * 18;
  const shadowShiftY = ((state.y + lensRect.height / 2) / sceneRect.height - 0.5) * 14;
  lens.style.filter = `drop-shadow(${shadowShiftX}px ${14 + shadowShiftY}px 24px rgba(0,0,0,0.38))`;
}

function setLensPosition(nextX, nextY) {
  const maxX = scene.clientWidth - lens.offsetWidth - 18;
  const maxY = scene.clientHeight - lens.offsetHeight - 18;
  state.x = clamp(nextX, 18, maxX);
  state.y = clamp(nextY, 18, maxY);
  syncLens();
}

function onPointerDown(event) {
  state.active = true;
  state.pointerId = event.pointerId;
  const lensRect = lens.getBoundingClientRect();
  state.offsetX = event.clientX - lensRect.left;
  state.offsetY = event.clientY - lensRect.top;
  lens.classList.add('dragging');
  lens.setPointerCapture(event.pointerId);
}

function onPointerMove(event) {
  if (!state.active || event.pointerId !== state.pointerId) return;
  const rect = scene.getBoundingClientRect();
  const nextX = event.clientX - rect.left - state.offsetX;
  const nextY = event.clientY - rect.top - state.offsetY;
  setLensPosition(nextX, nextY);
}

function onPointerUp(event) {
  if (event.pointerId !== state.pointerId) return;
  state.active = false;
  state.pointerId = null;
  lens.classList.remove('dragging');
}

buildLensClone();
window.addEventListener('resize', syncLens);
lens.addEventListener('pointerdown', onPointerDown);
window.addEventListener('pointermove', onPointerMove);
window.addEventListener('pointerup', onPointerUp);
window.addEventListener('pointercancel', onPointerUp);
