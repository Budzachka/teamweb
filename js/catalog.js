async function fetchCatalogData() {
    try {
        const response = await fetch('data/fruits.json');
        return await response.json();
    } catch (error) {
        throw new Error('Помилка завантаження даних:', error);
    }
}

function generateCatalogHTML(data) {
    return `
    <div class="container">
      <h1>Каталог фруктів та овочів</h1>
      <div class="search-container">
        <input type="text" id="searchInput" class="search-input" placeholder="Пошук фруктів та овочів...">
        <div class="search-results-info"></div>
      </div>
      <div class="categories-container">
        ${data.categories.map(category => `
          <div class="category-section" data-category="${category.id}">
            <div class="category-header">
              <h2 class="category-title">${category.name}</h2>
              <button class="toggle-category">
                <span class="toggle-icon">+</span>
              </button>
            </div>
            <div class="category-content">
              <div class="catalog-container">
                ${category.items.map(item => `
                  <div class="catalog-item" data-item="${item.id}">
                    <div class="item-header">
                      <img src="${item.image}" alt="${item.name}" class="item-image">
                      <h3>${item.name}</h3>
                      <button class="toggle-info">Детальніше</button>
                    </div>
                    <div class="item-info">
                      <div class="info-section">
                        <h4>Користь:</h4>
                        <p>${item.benefits}</p>
                      </div>
                      <div class="info-section">
                        <h4>Цікаві факти:</h4>
                        <p>${item.facts}</p>
                      </div>
                      <div class="info-section">
                        <h4>Поради до вживання:</h4>
                        <p>${item.tips}</p>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function setupCategoryToggles() {
    document.querySelectorAll('.toggle-category').forEach(button => {
        button.addEventListener('click', function () {
            const categoryContent = this.closest('.category-section').querySelector('.category-content');
            const toggleIcon = this.querySelector('.toggle-icon');
            categoryContent.classList.toggle('expanded');
            toggleIcon.textContent = categoryContent.classList.contains('expanded') ? '-' : '+';
        });
    });
}

function setupItemToggles() {
    document.querySelectorAll('.toggle-info').forEach(button => {
        button.addEventListener('click', function () {
            const thisItem = this.closest('.catalog-item');
            const thisInfo = thisItem.querySelector('.item-info');
            const allItems = document.querySelectorAll('.catalog-item');
            allItems.forEach(item => {
                const info = item.querySelector('.item-info');
                const btn = item.querySelector('.toggle-info');
                if (item === thisItem) {
                    const expanded = thisInfo.classList.toggle('expanded');
                    btn.textContent = expanded ? 'Згорнути' : 'Детальніше';
                } else {
                    info.classList.remove('expanded');
                    btn.textContent = 'Детальніше';
                }
            });
        });
    });
}

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchResultsInfo = document.querySelector('.search-results-info');
    const catalogItems = document.querySelectorAll('.catalog-item');
    const categories = document.querySelectorAll('.category-section');

    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        let foundItems = 0;
        let visibleCategories = 0;
        const uniqueNames = new Set();
        let exactMatches = [];

        if (searchTerm === '') {
            searchResultsInfo.textContent = '';
            searchResultsInfo.style.display = 'none';
            categories.forEach(category => {
                category.style.display = 'block';
                const categoryContent = category.querySelector('.category-content');
                categoryContent.classList.remove('expanded');
                const toggleIcon = category.querySelector('.toggle-icon');
                toggleIcon.textContent = '+';
                category.querySelectorAll('.catalog-item').forEach(item => {
                    item.style.display = 'block';
                    const itemInfo = item.querySelector('.item-info');
                    itemInfo.classList.remove('expanded');
                    const toggleButton = item.querySelector('.toggle-info');
                    toggleButton.textContent = 'Детальніше';
                });
            });
            return;
        }

        catalogItems.forEach(item => item.style.display = 'none');

        catalogItems.forEach(item => {
            const itemName = item.querySelector('h3').textContent.toLowerCase();
            if (itemName === searchTerm) {
                exactMatches.push(item);
            }
        });

        if (exactMatches.length > 0) {
            exactMatches.forEach(item => {
                if (!uniqueNames.has(item.querySelector('h3').textContent.toLowerCase())) {
                    foundItems++;
                    uniqueNames.add(item.querySelector('h3').textContent.toLowerCase());
                    item.style.display = 'block';
                    const category = item.closest('.category-section');
                    category.style.display = 'block';
                    const categoryContent = category.querySelector('.category-content');
                    categoryContent.classList.add('expanded');
                    const toggleIcon = category.querySelector('.toggle-icon');
                    toggleIcon.textContent = '-';
                }
            });
        } else {
            catalogItems.forEach(item => {
                const itemName = item.querySelector('h3').textContent.toLowerCase();
                const itemBenefits = item.querySelector('.info-section:nth-child(1) p').textContent.toLowerCase();
                const itemFacts = item.querySelector('.info-section:nth-child(2) p').textContent.toLowerCase();
                const itemTips = item.querySelector('.info-section:nth-child(3) p').textContent.toLowerCase();
                let isMatch = false;
                if (itemName.includes(searchTerm) || itemBenefits.includes(searchTerm) || itemFacts.includes(searchTerm) || itemTips.includes(searchTerm)) {
                    isMatch = true;
                }
                if (isMatch && !uniqueNames.has(itemName)) {
                    foundItems++;
                    uniqueNames.add(itemName);
                    item.style.display = 'block';
                    const category = item.closest('.category-section');
                    category.style.display = 'block';
                    const categoryContent = category.querySelector('.category-content');
                    categoryContent.classList.add('expanded');
                    const toggleIcon = category.querySelector('.toggle-icon');
                    toggleIcon.textContent = '-';
                }
            });
        }

        categories.forEach(category => {
            const categoryItems = Array.from(category.querySelectorAll('.catalog-item'));
            const hasVisible = categoryItems.some(item => item.style.display !== 'none');
            if (hasVisible) {
                visibleCategories++;
                category.style.display = 'block';
            } else {
                category.style.display = 'none';
            }
        });

        searchResultsInfo.style.display = 'block';
        searchResultsInfo.textContent = foundItems > 0
            ? `Пошук: "${searchInput.value}" - знайдено ${foundItems} елементів у ${visibleCategories} категоріях`
            : `Пошук: "${searchInput.value}" - нічого не знайдено`;
    }

    searchInput.addEventListener('input', performSearch);
    searchInput.addEventListener('keyup', function (e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

export async function loadCatalogPage() {
    const mainContent = document.getElementById('main-content');
    try {
        const data = await fetchCatalogData();
        mainContent.innerHTML = generateCatalogHTML(data);
        setupCategoryToggles();
        setupItemToggles();
        setupSearch();
    } catch (error) {
        console.error(error);
        mainContent.innerHTML = '<h1>Помилка завантаження каталогу</h1>';
    }
}