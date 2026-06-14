document.addEventListener('DOMContentLoaded', () => {
    initMenu();
    initCartCounter();
    initRandomNumbers();
    initCollectionFilters();
    initProductDetail();
});

function initMenu() {
    const toggle = document.querySelector('[data-menu-toggle]');
    const menu = document.querySelector('[data-side-menu]');
    const overlay = document.querySelector('[data-menu-overlay]');

    if (!toggle || !menu || !overlay) return;

    const openMenu = () => {
        document.body.classList.add('menu-open');
        menu.classList.add('is-active');
        overlay.classList.add('is-active');
        toggle.setAttribute('aria-expanded', 'true');
    };

    const closeMenu = () => {
        document.body.classList.remove('menu-open');
        menu.classList.remove('is-active');
        overlay.classList.remove('is-active');
        toggle.setAttribute('aria-expanded', 'false');
    };

    const toggleMenu = () => {
        if (menu.classList.contains('is-active')) {
            closeMenu();
        } else {
            openMenu();
        }
    };

    toggle.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', closeMenu);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeMenu();
        }
    });
}

function initCartCounter() {
    const cartCount = document.querySelector('[data-cart-count]');

    if (!cartCount) return;

    const savedCount = Number(localStorage.getItem('niveolCartCount') || 0);
    cartCount.textContent = savedCount;
}

function initRandomNumbers() {
    const numbers = document.querySelectorAll('[data-random-number]');

    if (!numbers.length) return;

    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;

    if (!hasFinePointer) return;

    let lastUpdate = 0;

    document.addEventListener('mousemove', () => {
        const now = Date.now();

        if (now - lastUpdate < 90) return;

        lastUpdate = now;

        numbers.forEach((item) => {
            const format = item.dataset.randomFormat;
            item.textContent = getRandomValue(format);
        });
    });
}

function getRandomValue(format) {
    if (format === 'two') {
        return String(Math.floor(Math.random() * 100)).padStart(2, '0');
    }

    if (format === 'decimal2') {
        return `0.${String(Math.floor(Math.random() * 99) + 1).padStart(2, '0')}`;
    }

    if (format === 'decimal1') {
        return `${Math.floor(Math.random() * 10) + 1}.${Math.floor(Math.random() * 10)}`;
    }

    return String(Math.floor(Math.random() * 100));
}

function initCollectionFilters() {
    const filterWrappers = document.querySelectorAll('[data-filter]');
    const filterButtons = document.querySelectorAll('[data-filter-button]');
    const optionButtons = document.querySelectorAll('[data-filter-type]');
    const productCards = document.querySelectorAll('[data-product-card]');

    if (!filterWrappers.length || !productCards.length) return;

    const activeFilters = {
        product: 'all',
        color: 'all',
        collection: 'all',
    };

    filterButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            event.stopPropagation();

            const currentFilter = button.closest('[data-filter]');
            const isActive = currentFilter.classList.contains('is-active');

            filterWrappers.forEach((filter) => {
                filter.classList.remove('is-active');
            });

            if (!isActive) {
                currentFilter.classList.add('is-active');
            }
        });
    });

    optionButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            event.stopPropagation();

            const type = button.dataset.filterType;
            const value = button.dataset.filterValue;

            activeFilters[type] = value;

            const currentFilter = button.closest('[data-filter]');
            const filterMainButton = currentFilter.querySelector('[data-filter-button]');

            if (value === 'all') {
                filterMainButton.innerHTML = getDefaultFilterLabel(type);
            } else {
                filterMainButton.innerHTML = `${button.textContent} <span>▼</span>`;
            }

            currentFilter.classList.remove('is-active');

            applyCollectionFilters(productCards, activeFilters);
        });
    });

    document.addEventListener('click', () => {
        filterWrappers.forEach((filter) => {
            filter.classList.remove('is-active');
        });
    });
}

function applyCollectionFilters(productCards, activeFilters) {
    productCards.forEach((card) => {
        const productMatch =
            activeFilters.product === 'all' || card.dataset.product === activeFilters.product;

        const colorMatch =
            activeFilters.color === 'all' || card.dataset.color === activeFilters.color;

        const collectionMatch =
            activeFilters.collection === 'all' || card.dataset.collection === activeFilters.collection;

        const shouldShow = productMatch && colorMatch && collectionMatch;

        card.classList.toggle('is-hidden', !shouldShow);
    });
}

function getDefaultFilterLabel(type) {
    const labels = {
        product: 'ПРОДУКТ <span>▼</span>',
        color: 'ЦВЕТ <span>▼</span>',
        collection: 'КОЛЛЕКЦИЯ <span>▼</span>',
    };

    return labels[type] || '';
}

function initProductDetail() {
    initProductSizes();
    initProductAccordions();
    initAddToCartButtons();
}

function initProductSizes() {
    const productDetail = document.querySelector('[data-product-detail]');

    if (!productDetail) return;

    const basePrice = Number(productDetail.dataset.basePrice || 0);
    const priceElement = productDetail.querySelector('[data-product-price]');
    const sizeButtons = productDetail.querySelectorAll('[data-price-offset]');

    if (!priceElement || !sizeButtons.length) return;

    sizeButtons.forEach((button) => {
        button.addEventListener('click', () => {
            sizeButtons.forEach((item) => {
                item.classList.remove('is-active');
            });

            button.classList.add('is-active');

            const offset = Number(button.dataset.priceOffset || 0);
            const newPrice = basePrice + offset;

            priceElement.textContent = formatRub(newPrice);
        });
    });
}

function initProductAccordions() {
    const accordionButtons = document.querySelectorAll('[data-accordion-button]');

    if (!accordionButtons.length) return;

    accordionButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const item = button.closest('[data-accordion-item]');

            if (!item) return;

            item.classList.toggle('is-open');
        });
    });
}

function initAddToCartButtons() {
    const buttons = document.querySelectorAll('[data-add-to-cart]');
    const cartCounters = document.querySelectorAll('[data-cart-count]');

    if (!buttons.length) return;

    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            const currentCount = Number(localStorage.getItem('niveolCartCount') || 0);
            const nextCount = currentCount + 1;

            localStorage.setItem('niveolCartCount', String(nextCount));

            cartCounters.forEach((counter) => {
                counter.textContent = nextCount;
            });

            button.classList.add('is-added');
            button.textContent = 'ДОБАВЛЕНО';

            setTimeout(() => {
                button.classList.remove('is-added');
                button.textContent = 'ДОБАВИТЬ В КОРЗИНУ';
            }, 1200);
        });
    });
}

function formatRub(value) {
    return `${new Intl.NumberFormat('ru-RU').format(value)} ₽`;
}