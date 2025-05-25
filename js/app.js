import { checkUserName, showUserGreeting, setupNavigation, loadHomePage } from './main.js';
import { loadCatalogPage } from './catalog.js';
import { loadGame1Page } from './game-catch-fruit.js';
import { loadGame2Page } from './game-find-pairs.js';

export async function loadPage(page) {
    const userName = localStorage.getItem('userName');
    showUserGreeting();
    const mainContent = document.getElementById('main-content');
    if ((page === 'game1' || page === 'game2') && !userName) {
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
        return;
    }
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
            default:
                mainContent.innerHTML = '<h1>Сторінку не знайдено</h1>';
        }
    } catch (error) {
        mainContent.innerHTML = '<h1>Помилка завантаження сторінки</h1>';
        console.error(error);
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