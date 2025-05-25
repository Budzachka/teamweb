// Гра 'Знайди подібні'
export async function loadGame2Page() {
    const mainContent = document.getElementById('main-content');
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
                <button id="pairs-start-btn" class="btn btn-primary">Старт</button>
                <div id="pairs-game-over" style="display:none;"></div>
            </div>
        </div>
    `;
    const images = [
        'images/apple.png',
        'images/banana.png',
        'images/orange.png',
        'images/strawberry.png',
        'images/lemon.png',
        'images/grapefruit.png',
        'images/cabbage.png',
        'images/beetroot.png',
        'images/carrot.jpg',
        'images/lettuce.png'
    ];
    const numPairs = 6;
    let cards = [];
    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let score = 0;
    let matchedPairs = 0;
    const gameArea = document.getElementById('pairs-game-area');
    const scoreEl = document.getElementById('pairs-score');
    const startBtn = document.getElementById('pairs-start-btn');
    const gameOverEl = document.getElementById('pairs-game-over');
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    function createCards() {
        const selected = shuffle(images.slice()).slice(0, numPairs);
        const cardImages = shuffle([...selected, ...selected]);
        gameArea.innerHTML = '';
        cards = [];
        cardImages.forEach((img, idx) => {
            const card = document.createElement('div');
            card.className = 'pair-card';
            card.dataset.img = img;
            card.innerHTML = `
                <div class="card-inner">
                    <div class="card-front"></div>
                    <div class="card-back"><img src="${img}" alt="фрукт"></div>
                </div>
            `;
            card.onclick = () => flipCard(card);
            gameArea.appendChild(card);
            cards.push(card);
        });
        gameArea.style.display = 'grid';
       // gameArea.style.gridTemplateColumns = 'repeat(auto-fit, minmax(80px, 1fr))'; // Адаптивна сітка
        gameArea.style.gap = '1rem'; // Зменшуємо відступ для мобільних
        score = 0;
        matchedPairs = 0;
        scoreEl.textContent = score;
        gameOverEl.style.display = 'none';
    }
    function flipCard(card) {
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
                firstCard.classList.add('matched');
                secondCard.classList.add('matched');
                score++;
                matchedPairs++;
                scoreEl.textContent = score;
                resetBoard();
                if (matchedPairs === numPairs) showGameOver();
            }, 400);
        } else {
            setTimeout(() => {
                firstCard.classList.remove('flipped');
                secondCard.classList.remove('flipped');
                resetBoard();
            }, 800);
        }
    }
    function resetBoard() {
        [firstCard, secondCard, lockBoard] = [null, null, false];
    }
    function showGameOver() {
        gameOverEl.className = 'game-over-panel';
        gameOverEl.style.display = 'flex';
        gameOverEl.innerHTML = `
            <div class="game-over-title">Вітаємо!</div>
            <div class="game-over-score">Ви знайшли всі пари! Ваш рахунок: <b>${score}</b></div>
            <button id="pairs-restart-btn" class="game-over-btn">Зіграти ще</button>
        `;
        document.getElementById('pairs-restart-btn').onclick = () => {
            gameOverEl.style.display = 'none';
        };
    }
    startBtn.onclick = createCards;
} 
