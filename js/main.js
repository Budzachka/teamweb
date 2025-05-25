export function checkUserName() {
    const userName = localStorage.getItem('userName');
    if (userName) {
        updateGreeting(userName);
    } else {
        showUserGreeting();
    }
}

export function updateGreeting(name) {
    const userGreeting = document.getElementById('user-greeting');
    userGreeting.innerHTML = `
        <span id="greeting-name" style="cursor:pointer;">Вітаємо, ${name}!</span>
        <button id="logout-btn" class="btn btn-sm btn-outline-danger" style="display:none; margin-left:10px;">Вийти</button>
    `;
    userGreeting.style.display = 'block';
    const greetingName = document.getElementById('greeting-name');
    const logoutBtn = document.getElementById('logout-btn');
    greetingName.addEventListener('click', (e) => {
        userGreeting.classList.remove('greeting-animate');
        void userGreeting.offsetWidth;
        userGreeting.classList.add('greeting-animate');
        setTimeout(() => userGreeting.classList.remove('greeting-animate'), 600);
        logoutBtn.style.display = logoutBtn.style.display === 'none' ? 'inline-block' : 'none';
        e.stopPropagation();
    });
    logoutBtn.addEventListener('click', (e) => {
        localStorage.removeItem('userName');
        showUserGreeting();
        loadPage('home');
        e.stopPropagation();
    });
    document.addEventListener('click', function handler(e) {
        if (!userGreeting.contains(e.target)) {
            logoutBtn.style.display = 'none';
        }
    });
}

export function showUserGreeting() {
    const userGreeting = document.getElementById('user-greeting');
    const userName = localStorage.getItem('userName');
    if (userName) {
        updateGreeting(userName);
    } else {
        userGreeting.textContent = '';
        userGreeting.style.display = 'none';
    }
}

