const header = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
const yearSlot = document.getElementById('current-year');

const formatPrice = (value) => `${value.toLocaleString('ru-RU')} ₽`;

if (yearSlot) {
  yearSlot.textContent = String(new Date().getFullYear());
}

if (header && navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const isOpen = header.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      header.classList.remove('nav-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 760) {
      header.classList.remove('nav-open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

function initShopCatalog() {
  const catalog = document.getElementById('shop-catalog');
  if (!catalog) {
    return;
  }

  const products = [
    {
      id: 'coat-drift',
      name: 'Пальто Drift',
      color: 'Графит',
      category: 'outerwear',
      categoryLabel: 'Верхняя одежда',
      price: 9490,
      oldPrice: 11990,
      imageClass: 'product-image-1',
      badge: 'Хит',
      popularity: 98,
    },
    {
      id: 'trench-flow',
      name: 'Тренч Flow',
      color: 'Песочный',
      category: 'outerwear',
      categoryLabel: 'Верхняя одежда',
      price: 10590,
      oldPrice: 12490,
      imageClass: 'product-image-5',
      badge: 'New',
      popularity: 93,
    },
    {
      id: 'jacket-edge',
      name: 'Жакет Edge',
      color: 'Угольный',
      category: 'outerwear',
      categoryLabel: 'Верхняя одежда',
      price: 8790,
      oldPrice: 9490,
      imageClass: 'product-image-7',
      badge: 'Sale',
      popularity: 88,
    },
    {
      id: 'shirt-mono',
      name: 'Рубашка Mono',
      color: 'Молочный',
      category: 'base',
      categoryLabel: 'База',
      price: 4290,
      oldPrice: 5190,
      imageClass: 'product-image-2',
      badge: 'Хит',
      popularity: 95,
    },
    {
      id: 'longsleeve-core',
      name: 'Лонгслив Core',
      color: 'Темный беж',
      category: 'base',
      categoryLabel: 'База',
      price: 3290,
      oldPrice: 3990,
      imageClass: 'product-image-6',
      badge: 'New',
      popularity: 86,
    },
    {
      id: 'tee-silent',
      name: 'Футболка Silent',
      color: 'Белый',
      category: 'base',
      categoryLabel: 'База',
      price: 2490,
      oldPrice: 2990,
      imageClass: 'product-image-8',
      badge: 'База',
      popularity: 80,
    },
    {
      id: 'jeans-frame',
      name: 'Джинсы Frame',
      color: 'Глубокий синий',
      category: 'denim',
      categoryLabel: 'Деним',
      price: 5790,
      oldPrice: 6490,
      imageClass: 'product-image-3',
      badge: 'Хит',
      popularity: 91,
    },
    {
      id: 'jeans-line',
      name: 'Джинсы Line',
      color: 'Индиго',
      category: 'denim',
      categoryLabel: 'Деним',
      price: 5390,
      oldPrice: 6190,
      imageClass: 'product-image-4',
      badge: 'New',
      popularity: 84,
    },
    {
      id: 'denim-jacket-axis',
      name: 'Куртка Axis',
      color: 'Серый деним',
      category: 'denim',
      categoryLabel: 'Деним',
      price: 7690,
      oldPrice: 8590,
      imageClass: 'product-image-1',
      badge: 'Sale',
      popularity: 82,
    },
    {
      id: 'bag-form',
      name: 'Сумка Form',
      color: 'Черный',
      category: 'accessories',
      categoryLabel: 'Аксессуары',
      price: 6390,
      oldPrice: 7090,
      imageClass: 'product-image-4',
      badge: 'Хит',
      popularity: 94,
    },
    {
      id: 'scarf-quiet',
      name: 'Шарф Quiet',
      color: 'Кофейный',
      category: 'accessories',
      categoryLabel: 'Аксессуары',
      price: 2490,
      oldPrice: 2990,
      imageClass: 'product-image-8',
      badge: 'База',
      popularity: 76,
    },
    {
      id: 'belt-contour',
      name: 'Ремень Contour',
      color: 'Темный шоколад',
      category: 'accessories',
      categoryLabel: 'Аксессуары',
      price: 3190,
      oldPrice: 3690,
      imageClass: 'product-image-5',
      badge: 'New',
      popularity: 74,
    },
  ];

  const categoryButtons = Array.from(catalog.querySelectorAll('.filter-chip'));
  const priceRange = document.getElementById('shop-price-range');
  const minPriceLabel = document.getElementById('shop-min-price');
  const maxPriceLabel = document.getElementById('shop-max-price');
  const countLabel = document.getElementById('shop-results-count');
  const sortSelect = document.getElementById('shop-sort');
  const resetButton = document.getElementById('shop-reset-filters');
  const grid = document.getElementById('shop-grid');
  const emptyState = document.getElementById('shop-empty');

  if (
    !priceRange ||
    !minPriceLabel ||
    !maxPriceLabel ||
    !countLabel ||
    !sortSelect ||
    !resetButton ||
    !grid ||
    !emptyState
  ) {
    return;
  }

  const minPrice = Math.min(...products.map((product) => product.price));
  const maxPrice = Math.max(...products.map((product) => product.price));

  const state = {
    category: 'all',
    maxPrice,
    sort: 'popular',
  };

  priceRange.min = String(minPrice);
  priceRange.max = String(maxPrice);
  priceRange.value = String(maxPrice);

  function setActiveCategory() {
    categoryButtons.forEach((button) => {
      const isActive = button.dataset.category === state.category;
      button.classList.toggle('chip-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
  }

  function sortProducts(list) {
    const sorted = [...list];

    switch (state.sort) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name, 'ru-RU'));
        break;
      default:
        sorted.sort((a, b) => b.popularity - a.popularity);
        break;
    }

    return sorted;
  }

  function renderCatalog() {
    minPriceLabel.textContent = formatPrice(minPrice);
    maxPriceLabel.textContent = formatPrice(state.maxPrice);

    const filtered = products.filter((product) => {
      const matchCategory = state.category === 'all' || product.category === state.category;
      const matchPrice = product.price <= state.maxPrice;
      return matchCategory && matchPrice;
    });

    const visibleProducts = sortProducts(filtered);
    countLabel.textContent = String(visibleProducts.length);

    if (visibleProducts.length === 0) {
      grid.innerHTML = '';
      emptyState.hidden = false;
      return;
    }

    emptyState.hidden = true;
    grid.innerHTML = visibleProducts
      .map((product) => {
        const oldPriceHtml = product.oldPrice
          ? `<span class="price-old">${formatPrice(product.oldPrice)}</span>`
          : '';

        return `
          <article class="product-card" data-category="${product.category}" data-price="${product.price}">
            <div class="product-image ${product.imageClass}" aria-hidden="true">
              <span class="product-badge">${product.badge}</span>
            </div>
            <div class="product-meta">
              <h3>${product.name}</h3>
              <p>${product.color} · ${product.categoryLabel}</p>
              <div class="price-row">
                <span class="price">${formatPrice(product.price)}</span>
                ${oldPriceHtml}
              </div>
              <a class="card-action" href="product.html">Открыть</a>
            </div>
          </article>
        `;
      })
      .join('');
  }

  categoryButtons.forEach((button) => {
    button.addEventListener('click', () => {
      state.category = button.dataset.category || 'all';
      setActiveCategory();
      renderCatalog();
    });
  });

  priceRange.addEventListener('input', (event) => {
    const nextValue = Number(event.target.value);
    state.maxPrice = Number.isNaN(nextValue) ? maxPrice : nextValue;
    renderCatalog();
  });

  sortSelect.addEventListener('change', (event) => {
    state.sort = event.target.value;
    renderCatalog();
  });

  resetButton.addEventListener('click', () => {
    state.category = 'all';
    state.maxPrice = maxPrice;
    state.sort = 'popular';

    priceRange.value = String(maxPrice);
    sortSelect.value = 'popular';

    setActiveCategory();
    renderCatalog();
  });

  setActiveCategory();
  renderCatalog();
}

initShopCatalog();

function initProductPage() {
  const productPage = document.getElementById('product-page');
  if (!productPage) {
    return;
  }

  const mainPhoto = document.getElementById('product-main-photo');
  const thumbs = Array.from(productPage.querySelectorAll('.product-thumb[data-image-class]'));
  const sizeButtons = Array.from(productPage.querySelectorAll('.option-button[data-size]'));
  const colorButtons = Array.from(productPage.querySelectorAll('.option-button[data-color]'));
  const qtyInput = document.getElementById('product-qty');
  const qtyButtons = Array.from(productPage.querySelectorAll('.qty-button[data-qty-change]'));
  const productForm = document.getElementById('product-form');
  const feedback = document.getElementById('product-feedback');
  const cartBadge = document.querySelector('.header-cart span');
  const tabButtons = Array.from(productPage.querySelectorAll('.tab-button[data-tab]'));
  const tabPanels = Array.from(productPage.querySelectorAll('.tab-panel[data-tab-panel]'));

  if (!mainPhoto || !qtyInput || !productForm || !feedback) {
    return;
  }

  const imageClasses = Array.from(
    new Set(thumbs.map((button) => button.dataset.imageClass).filter(Boolean))
  );

  const state = {
    size: sizeButtons.find((button) => button.classList.contains('is-active'))?.dataset.size || 'S',
    color: colorButtons.find((button) => button.classList.contains('is-active'))?.dataset.color || 'Графит',
    quantity: Number(qtyInput.value) || 1,
  };

  function toggleOption(buttons, currentButton) {
    buttons.forEach((button) => {
      const isActive = button === currentButton;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
  }

  function setQuantity(value) {
    const numericValue = Number(value);
    const normalized = Number.isFinite(numericValue) ? Math.max(1, Math.min(10, numericValue)) : 1;
    state.quantity = normalized;
    qtyInput.value = String(normalized);
  }

  thumbs.forEach((button) => {
    button.addEventListener('click', () => {
      const nextClass = button.dataset.imageClass;
      if (!nextClass) {
        return;
      }

      mainPhoto.classList.remove(...imageClasses);
      mainPhoto.classList.add(nextClass);

      thumbs.forEach((thumb) => {
        const isActive = thumb === button;
        thumb.classList.toggle('is-active', isActive);
        thumb.setAttribute('aria-pressed', String(isActive));
      });
    });
  });

  sizeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      state.size = button.dataset.size || 'S';
      toggleOption(sizeButtons, button);
    });
  });

  colorButtons.forEach((button) => {
    button.addEventListener('click', () => {
      state.color = button.dataset.color || 'Графит';
      toggleOption(colorButtons, button);
    });
  });

  qtyButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const delta = Number(button.dataset.qtyChange);
      setQuantity(state.quantity + delta);
    });
  });

  qtyInput.addEventListener('input', (event) => {
    setQuantity(Number(event.target.value));
  });

  function openTab(tabName) {
    tabButtons.forEach((button) => {
      const isActive = button.dataset.tab === tabName;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-selected', String(isActive));
      button.setAttribute('tabindex', isActive ? '0' : '-1');
    });

    tabPanels.forEach((panel) => {
      const isActive = panel.dataset.tabPanel === tabName;
      panel.classList.toggle('is-active', isActive);
      panel.hidden = !isActive;
    });
  }

  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const tabName = button.dataset.tab;
      if (!tabName) {
        return;
      }
      openTab(tabName);
    });
  });

  productForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const message = `Добавлено: Пальто Drift, размер ${state.size}, цвет ${state.color}, ${state.quantity} шт.`;
    feedback.textContent = message;
    feedback.classList.remove('is-error');
    feedback.classList.add('is-success');

    if (cartBadge) {
      const currentCount = Number.parseInt(cartBadge.textContent, 10) || 0;
      cartBadge.textContent = String(currentCount + state.quantity);
    }
  });

  openTab(tabButtons.find((button) => button.classList.contains('is-active'))?.dataset.tab || 'description');
  setQuantity(state.quantity);
}

initProductPage();
