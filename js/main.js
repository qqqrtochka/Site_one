const header = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
const yearSlot = document.getElementById('current-year');

const CART_STORAGE_KEY = 'noir_atelier_cart_v1';

const SHOP_PRODUCTS = [
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

function formatPrice(value) {
  return `${value.toLocaleString('ru-RU')} ₽`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function normalizeImageClass(value) {
  if (typeof value !== 'string') {
    return 'product-image-1';
  }

  const matched = value.match(/product-image-\d+/);
  return matched ? matched[0] : 'product-image-1';
}

function normalizeCartItem(rawItem) {
  if (!rawItem || typeof rawItem !== 'object') {
    return null;
  }

  const id = String(rawItem.id || '').trim();
  const name = String(rawItem.name || '').trim();
  const price = Number(rawItem.price);

  if (!id || !name || !Number.isFinite(price) || price <= 0) {
    return null;
  }

  const oldPriceNumber = Number(rawItem.oldPrice);
  const oldPrice = Number.isFinite(oldPriceNumber) && oldPriceNumber > price ? oldPriceNumber : null;
  const quantityNumber = Math.trunc(Number(rawItem.quantity));
  const quantity = Number.isFinite(quantityNumber) ? Math.max(1, Math.min(99, quantityNumber)) : 1;

  return {
    id,
    name,
    price,
    oldPrice,
    color: String(rawItem.color || 'Не указан').trim(),
    size: String(rawItem.size || 'One Size').trim(),
    imageClass: normalizeImageClass(rawItem.imageClass),
    quantity,
    url: String(rawItem.url || 'product.html').trim(),
  };
}

function getStoredCart() {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.map(normalizeCartItem).filter(Boolean);
  } catch (error) {
    return [];
  }
}

function setStoredCart(items) {
  const normalized = Array.isArray(items) ? items.map(normalizeCartItem).filter(Boolean) : [];

  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(normalized));
  } catch (error) {
    return;
  }
}

function calculateCartTotals(cartItems) {
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = subtotal > 0 ? 0 : 0;

  return {
    itemCount,
    subtotal,
    delivery,
    total: subtotal + delivery,
  };
}

function updateHeaderCartCount() {
  const cart = getStoredCart();
  const { itemCount } = calculateCartTotals(cart);

  document.querySelectorAll('.header-cart span').forEach((badge) => {
    badge.textContent = String(itemCount);
  });
}

function addItemToCart(item) {
  const normalized = normalizeCartItem(item);
  if (!normalized) {
    return;
  }

  const cart = getStoredCart();
  const existingIndex = cart.findIndex(
    (line) => line.id === normalized.id && line.size === normalized.size && line.color === normalized.color
  );

  if (existingIndex >= 0) {
    cart[existingIndex].quantity = Math.min(99, cart[existingIndex].quantity + normalized.quantity);
  } else {
    cart.push(normalized);
  }

  setStoredCart(cart);
  updateHeaderCartCount();
}

function removeItemFromCartByIndex(index) {
  const cart = getStoredCart();

  if (!Number.isInteger(index) || index < 0 || index >= cart.length) {
    return;
  }

  cart.splice(index, 1);
  setStoredCart(cart);
  updateHeaderCartCount();
}

function setCartItemQuantityByIndex(index, quantity) {
  const cart = getStoredCart();
  if (!Number.isInteger(index) || index < 0 || index >= cart.length) {
    return;
  }

  const nextQuantity = Math.max(1, Math.min(99, Math.trunc(Number(quantity) || 1)));
  cart[index].quantity = nextQuantity;

  setStoredCart(cart);
  updateHeaderCartCount();
}

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

  const categoryButtons = Array.from(catalog.querySelectorAll('.filter-chip'));
  const priceRange = document.getElementById('shop-price-range');
  const minPriceLabel = document.getElementById('shop-min-price');
  const maxPriceLabel = document.getElementById('shop-max-price');
  const countLabel = document.getElementById('shop-results-count');
  const sortSelect = document.getElementById('shop-sort');
  const resetButton = document.getElementById('shop-reset-filters');
  const grid = document.getElementById('shop-grid');
  const emptyState = document.getElementById('shop-empty');
  const feedback = document.getElementById('shop-feedback');

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

  const minPrice = Math.min(...SHOP_PRODUCTS.map((product) => product.price));
  const maxPrice = Math.max(...SHOP_PRODUCTS.map((product) => product.price));

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

    const filtered = SHOP_PRODUCTS.filter((product) => {
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
              <h3>${escapeHtml(product.name)}</h3>
              <p>${escapeHtml(product.color)} · ${escapeHtml(product.categoryLabel)}</p>
              <div class="price-row">
                <span class="price">${formatPrice(product.price)}</span>
                ${oldPriceHtml}
              </div>
              <div class="shop-card-actions">
                <a class="card-action" href="product.html">Открыть</a>
                <button class="card-action card-action-add" type="button" data-action="add-to-cart" data-product-id="${product.id}">В корзину</button>
              </div>
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

    if (feedback) {
      feedback.textContent = '';
      feedback.classList.remove('is-success', 'is-error');
    }

    setActiveCategory();
    renderCatalog();
  });

  grid.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action="add-to-cart"]');
    if (!button) {
      return;
    }

    const productId = button.dataset.productId;
    const product = SHOP_PRODUCTS.find((item) => item.id === productId);
    if (!product) {
      return;
    }

    addItemToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      oldPrice: product.oldPrice,
      color: product.color,
      size: 'M',
      imageClass: product.imageClass,
      quantity: 1,
      url: 'product.html',
    });

    if (feedback) {
      feedback.textContent = `Добавлено в корзину: ${product.name}`;
      feedback.classList.remove('is-error');
      feedback.classList.add('is-success');
    }
  });

  setActiveCategory();
  renderCatalog();
}

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
  const tabButtons = Array.from(productPage.querySelectorAll('.tab-button[data-tab]'));
  const tabPanels = Array.from(productPage.querySelectorAll('.tab-panel[data-tab-panel]'));

  if (!mainPhoto || !qtyInput || !productForm || !feedback) {
    return;
  }

  const baseProduct = SHOP_PRODUCTS.find((product) => product.id === 'coat-drift') || {
    id: 'coat-drift',
    name: 'Пальто Drift',
    price: 9490,
    oldPrice: 11990,
    imageClass: 'product-image-1',
  };

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
    const normalized = Number.isFinite(numericValue) ? Math.max(1, Math.min(10, Math.trunc(numericValue))) : 1;
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
    setQuantity(event.target.value);
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

    const currentImageClass = imageClasses.find((className) => mainPhoto.classList.contains(className)) || baseProduct.imageClass;

    addItemToCart({
      id: baseProduct.id,
      name: baseProduct.name,
      price: baseProduct.price,
      oldPrice: baseProduct.oldPrice,
      color: state.color,
      size: state.size,
      imageClass: currentImageClass,
      quantity: state.quantity,
      url: 'product.html',
    });

    feedback.textContent = `Добавлено: ${baseProduct.name}, размер ${state.size}, цвет ${state.color}, ${state.quantity} шт.`;
    feedback.classList.remove('is-error');
    feedback.classList.add('is-success');
  });

  openTab(tabButtons.find((button) => button.classList.contains('is-active'))?.dataset.tab || 'description');
  setQuantity(state.quantity);
}

