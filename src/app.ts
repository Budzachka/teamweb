import '@public/css/style.css';
import { checkUserName, showUserGreeting, setupNavigation, loadHomePage } from './main';
import { loadCatalogPage } from './catalog';
import { loadGame1Page } from './game-catch-fruit';
import { loadGame2Page } from './game-find-pairs';

export async function loadPage(page: string): Promise<void> {
  document.onkeydown = null;

  const userName = localStorage.getItem('userName');
  showUserGreeting();

  if ((page === 'game1' || page === 'game2') && !userName) {
    const main = document.getElementById('main-content');
    if (main) handleUnauthorizedAccess(main);
    return;
  }

  await loadPageContent(page);
}

async function loadPageContent(page: string): Promise<void> {
  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;

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
                                    <p>Цей веб-сайт розробила студентка КН-41 як семестровий проєкт на предмет TypeScript:</p>
                                    <ul>
                                        <li>Будзак Анастасія Іванівна</li>
                                    </ul>
                                    <p>Мета сайту - краще ознайомитись з корисними властивостями овочів та фруктів.</p>
                                    <p>Сайт створений для того, щоб зробити навчання про здорове харчування цікавим та захоплюючим. Сайт пропонує:</p>
                                    <ul>
                                        <li>Інтерактивний каталог фруктів та овочів</li>
                                        <li>Цікаві ігри для вивчення продуктів</li>
                                        <li>Корисну інформацію про корисні властивості продуктів</li>
                                    </ul>
                                    <p>Приєднуйтесь до подорожі у здоровий спосіб життя!</p>
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

function handleUnauthorizedAccess(mainContent: HTMLElement): void {
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
      void loadPage('home');
    });
  }
}

window.loadPage = loadPage;

document.addEventListener('DOMContentLoaded', () => {
  checkUserName();
  setupNavigation();
  void loadPage('home');
  const brand = document.querySelector<HTMLElement>('.navbar-brand');
  if (brand) {
    brand.style.cursor = 'pointer';
    brand.onclick = () => void loadPage('home');
  }
});
