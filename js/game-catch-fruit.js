// Гра 'Піймай фрукт'
export async function loadGame1Page() {
    const mainContent = document.getElementById('main-content');
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
                <button id="catch-instruction-btn" class="btn btn-primary">Почати гру</button>
            </div>
            <div class="game-container catch-fruit-game">
                <div id="game-area">
                    <img id="basket" src="images/basket.png" alt="Кошик">
                </div>
                <div class="game-info">
                    <span class="lives-label">Життя: <b>3</b></span>
                    <span class="score-label">Бали: <b>0</b></span>
                </div>
                <button id="start-game-btn" class="btn btn-primary" style="display:none;">Старт</button>
                <div id="game-over" style="display:none;"></div>
            </div>
        </div>
    `;
    const instruction = document.getElementById('catch-instruction');
    const startBtn = document.getElementById('start-game-btn');
    document.getElementById('catch-instruction-btn').onclick = function() {
        instruction.style.display = 'none';
        startBtn.style.display = 'block';
    };
    const gameArea = document.getElementById('game-area');
    const basket = document.getElementById('basket');
    const gameOverEl = document.getElementById('game-over');
    const gameWidth = 400;
    const gameHeight = 500;
    const basketWidth = 80;
    const basketHeight = 60;
    const minFruitSize = 32;
    const maxFruitSize = 60;
    const minFruitSpeed = 3;
    const maxFruitSpeed = 8;
    const fruitImages = [
        'images/apple.png',
        'images/banana.png',
        'images/orange.png',
        'images/strawberry.png',
        'images/lemon.png',
        'images/grapefruit.png'
    ];
    const wormImage = 'images/worm.png';
    const wormChance = 0.18;
    let score = 0;
    let lives = 3;
    let basketX = (gameWidth - basketWidth) / 2;
    let fruits = [];
    let gameInterval = null;
    let fruitInterval = null;
    let isGameActive = false;
    let isGameOver = false;
    gameArea.style.position = 'relative';
    gameArea.style.width = gameWidth + 'px';
    gameArea.style.height = gameHeight + 'px';
    gameArea.style.background = '#f8f9fa';
    gameArea.style.margin = '0 auto 2rem';
    gameArea.style.border = '2px solid #4CAF50';
    gameArea.style.overflow = 'hidden';
    basket.style.position = 'absolute';
    basket.style.width = basketWidth + 'px';
    basket.style.height = basketHeight + 'px';
    basket.style.bottom = '0';
    basket.style.left = basketX + 'px';
    basket.style.transition = 'left 0.08s linear';
    basket.style.userSelect = 'none';
    gameArea.onmousemove = function(e) {
        if (!isGameActive) return;
        const rect = gameArea.getBoundingClientRect();
        let mouseX = e.clientX - rect.left;
        basketX = Math.min(Math.max(mouseX - basketWidth / 2, 0), gameWidth - basketWidth);
        basket.style.left = basketX + 'px';
    };
    document.onkeydown = function(e) {
        if (!isGameActive) return;
        if (e.key === 'ArrowLeft') basketX = Math.max(0, basketX - 30);
        if (e.key === 'ArrowRight') basketX = Math.min(gameWidth - basketWidth, basketX + 30);
        basket.style.left = basketX + 'px';
    };
    const updateScoreLives = () => {
        document.querySelector('.game-info').innerHTML = `<span class="lives-label">Життя: <b>${lives}</b></span> <span class="score-label">Бали: <b>${score}</b></span>`;
    };
    function createFruit() {
        const isWorm = Math.random() < wormChance;
        const fruit = document.createElement('img');
        fruit.src = isWorm ? wormImage : fruitImages[Math.floor(Math.random() * fruitImages.length)];
        fruit.className = isWorm ? 'falling-worm' : 'falling-fruit';
        fruit.dataset.type = isWorm ? 'worm' : 'fruit';
        const size = isWorm ? 48 : Math.floor(Math.random() * (maxFruitSize - minFruitSize + 1)) + minFruitSize;
        const speed = isWorm ? Math.floor(Math.random() * 3) + 4 : Math.floor(Math.random() * (maxFruitSpeed - minFruitSpeed + 1)) + minFruitSpeed;
        fruit.dataset.speed = speed;
        fruit.style.position = 'absolute';
        fruit.style.width = size + 'px';
        fruit.style.height = size + 'px';
        fruit.style.left = Math.floor(Math.random() * (gameWidth - size)) + 'px';
        fruit.style.top = '-60px';
        fruit.style.transition = 'filter 0.2s';
        gameArea.appendChild(fruit);
        fruits.push(fruit);
    }
    function updateFruits() {
        for (let i = fruits.length - 1; i >= 0; i--) {
            const fruit = fruits[i];
            let top = parseInt(fruit.style.top);
            const speed = parseInt(fruit.dataset.speed);
            top += speed;
            fruit.style.top = top + 'px';
            const size = parseInt(fruit.style.width);
            const fruitLeft = parseInt(fruit.style.left);
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
    function startGame() {
        score = 0;
        lives = 3;
        basketX = (gameWidth - basketWidth) / 2;
        fruits.forEach(fruit => fruit.remove());
        fruits = [];
        updateScoreLives();
        basket.style.left = basketX + 'px';
        isGameActive = true;
        isGameOver = false;
        gameOverEl.style.display = 'none';
        startBtn.style.display = 'none';
        gameInterval = setInterval(updateFruits, 20);
        fruitInterval = setInterval(createFruit, 1000);
    }
    function endGame(caughtWorm) {
        isGameActive = false;
        isGameOver = true;
        clearInterval(gameInterval);
        clearInterval(fruitInterval);
        startBtn.style.display = 'block';
        gameOverEl.style.display = 'flex';
        gameOverEl.className = 'game-over-panel';
        let msg = caughtWorm
            ? '<div class="game-over-title">Ой! Ви зловили хробака!</div>'
            : '<div class="game-over-title">Гру завершено! Ви втратили всі життя.</div>';
        gameOverEl.innerHTML = `
            <div>
                ${msg}
                <div class="game-over-score">Ваш рахунок: <b>${score}</b></div>
                <button id="restart-btn" class="game-over-btn">Зіграти ще</button>
            </div>
        `;
        document.getElementById('restart-btn').onclick = function() {
            gameOverEl.style.display = 'none';
            startGame();
        };
    }
    startBtn.onclick = startGame;
} 