import { checkUserName, showUserGreeting, setupNavigation, loadHomePage } from './main.js';
import { loadCatalogPage } from './catalog.js';
import { loadGame1Page } from './game-catch-fruit.js';
import { loadGame2Page } from './game-find-pairs.js';

export async function loadPage(page) {
    const userName = localStorage.getItem('userName');
    showUserGreeting();

    if ((page === 'game1' || page === 'game2') && !userName) {
        handleUnauthorizedAccess(document.getElementById('main-content'));
        return;
    }

    await loadPageContent(page);
}

async function loadPageContent(page) {
    const mainContent = document.getElementById('main-content');

    try {
        switch (page) {
            case 'home':
                await loadHomePage();
                break;
            case 'catalog':
                await loadCatalogPage();
                break;
            case 'game1':
                await loadGame1Page();
                break;
            case 'game2':
                await loadGame2Page();
                break;
            case 'about':
                mainContent.innerHTML = `
                    <section id="about" class="section">
                        <div class="container">
                            <div class="about-content">
                                <div class="about-text">
                                    <p>Цей веб-сайт розробили студенти КН-31 як командний проєкт на предмет WEB-програмування:</p>
                                    <ul>
                                        <li>Будзак Анастасія Іванівна</li>
                                        <li>Валько Назар Андрійович</li>
                                        <li>Гетьманська Олександра Сергіївна</li>
                                    </ul>
                                    <p>Мета сайту - краще ознайомитись з корисними властивостями овочів та фруктів.</p>
                                    <p>Наш сайт створений для того, щоб зробити навчання про здорове харчування цікавим та захоплюючим. Ми пропонуємо:</p>
                                    <ul>
                                        <li>Інтерактивний каталог фруктів та овочів</li>
                                        <li>Цікаві ігри для вивчення продуктів</li>
                                        <li>Корисну інформацію про корисні властивості продуктів</li>
                                    </ul>
                                    <p>Приєднуйтесь до нас у цій подорожі до здорового способу життя!</p>
                                </div>
                            </div>
                        </div>
                    </section>
                `;
                break;
            default:
                mainContent.innerHTML = '<h1>Сторінку не знайдено</h1>';
        }
    } catch (error) {
        mainContent.innerHTML = '<h1>Помилка завантаження сторінки</h1>';
        console.error(error);
    }
}

function handleUnauthorizedAccess(mainContent) {
    mainContent.innerHTML = `
        <div class="container">
            <div class="auth-warning">
                <h2>Доступ до ігор можливий лише після авторизації!</h2>
                <p>Будь ласка, введіть своє ім'я на головній сторінці.</p>
                <button class="btn btn-primary" id="go-home-btn">На головну</button>
            </div>
        </div>
    `;

    const goHomeBtn = document.getElementById('go-home-btn');
    if (goHomeBtn) {
        goHomeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loadPage('home');
        });
    }
}

window.loadPage = loadPage;

document.addEventListener('DOMContentLoaded', () => {
    checkUserName();
    setupNavigation();
    loadPage('home');
    const brand = document.querySelector('.navbar-brand');
    if (brand) {
        brand.style.cursor = 'pointer';
        brand.onclick = () => loadPage('home');
    }
}); 
