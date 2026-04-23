const root = document.documentElement;
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameStage = document.getElementById('gameStage');

const DESIGN_WIDTH = 1280;
const DESIGN_HEIGHT = 720;
const SHIP_SPEED = 440;

const state = {
  isPortrait: false,
  hasStarted: false,
  status: 'Loading…',
  statusDetail: 'Preparing game systems',
  stars: [],
  lastFrameAt: 0,
  input: {
    up: false,
    down: false,
    left: false,
    right: false
  },
  ship: {
    x: DESIGN_WIDTH * 0.2,
    y: DESIGN_HEIGHT * 0.5,
    radius: 28
  },
  asteroids: []
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

function seedAsteroids() {
  state.asteroids = Array.from({ length: 7 }, (_, index) => ({
    x: DESIGN_WIDTH + index * 240,
    y: 80 + Math.random() * (DESIGN_HEIGHT - 160),
    radius: 20 + Math.random() * 30,
    speed: 130 + Math.random() * 120
  }));
}

function drawBackground() {
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
}

function drawLoadingFrame() {
  if (!ctx) {
    return;
  }

  ctx.clearRect(0, 0, DESIGN_WIDTH, DESIGN_HEIGHT);
  drawBackground();

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

function drawShip() {
  const { x, y, radius } = state.ship;

  ctx.save();
  ctx.translate(x, y);

  ctx.fillStyle = '#c2ddff';
  ctx.beginPath();
  ctx.moveTo(radius + 8, 0);
  ctx.lineTo(-radius + 8, -radius * 0.66);
  ctx.lineTo(-radius * 0.7, 0);
  ctx.lineTo(-radius + 8, radius * 0.66);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#3b88ff';
  ctx.beginPath();
  ctx.arc(-radius * 0.25, 0, radius * 0.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function updateGameplay(dt) {
  const { input, ship } = state;
  const xAxis = (input.right ? 1 : 0) - (input.left ? 1 : 0);
  const yAxis = (input.down ? 1 : 0) - (input.up ? 1 : 0);

  ship.x += xAxis * SHIP_SPEED * dt;
  ship.y += yAxis * SHIP_SPEED * dt;

  ship.x = Math.max(ship.radius, Math.min(DESIGN_WIDTH - ship.radius, ship.x));
  ship.y = Math.max(ship.radius, Math.min(DESIGN_HEIGHT - ship.radius, ship.y));

  for (const asteroid of state.asteroids) {
    asteroid.x -= asteroid.speed * dt;
    if (asteroid.x < -asteroid.radius - 10) {
      asteroid.x = DESIGN_WIDTH + asteroid.radius + Math.random() * 280;
      asteroid.y = 80 + Math.random() * (DESIGN_HEIGHT - 160);
      asteroid.radius = 20 + Math.random() * 30;
      asteroid.speed = 130 + Math.random() * 120;
    }
  }
}

function drawGameplayFrame(dt) {
  ctx.clearRect(0, 0, DESIGN_WIDTH, DESIGN_HEIGHT);
  drawBackground();

  updateGameplay(dt);

  for (const asteroid of state.asteroids) {
    ctx.fillStyle = '#8ca1bd';
    ctx.beginPath();
    ctx.arc(asteroid.x, asteroid.y, asteroid.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  drawShip();

  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(235, 245, 255, 0.95)';
  ctx.font = '500 22px "Segoe UI", system-ui, sans-serif';
  ctx.fillText('Flight controls: touch/drag left side to steer', 26, 40);
  ctx.fillText('or use arrow keys on desktop', 26, 70);
}

function startRenderLoop() {
  function loop(timestamp) {
    const dt = Math.min(0.05, Math.max(0, (timestamp - state.lastFrameAt) / 1000 || 0));
    state.lastFrameAt = timestamp;

    if (state.hasStarted) {
      drawGameplayFrame(dt);
    } else {
      drawLoadingFrame();
    }

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

async function requestFullscreen() {
  const el = document.documentElement;
  try {
    if (el.requestFullscreen && !document.fullscreenElement) {
      await el.requestFullscreen({ navigationUI: 'hide' });
    }
  } catch {
    // Fullscreen is optional and not available on every platform.
  }
}

async function registerSW() {
  if ('serviceWorker' in navigator) {
    await navigator.serviceWorker.register('./sw.js', { scope: './' });
  }
}

function updateStartPrompt() {
  gameStage.classList.toggle('ready', !state.hasStarted && state.status === 'Game ready');
}

function applyTouchDirection(touch) {
  if (!touch) {
    return;
  }

  const rect = canvas.getBoundingClientRect();
  const touchX = touch.clientX - rect.left;
  const touchY = touch.clientY - rect.top;
  const normalizedX = touchX / rect.width;
  const normalizedY = touchY / rect.height;

  state.input.left = normalizedX < 0.4;
  state.input.right = normalizedX > 0.6;
  state.input.up = normalizedY < 0.4;
  state.input.down = normalizedY > 0.6;
}

function resetTouchDirection() {
  state.input.up = false;
  state.input.down = false;
  state.input.left = false;
  state.input.right = false;
}

async function startGame() {
  if (state.hasStarted || state.status !== 'Game ready') {
    return;
  }

  state.hasStarted = true;
  updateStartPrompt();
  state.status = 'Live';
  state.statusDetail = 'Touch controls active';
  seedAsteroids();

  await Promise.allSettled([requestFullscreen(), lockLandscape()]);
}

function bindStartHandlers() {
  gameStage.addEventListener('pointerdown', () => {
    startGame();
  });

  canvas.addEventListener(
    'touchstart',
    (event) => {
      startGame();
      applyTouchDirection(event.touches[0]);
      event.preventDefault();
    },
    { passive: false }
  );

  canvas.addEventListener(
    'touchmove',
    (event) => {
      if (!state.hasStarted) {
        return;
      }

      applyTouchDirection(event.touches[0]);
      event.preventDefault();
    },
    { passive: false }
  );

  canvas.addEventListener('touchend', resetTouchDirection, { passive: true });

  window.addEventListener('keydown', (event) => {
    if (!state.hasStarted && (event.code === 'Enter' || event.code === 'Space')) {
      startGame();
      return;
    }

    if (event.code === 'ArrowUp') {
      state.input.up = true;
    }
    if (event.code === 'ArrowDown') {
      state.input.down = true;
    }
    if (event.code === 'ArrowLeft') {
      state.input.left = true;
    }
    if (event.code === 'ArrowRight') {
      state.input.right = true;
    }
  });

  window.addEventListener('keyup', (event) => {
    if (event.code === 'ArrowUp') {
      state.input.up = false;
    }
    if (event.code === 'ArrowDown') {
      state.input.down = false;
    }
    if (event.code === 'ArrowLeft') {
      state.input.left = false;
    }
    if (event.code === 'ArrowRight') {
      state.input.right = false;
    }
  });
}

async function bootstrapGame() {
  state.status = 'Game ready';
  state.statusDetail = 'Tap to begin your journey';
  updateStartPrompt();

  await registerSW();
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
  bindStartHandlers();
  startRenderLoop();

  try {
    await bootstrapGame();
  } catch (error) {
    state.status = 'Load error';
    state.statusDetail = error instanceof Error ? error.message : 'Unexpected startup issue';
    console.error(error);
  }
});
