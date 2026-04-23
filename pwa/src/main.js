const root = document.documentElement;
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const DESIGN_WIDTH = 1280;
const DESIGN_HEIGHT = 720;

const state = {
  isPortrait: false,
  status: 'Loading…',
  statusDetail: 'Preparing game systems',
  stars: []
};

function updateOrientationState() {
  state.isPortrait = window.matchMedia('(orientation: portrait)').matches;
  root.classList.toggle('portrait', state.isPortrait);
}

function sizeCanvas() {
  const ratio = 16 / 9;
  const maxWidth = window.innerWidth;
  const maxHeight = window.innerHeight;

  let width = maxWidth;
  let height = width / ratio;

  if (height > maxHeight) {
    height = maxHeight;
    width = height * ratio;
  }

  canvas.style.width = `${Math.floor(width)}px`;
  canvas.style.height = `${Math.floor(height)}px`;
}

function seedStars() {
  state.stars = Array.from({ length: 90 }, () => ({
    x: Math.random() * DESIGN_WIDTH,
    y: Math.random() * DESIGN_HEIGHT,
    radius: Math.random() * 1.8 + 0.4,
    speed: Math.random() * 0.25 + 0.12,
    alpha: Math.random() * 0.5 + 0.2
  }));
}

function drawLoadingFrame() {
  if (!ctx) {
    return;
  }

  ctx.clearRect(0, 0, DESIGN_WIDTH, DESIGN_HEIGHT);

  const gradient = ctx.createLinearGradient(0, 0, DESIGN_WIDTH, DESIGN_HEIGHT);
  gradient.addColorStop(0, '#050a1f');
  gradient.addColorStop(1, '#121b39');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, DESIGN_WIDTH, DESIGN_HEIGHT);

  for (const star of state.stars) {
    star.x -= star.speed;
    if (star.x < -4) {
      star.x = DESIGN_WIDTH + 4;
      star.y = Math.random() * DESIGN_HEIGHT;
    }

    ctx.fillStyle = `rgba(220,235,255,${star.alpha})`;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 56px "Segoe UI", system-ui, sans-serif';
  ctx.fillText('Andromeda Trail', DESIGN_WIDTH / 2, DESIGN_HEIGHT / 2 - 42);

  ctx.fillStyle = '#a9c7ff';
  ctx.font = '500 28px "Segoe UI", system-ui, sans-serif';
  ctx.fillText(state.status, DESIGN_WIDTH / 2, DESIGN_HEIGHT / 2 + 8);

  ctx.fillStyle = 'rgba(220,230,255,0.8)';
  ctx.font = '400 20px "Segoe UI", system-ui, sans-serif';
  ctx.fillText(state.statusDetail, DESIGN_WIDTH / 2, DESIGN_HEIGHT / 2 + 44);
}

function startLoadingAnimation() {
  function loop() {
    drawLoadingFrame();
    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}

async function lockLandscape() {
  try {
    if (screen.orientation?.lock) {
      await screen.orientation.lock('landscape');
    }
  } catch {
    // Most mobile browsers gate this to fullscreen and/or user gesture.
  }
}

async function registerSW() {
  if ('serviceWorker' in navigator) {
    await navigator.serviceWorker.register('./sw.js', { scope: './' });
  }
}

async function bootstrapGame() {
  state.status = 'Game ready';
  state.statusDetail = 'Tap to begin your journey';

  await Promise.allSettled([lockLandscape(), registerSW()]);
}

window.addEventListener('resize', () => {
  updateOrientationState();
  sizeCanvas();
});

window.addEventListener('orientationchange', updateOrientationState);
window.addEventListener('load', async () => {
  updateOrientationState();
  sizeCanvas();
  seedStars();
  startLoadingAnimation();

  try {
    await bootstrapGame();
  } catch (error) {
    state.status = 'Load error';
    state.statusDetail = error instanceof Error ? error.message : 'Unexpected startup issue';
    console.error(error);
  }
});