export function setupNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.getAttribute('href').substring(1);
            loadPage(page);
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            e.target.classList.add('active');
        });
    });
    const hamburger = document.querySelector('.hamburger');
    const navbarMenu = document.querySelector('.navbar-menu');
    if (hamburger && navbarMenu) {
        let menuHover = false;
        let hamburgerHover = false;
        hamburger.addEventListener('mouseenter', () => {
            hamburger.classList.add('active');
            navbarMenu.classList.add('active');
            hamburgerHover = true;
        });
        hamburger.addEventListener('mouseleave', () => {
            hamburgerHover = false;
            setTimeout(() => {
                if (!menuHover && !hamburgerHover) {
                    hamburger.classList.remove('active');
                    navbarMenu.classList.remove('active');
                }
            }, 100);
        });
        navbarMenu.addEventListener('mouseenter', () => {
            navbarMenu.classList.add('active');
            hamburger.classList.add('active');
            menuHover = true;
        });
        navbarMenu.addEventListener('mouseleave', () => {
            menuHover = false;
            setTimeout(() => {
                if (!menuHover && !hamburgerHover) {
                    hamburger.classList.remove('active');
                    navbarMenu.classList.remove('active');
                }
            }, 100);
        });
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            navbarMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
        document.addEventListener('click', (e) => {
            if (!navbarMenu.contains(e.target) && !hamburger.contains(e.target)) {
                navbarMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    }
    const userName = localStorage.getItem('userName');
    document.querySelectorAll('.nav-link-game').forEach(link => {
        if (!userName) {
            link.classList.add('disabled');
            link.setAttribute('title', 'Доступно після авторизації');
        } else {
            link.classList.remove('disabled');
            link.removeAttribute('title');
        }
    });
}

export async function loadHomePage() {
    const userName = localStorage.getItem('userName');
    let authBlock = '';
    if (!userName) {
        authBlock = `
            <div class="auth-block">
                <div class="loader"></div>
                <h2>Введіть своє ім'я для доступу до ігор</h2>
                <form id="auth-form">
                    <input type="text" id="auth-name" placeholder="Ваше ім'я" required maxlength="20">
                    <button type="submit" class="btn btn-primary">OK</button>
                </form>
                <p class="auth-info">Щоб грати в ігри, спочатку введіть своє ім'я!</p>
            </div>
        `;
    }
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="container">
            ${authBlock}
            <section class="hero">
                <div class="hero-content">
                    <div class="hero-text-content">
                        <h1>Ласкаво просимо у світ фруктів та овочів!</h1>
                        <p class="hero-text">Раді вітати вас на нашому яскравому інформаційному сайті про фрукти та овочі! Ми віримо, що ці дари природи роблять наше життя яскравішим і смачнішим.</p>
                    </div>
                    <img src="images/welcome.jpg" alt="Ласкаво просимо" class="hero-image">
                </div>
            </section>
            <section class="content-section">
                <div class="section-content">
                    <div class="text-content">
                        <h2>Чому варто любити овочі та фрукти</h2>
                        <p>Фрукти та овочі – це справжня скарбниця природи. Вони наповнені вітамінами та мінералами, які роблять ваш імунітет сильнішим, а тіло – міцнішим та витривалішим.</p>
                    </div>
                    <img src="images/catalog.jpg" alt="Фрукти та овочі" class="section-image">
                </div>
            </section>
            <section class="content-section">
                <div class="section-content reverse">
                    <div class="text-content">
                        <h2>Користь для здоров'я: вітаміни, мінерали і клітковина</h2>
                        <p>Коли ми їмо фрукти та овочі, ми отримуємо безліч корисних речовин. Наприклад, апельсини багаті на вітамін C, який допомагає не хворіти взимку та дарує шкірі яскравий відтінок.</p>
                    </div>
                    <img src="images/recommend.jpg" alt="Користь для здоров'я" class="section-image">
                </div>
            </section>
            <section class="content-section">
                <div class="section-content">
                    <div class="text-content">
                        <h2>Коли фрукти та овочі можуть бути шкідливими</h2>
                        <p>Хоча фрукти та овочі дуже корисні, іноді потрібно бути обережними. Деякі люди можуть мати на них алергію – наприклад, ягоди чи горіхи можуть викликати почервоніння чи свербіння.</p>
                    </div>
                    <img src="images/danger.jpg" alt="Обережність" class="section-image">
                </div>
            </section>
            <section class="content-section recommendations-section">
                <h2>Рекомендації щодо вживання: як, коли і скільки</h2>
                <div class="recommendations">
                    <div class="recommendation-item">
                        <h3>Різноманітність</h3>
                        <p>Обирайте фрукти та овочі різних кольорів (червоні, жовті, зелені, фіолетові).</p>
                    </div>
                    <div class="recommendation-item">
                        <h3>Сезонність</h3>
                        <p>Найсмачніше й найкорисніше – те, що росте у вашій місцевості зараз.</p>
                    </div>
                    <div class="recommendation-item">
                        <h3>Обсяг</h3>
                        <p>Нехай на тарілці при кожному прийомі їжі буде хоча б трохи овочів або фруктів.</p>
                    </div>
                    <div class="recommendation-item">
                        <h3>Час</h3>
                        <p>Фрукти чудово їсти як перекус удень або як легкий десерт після обіду.</p>
                    </div>
                </div>
                <div class="recommendations-btns">
                    <a href="#catalog" class="btn btn-primary recommendations-catalog-btn">Перейти до каталогу</a>
                </div>
            </section>
            <section class="cta-section">
                <div class="cta-content">
                    <h2 class="cta-title">Готові до веселощів?</h2>
                    <p class="cta-text">Переходьте до наших захоплюючих ігор та перевірте свої знання про фрукти та овочі! Збирайте бали, вигравайте призи та дізнавайтеся нове про здорове харчування!</p>
                    <img src="images/game.jpg" alt="Гра" class="cta-image">
                    <div class="cta-buttons">
                        <a href="#game1" class="btn btn-secondary cta-game1-btn">Грати в "Піймай фрукт"</a>
                        <a href="#game2" class="btn btn-secondary cta-game2-btn">Грати в "Знайди подібні"</a>
                    </div>
                </div>
            </section>
            <section class="final-section">
                <img src="images/final.jpg" alt="Фінальне зображення" class="final-image">
                <p class="final-text">Дякуємо, що завітали до нас! Сподіваємося, що наш сайт допоможе вам і вашій родині полюбити фрукти та овочі ще більше.</p>
            </section>
        </div>
    `;
    if (!userName) {
        const authBlockEl = document.querySelector('.auth-block');
        setTimeout(() => authBlockEl.classList.add('visible'), 30);
        const form = document.getElementById('auth-form');
        form.onsubmit = function(e) {
            e.preventDefault();
            const name = document.getElementById('auth-name').value.trim();
            if (name) {
                authBlockEl.classList.add('loading');
                setTimeout(() => {
                    authBlockEl.classList.remove('visible');
                    authBlockEl.classList.add('hide');
                    setTimeout(() => {
                        localStorage.setItem('userName', name);
                        updateGreeting(name);
                        loadPage('home');
                    }, 400);
                }, 600);
            }
        };
    }
    const catalogBtn = document.querySelector('.cta-catalog-btn');
    const game1Btn = document.querySelector('.cta-game1-btn');
    const game2Btn = document.querySelector('.cta-game2-btn');
    const recommendationsCatalogBtn = document.querySelector('.recommendations-catalog-btn');
    const homeAuthBtn = document.querySelector('.auth-warning .btn');
    if (catalogBtn) {
        catalogBtn.addEventListener('click', function(e) {
            e.preventDefault();
            loadPage('catalog');
        });
    }
    if (game1Btn) {
        game1Btn.addEventListener('click', function(e) {
            e.preventDefault();
            loadPage('game1');
        });
    }
    if (game2Btn) {
        game2Btn.addEventListener('click', function(e) {
            e.preventDefault();
            loadPage('game2');
        });
    }
    if (recommendationsCatalogBtn) {
        recommendationsCatalogBtn.addEventListener('click', function(e) {
            e.preventDefault();
            loadPage('catalog');
        });
    }
    if (homeAuthBtn) {
        homeAuthBtn.addEventListener('click', function(e) {
            e.preventDefault();
            loadPage('home');
        });
    }
} 