function initCartPage() {
  const cartPage = document.getElementById('cart-page');
  if (!cartPage) {
    return;
  }

  const list = document.getElementById('cart-items-list');
  const emptyState = document.getElementById('cart-empty');
  const summary = document.getElementById('cart-summary');
  const itemsTotalLabel = document.getElementById('cart-items-total');
  const subtotalLabel = document.getElementById('cart-subtotal');
  const deliveryLabel = document.getElementById('cart-delivery');
  const totalLabel = document.getElementById('cart-total');

  if (
    !list ||
    !emptyState ||
    !summary ||
    !itemsTotalLabel ||
    !subtotalLabel ||
    !deliveryLabel ||
    !totalLabel
  ) {
    return;
  }

  function renderCart() {
    const cart = getStoredCart();
    const totals = calculateCartTotals(cart);

    itemsTotalLabel.textContent = String(totals.itemCount);
    subtotalLabel.textContent = formatPrice(totals.subtotal);
    deliveryLabel.textContent = formatPrice(totals.delivery);
    totalLabel.textContent = formatPrice(totals.total);

    summary.classList.toggle('is-empty', cart.length === 0);

    if (cart.length === 0) {
      list.innerHTML = '';
      emptyState.hidden = false;
      return;
    }

    emptyState.hidden = true;

    list.innerHTML = cart
      .map((item, index) => {
        const lineTotal = item.price * item.quantity;

        return `
          <article class="cart-item" data-index="${index}">
            <div class="cart-thumb product-image ${item.imageClass}" aria-hidden="true"></div>
            <div class="cart-meta">
              <h2>${escapeHtml(item.name)}</h2>
              <p>Размер: ${escapeHtml(item.size)} | Цвет: ${escapeHtml(item.color)}</p>
              <button class="cart-remove" type="button" data-action="remove-item" data-index="${index}">Удалить</button>
            </div>
            <div class="cart-line-controls">
              <div class="quantity-control cart-qty-control">
                <button class="qty-button" type="button" data-action="decrease-item" data-index="${index}" aria-label="Уменьшить количество">-</button>
                <input class="qty-input" type="number" min="1" max="99" value="${item.quantity}" data-action="input-item-qty" data-index="${index}" aria-label="Количество товара ${escapeHtml(item.name)}">
                <button class="qty-button" type="button" data-action="increase-item" data-index="${index}" aria-label="Увеличить количество">+</button>
              </div>
            </div>
            <div class="cart-price">${formatPrice(lineTotal)}</div>
          </article>
        `;
      })
      .join('');
  }

  list.addEventListener('click', (event) => {
    const control = event.target.closest('[data-action]');
    if (!control) {
      return;
    }

    const index = Number(control.dataset.index);
    if (!Number.isInteger(index)) {
      return;
    }

    const cart = getStoredCart();
    const line = cart[index];
    if (!line) {
      return;
    }

    if (control.dataset.action === 'remove-item') {
      removeItemFromCartByIndex(index);
      renderCart();
      return;
    }

    if (control.dataset.action === 'decrease-item') {
      const nextQuantity = line.quantity - 1;
      if (nextQuantity <= 0) {
        removeItemFromCartByIndex(index);
      } else {
        setCartItemQuantityByIndex(index, nextQuantity);
      }
      renderCart();
      return;
    }

    if (control.dataset.action === 'increase-item') {
      setCartItemQuantityByIndex(index, line.quantity + 1);
      renderCart();
    }
  });

  list.addEventListener('change', (event) => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) {
      return;
    }

    if (input.dataset.action !== 'input-item-qty') {
      return;
    }

    const index = Number(input.dataset.index);
    if (!Number.isInteger(index)) {
      return;
    }

    setCartItemQuantityByIndex(index, input.value);
    renderCart();
  });

  renderCart();
}

updateHeaderCartCount();
initShopCatalog();
initProductPage();
initCartPage();
