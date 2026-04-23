const root = document.documentElement;
const canvas = document.getElementById('gameCanvas');

function updateOrientationState() {
  const isPortrait = window.matchMedia('(orientation: portrait)').matches;
  root.classList.toggle('portrait', isPortrait);
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

window.addEventListener('resize', () => {
  updateOrientationState();
  sizeCanvas();
});

window.addEventListener('orientationchange', updateOrientationState);
window.addEventListener('load', async () => {
  updateOrientationState();
  sizeCanvas();
  await Promise.allSettled([lockLandscape(), registerSW()]);
});
