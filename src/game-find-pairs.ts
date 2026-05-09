const PAIR_IMAGES: string[] = [
  'images/apple.png',
  'images/banana.png',
  'images/orange.png',
  'images/strawberry.png',
  'images/lemon.png',
  'images/grapefruit.png',
  'images/cabbage.png',
  'images/beetroot.png',
  'images/carrot.jpg',
  'images/lettuce.png',
];

const NUM_PAIRS = 6;

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
  return arr;
}

export async function loadGame2Page(): Promise<void> {
  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;

  mainContent.innerHTML = `
        <div class="container">
            <h1>Гра "Знайди подібні"</h1>
            <div class="game-instruction">
                <span class="game-instruction-icon">🍓</span>
                <div class="game-instruction-text">
                    <b>Як грати:</b>
                    <ul>
                        <li>Натисни <b>Старт</b>, щоб розпочати гру.</li>
                        <li>Відкривай по дві картки, шукай однакові зображення фруктів та овочів.</li>
                        <li>Якщо картки співпадають — вони залишаються відкритими.</li>
                        <li>Знайди всі пари, щоб виграти!</li>
                    </ul>
                </div>
            </div>
            <div class="game-container find-pairs-game">
                <div id="pairs-game-area"></div>
                <div class="game-info">
                    <span>Бали: <span id="pairs-score">0</span></span>
                </div>
                <button type="button" id="pairs-start-btn" class="btn btn-primary">Старт</button>
                <div id="pairs-game-over" style="display:none;"></div>
            </div>
        </div>
    `;

  let firstCard: HTMLElement | null = null;
  let secondCard: HTMLElement | null = null;
  let lockBoard = false;
  let score = 0;
  let matchedPairs = 0;

  const areaRaw = document.getElementById('pairs-game-area');
  const scoreRaw = document.getElementById('pairs-score');
  const startRaw = document.getElementById('pairs-start-btn');
  const overRaw = document.getElementById('pairs-game-over');

  if (!areaRaw || !scoreRaw || !startRaw || !overRaw) return;

  const gameArea = areaRaw;
  const scoreEl = scoreRaw;
  const startBtn = startRaw;
  const gameOverEl = overRaw;

  function createCards(): void {
    const selected = shuffle(PAIR_IMAGES).slice(0, NUM_PAIRS);
    const cardImages = shuffle([...selected, ...selected]);
    gameArea.innerHTML = '';
    cardImages.forEach((img) => {
      const card = document.createElement('div');
      card.className = 'pair-card';
      card.dataset.img = img;
      card.innerHTML = `
                <div class="card-inner">
                    <div class="card-front"></div>
                    <div class="card-back"><img src="${img}" alt="фрукт"></div>
                </div>
            `;
      card.addEventListener('click', () => flipCard(card));
      gameArea.appendChild(card);
    });
    gameArea.style.display = 'grid';
    gameArea.style.gridTemplateColumns = 'repeat(4, 1fr)';
    gameArea.style.gap = '1rem';
    score = 0;
    matchedPairs = 0;
    scoreEl.textContent = String(score);
    gameOverEl.style.display = 'none';
  }

  function flipCard(card: HTMLElement): void {
    if (lockBoard || card.classList.contains('matched') || card.classList.contains('flipped')) return;
    card.classList.add('flipped');
    if (!firstCard) {
      firstCard = card;
      return;
    }
    secondCard = card;
    lockBoard = true;
    if (firstCard.dataset.img === secondCard.dataset.img) {
      setTimeout(() => {
        firstCard?.classList.add('matched');
        secondCard?.classList.add('matched');
        score++;
        matchedPairs++;
        scoreEl.textContent = String(score);
        resetBoard();
        if (matchedPairs === NUM_PAIRS) showGameOver();
      }, 400);
    } else {
      setTimeout(() => {
        firstCard?.classList.remove('flipped');
        secondCard?.classList.remove('flipped');
        resetBoard();
      }, 800);
    }
  }

  function resetBoard(): void {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
  }

  function showGameOver(): void {
    gameOverEl.className = 'game-over-panel';
    gameOverEl.style.display = 'flex';
    gameOverEl.innerHTML = `
            <div class="game-over-title">Вітаємо!</div>
            <div class="game-over-score">Ви знайшли всі пари! Ваш рахунок: <b>${score}</b></div>
            <button type="button" id="pairs-restart-btn" class="game-over-btn">Зіграти ще</button>
        `;
    const restart = document.getElementById('pairs-restart-btn');
    if (restart) {
      restart.addEventListener('click', () => {
        gameOverEl.style.display = 'none';
      });
    }
  }

  startBtn.addEventListener('click', createCards);
}
