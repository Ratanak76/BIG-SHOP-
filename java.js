/* ===============================
   GLOBAL STATE
================================ */
let products = [];
let cart = [];

/* ===============================
   DOM ELEMENTS
================================ */
const productGrid = document.getElementById('productGrid');
const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartClose = document.getElementById('cartClose');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const filterBtns = document.querySelectorAll('.filter-btn');
const newsletterForm = document.getElementById('newsletterForm');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');
const searchInput = document.getElementById('searchInput');

/* ===============================
   INIT
================================ */
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    setupEventListeners();
    loadCart();
    setupScrollAnimations();
});

/* ===============================
   FETCH PRODUCTS FROM API
================================ */
async function fetchProducts() {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        const data = await response.json();

        products = data.map(item => ({
            id: item.id,
            name: item.title,
            category: mapCategory(item.category),
            price: item.price,
            image: item.image,
            badge: item.rating.rate > 4.5 ? 'Bestseller' : null
        }));

        renderProducts();
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

/* ===============================
   CATEGORY MAPPING
================================ */
function mapCategory(category) {
    if (category.includes('women')) return 'women';
    if (category.includes('men')) return 'men';
    return 'accessories';
}

/* ===============================
   RENDER PRODUCTS (FILTER + SEARCH)
================================ */
function renderProducts(filter = 'all', search = '') {
    productGrid.innerHTML = '';

    let filtered =
        filter === 'all'
            ? products
            : products.filter(p => p.category === filter);

    if (search) {
        filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(search.toLowerCase())
        );
    }

    if (!filtered.length) {
        productGrid.innerHTML =
            `<p style="grid-column:1/-1;text-align:center;">No products found</p>`;
        return;
    }

    filtered.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';

        card.innerHTML = `
            <div class="product-image-wrapper">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
                <div class="product-actions">
                    <button class="add-to-cart" onclick="addToCart(${product.id})">
                        Add to Cart
                    </button>
                </div>
            </div>

            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">$${product.price}</div>
            </div>
        `;

        productGrid.appendChild(card);
    });
}

/* ===============================
   EVENT LISTENERS
================================ */
function setupEventListeners() {
    cartBtn.addEventListener('click', openCart);
    cartClose.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderProducts(btn.dataset.filter, searchInput.value);
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const activeFilter =
                document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
            renderProducts(activeFilter, searchInput.value);
        });
    }

    newsletterForm.addEventListener('submit', e => {
        e.preventDefault();
        alert('Thanks for subscribing!');
        newsletterForm.reset();
    });

    mobileMenuToggle.addEventListener('click', () => {
        navMenu.style.display =
            navMenu.style.display === 'flex' ? 'none' : 'flex';
    });

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            document
                .querySelector(link.getAttribute('href'))
                ?.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

/* ===============================
   CART FUNCTIONS
================================ */
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const item = cart.find(i => i.id === productId);
    item ? item.quantity++ : cart.push({ ...product, quantity: 1 });

    updateCart();
    saveCart();
    openCart();
    showNotification('Added to cart');
}

function updateCart() {
    cartCount.textContent = cart.reduce((s, i) => s + i.quantity, 0);
    cartCount.style.display = cart.length ? 'flex' : 'none';

    const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;

    cartItems.innerHTML = cart.length
        ? cart.map(item => `
            <div class="cart-item">
                <img class="cart-item-image" src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price}</div>
                    <div class="cart-item-quantity">
                        <button onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                    <button onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            </div>
        `).join('')
        : '<p class="cart-empty">Your cart is empty</p>';
}

function updateQuantity(id, change) {
    const item = cart.find(i => i.id === id);
    if (!item) return;

    item.quantity += change;
    item.quantity <= 0 ? removeFromCart(id) : updateCart();
    saveCart();
}

function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    updateCart();
    saveCart();
}

/* ===============================
   CART UI
================================ */
function openCart() {
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

/* ===============================
   STORAGE
================================ */
function saveCart() {
    localStorage.setItem('noir-cart', JSON.stringify(cart));
}

function loadCart() {
    const saved = localStorage.getItem('noir-cart');
    if (saved) {
        cart = JSON.parse(saved);
        updateCart();
    }
}

/* ===============================
   NOTIFICATION
================================ */
function showNotification(message) {
    const n = document.createElement('div');
    n.textContent = message;
    n.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: #1a1a1a;
        color: #fff;
        padding: 1rem 2rem;
        border-radius: 6px;
        z-index: 9999;
    `;
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 2000);
}

/* ===============================
   SCROLL ANIMATIONS
================================ */
function setupScrollAnimations() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.style.opacity = 1;
                e.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document
        .querySelectorAll('.category-card, .about-content, .newsletter-content')
        .forEach(el => {
            el.style.opacity = 0;
            el.style.transform = 'translateY(30px)';
            el.style.transition = '0.6s ease';
            observer.observe(el);
        });
}
