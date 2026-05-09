import { withBase } from './paths';

const FRUIT_IMAGES: string[] = [
  'images/apple.png',
  'images/banana.png',
  'images/orange.png',
  'images/strawberry.png',
  'images/lemon.png',
  'images/grapefruit.png',
].map(withBase);

const WORM_IMAGE = withBase('images/worm.png');
const WORM_CHANCE = 0.18;

export async function loadGame1Page(): Promise<void> {
  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;

  mainContent.innerHTML = `
        <div class="container">
            <h1>Гра "Піймай фрукт"</h1>
            <div class="game-instruction game-instruction-overlay" id="catch-instruction">
                <span class="game-instruction-icon">🍏</span>
                <div class="game-instruction-text">
                    <b>Як грати:</b>
                    <ul>
                        <li>Керуй кошиком мишкою або стрілками ← →.</li>
                        <li>Лови фрукти, щоб набирати бали.</li>
                        <li>Якщо пропустиш фрукт або зловиш хробака — гра закінчиться.</li>
                        <li>Щоб почати гру, натисни <b>Почати гру</b> нижче.</li>
                    </ul>
                </div>
                <button type="button" id="catch-instruction-btn" class="btn btn-primary">Почати гру</button>
            </div>
            <div class="game-container catch-fruit-game">
                <div id="game-area">
                    <img id="basket" src="${withBase('images/basket.png')}" alt="Кошик">
                </div>
                <div class="game-info">
                    <span class="lives-label">Життя: <b>3</b></span>
                    <span class="score-label">Бали: <b>0</b></span>
                </div>
                <button type="button" id="start-game-btn" class="btn btn-primary" style="display:none;">Старт</button>
                <div id="game-over" style="display:none;"></div>
            </div>
        </div>
    `;

  const instruction = document.getElementById('catch-instruction');
  const startBtn = document.getElementById('start-game-btn') as HTMLButtonElement | null;
  const instructionBtn = document.getElementById('catch-instruction-btn');
  if (instructionBtn && instruction && startBtn) {
    instructionBtn.addEventListener('click', () => {
      instruction.style.display = 'none';
      startBtn.style.display = 'block';
    });
  }

  const gameArea = document.getElementById('game-area');
  const basket = document.getElementById('basket') as HTMLImageElement | null;
  const gameOverEl = document.getElementById('game-over');
  if (!gameArea || !basket || !gameOverEl || !startBtn) return;

  const areaEl = gameArea;
  const basketEl = basket;
  const overEl = gameOverEl;
  const startEl = startBtn;

  const gameWidth = 400;
  const gameHeight = 500;
  const basketWidth = 80;
  const basketHeight = 60;
  const minFruitSize = 32;
  const maxFruitSize = 60;
  const minFruitSpeed = 3;
  const maxFruitSpeed = 8;

  let score = 0;
  let lives = 3;
  let basketX = (gameWidth - basketWidth) / 2;
  const fruits: HTMLImageElement[] = [];
  let gameInterval: ReturnType<typeof setInterval> | null = null;
  let fruitInterval: ReturnType<typeof setInterval> | null = null;
  let isGameActive = false;

  areaEl.style.position = 'relative';
  areaEl.style.width = `${gameWidth}px`;
  areaEl.style.height = `${gameHeight}px`;
  areaEl.style.background = '#f8f9fa';
  areaEl.style.margin = '0 auto 2rem';
  areaEl.style.border = '2px solid #4CAF50';
  areaEl.style.overflow = 'hidden';
  basketEl.style.position = 'absolute';
  basketEl.style.width = `${basketWidth}px`;
  basketEl.style.height = `${basketHeight}px`;
  basketEl.style.bottom = '0';
  basketEl.style.left = `${basketX}px`;
  basketEl.style.transition = 'left 0.08s linear';
  basketEl.style.userSelect = 'none';

  areaEl.onmousemove = (e: MouseEvent) => {
    if (!isGameActive) return;
    const rect = areaEl.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    basketX = Math.min(Math.max(mouseX - basketWidth / 2, 0), gameWidth - basketWidth);
    basketEl.style.left = `${basketX}px`;
  };

  document.onkeydown = (e: KeyboardEvent) => {
    if (!isGameActive) return;
    if (e.key === 'ArrowLeft') basketX = Math.max(0, basketX - 30);
    if (e.key === 'ArrowRight') basketX = Math.min(gameWidth - basketWidth, basketX + 30);
    basketEl.style.left = `${basketX}px`;
  };

  const updateScoreLives = (): void => {
    const info = document.querySelector<HTMLElement>('.catch-fruit-game .game-info');
    if (info) {
      info.innerHTML = `<span class="lives-label">Життя: <b>${lives}</b></span> <span class="score-label">Бали: <b>${score}</b></span>`;
    }
  };

  function createFruit(): void {
    const isWorm = Math.random() < WORM_CHANCE;
    const fruit = document.createElement('img');
    fruit.src = isWorm ? WORM_IMAGE : FRUIT_IMAGES[Math.floor(Math.random() * FRUIT_IMAGES.length)]!;
    fruit.className = isWorm ? 'falling-worm' : 'falling-fruit';
    fruit.dataset.type = isWorm ? 'worm' : 'fruit';
    const size = isWorm ? 48 : Math.floor(Math.random() * (maxFruitSize - minFruitSize + 1)) + minFruitSize;
    const speed = isWorm
      ? Math.floor(Math.random() * 3) + 4
      : Math.floor(Math.random() * (maxFruitSpeed - minFruitSpeed + 1)) + minFruitSpeed;
    fruit.dataset.speed = String(speed);
    fruit.style.position = 'absolute';
    fruit.style.width = `${size}px`;
    fruit.style.height = `${size}px`;
    fruit.style.left = `${Math.floor(Math.random() * (gameWidth - size))}px`;
    fruit.style.top = '-60px';
    fruit.style.transition = 'filter 0.2s';
    areaEl.appendChild(fruit);
    fruits.push(fruit);
  }

  function updateFruits(): void {
    for (let i = fruits.length - 1; i >= 0; i--) {
      const fruit = fruits[i]!;
      let top = parseInt(fruit.style.top, 10);
      const speed = parseInt(fruit.dataset.speed ?? '0', 10);
      top += speed;
      fruit.style.top = `${top}px`;
      const size = parseInt(fruit.style.width, 10);
      const fruitLeft = parseInt(fruit.style.left, 10);
      if (
        top + size >= gameHeight - basketHeight &&
        fruitLeft + size > basketX &&
        fruitLeft < basketX + basketWidth
      ) {
        if (fruit.dataset.type === 'worm') {
          fruit.style.filter = 'drop-shadow(0 0 10px red)';
          endGame(true);
          return;
        } else {
          score++;
          updateScoreLives();
          fruit.remove();
          fruits.splice(i, 1);
          continue;
        }
      }
      if (top >= gameHeight) {
        if (fruit.dataset.type === 'fruit') {
          lives--;
          updateScoreLives();
          fruit.remove();
          fruits.splice(i, 1);
          if (lives <= 0) {
            endGame(false);
            return;
          }
        } else {
          fruit.remove();
          fruits.splice(i, 1);
        }
        continue;
      }
    }
  }

  function clearTimers(): void {
    if (gameInterval !== null) clearInterval(gameInterval);
    if (fruitInterval !== null) clearInterval(fruitInterval);
    gameInterval = null;
    fruitInterval = null;
  }

  function startGame(): void {
    score = 0;
    lives = 3;
    basketX = (gameWidth - basketWidth) / 2;
    fruits.forEach((f) => f.remove());
    fruits.length = 0;
    updateScoreLives();
    basketEl.style.left = `${basketX}px`;
    isGameActive = true;
    overEl.style.display = 'none';
    startEl.style.display = 'none';
    clearTimers();
    gameInterval = setInterval(updateFruits, 20);
    fruitInterval = setInterval(createFruit, 1000);
  }

  function endGame(caughtWorm: boolean): void {
    isGameActive = false;
    clearTimers();
    startEl.style.display = 'block';
    overEl.style.display = 'flex';
    overEl.className = 'game-over-panel';
    const msg = caughtWorm
      ? '<div class="game-over-title">Ой! Ви зловили хробака!</div>'
      : '<div class="game-over-title">Гру завершено! Ви втратили всі життя.</div>';
    overEl.innerHTML = `
            <div>
                ${msg}
                <div class="game-over-score">Ваш рахунок: <b>${score}</b></div>
                <button type="button" id="restart-btn" class="game-over-btn">Зіграти ще</button>
            </div>
        `;
    const restartBtn = document.getElementById('restart-btn');
    restartBtn?.addEventListener('click', () => {
      overEl.style.display = 'none';
      startGame();
    });
  }

  startEl.addEventListener('click', startGame);
}
