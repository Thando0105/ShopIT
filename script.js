// --- PRODUCT DATABASE (Update Daily Here) ---
const products = [
    {
        id: 1,
        name: "iProduct_Connect",
        category: "E-commerce store for Iphone Resselling",
        basePrice: 200, // in USD
        img: "http://127.0.0.1:5502/images/image.png",
        badge: "Trending",
        demoLink: "iproductconnect.netlify.app"


    },
    {
        id: 2,
        name: "Hair Salon Website",
        category: "Portfolio /Website for a beauty salon",
        basePrice: 250,
        img: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800",
        badge: "New",
        demoLink: "https://glowbeautyhaiir.netlify.app/"
    },
    {
        id: 3,
        name: "Amiradahab Foundation",
        category: "Business, Wealth, Investment, Jewelery",
        basePrice: 600,
        img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500",
        badge: "Best Seller",
        demoLink: "https://amiradahabfoundation.netlify.app/"
    }
];

// --- APP STATE ---
const rates = { USD: 1, ZAR: 19.10, GBP: 0.78, EUR: 0.92 };
let currentCurrency = 'USD';
let cart = JSON.parse(localStorage.getItem('shopit_cart')) || [];

// --- CORE FUNCTIONS ---
function init() {
    renderProducts();
    updateCartUI();
    setupReveal();
}

function renderProducts(filter = 'all') {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = '';

    const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);

    filtered.forEach(p => {
        const localPrice = (p.basePrice * rates[currentCurrency]).toLocaleString(undefined, { minimumFractionDigits: 2 });
        const symbol = getSymbol(currentCurrency);

        grid.innerHTML += `
            <div class="product-card" data-reveal>
                ${p.badge ? `<span class="badge">${p.badge}</span>` : ''}
                <img src="${p.img}" alt="${p.name}" class="product-img">
                <div class="product-info">
                    <h3>${p.name}</h3>
                    <span class="price-tag">${symbol}${localPrice}</span>
                    <div class="p-actions">
                        <button class="btn btn-primary full-width" onclick="addToCart(${p.id})">Add to Cart</button>
                        <a href="${p.demoLink}" target="_blank" class="btn btn-outline" title="Live Demo"><i class="fas fa-external-link"></i></a>
                    </div>
                </div>
            </div>
        `;
    });
    setupReveal(); // Re-trigger reveal for new elements
}
// Add this inside your existing script.js or inside a DOMContentLoaded listener
const cards = document.querySelectorAll('.service-card');

cards.forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--x', `${x}px`);
        card.style.setProperty('--y', `${y}px`);
    });
});

function addToCart(id) {
    const item = products.find(p => p.id === id);
    const existing = cart.find(c => c.id === id);
    
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ ...item, qty: 1 });
    }
    
    saveAndRefresh();
    toggleCart(true);
}

function updateCartUI() {
    const container = document.getElementById('cart-items-container');
    const count = document.getElementById('cart-count');
    const totalDisplay = document.getElementById('cart-total-display');
    
    container.innerHTML = '';
    let total = 0;
    let itemsCount = 0;

    cart.forEach(item => {
        const itemTotal = item.basePrice * item.qty;
        total += itemTotal;
        itemsCount += item.qty;

        container.innerHTML += `
            <div class="cart-item">
                <img src="${item.img}">
                <div style="flex:1">
                    <h4>${item.name}</h4>
                    <p>${item.qty} x ${getSymbol(currentCurrency)}${(item.basePrice * rates[currentCurrency]).toFixed(2)}</p>
                </div>
                <button onclick="removeFromCart(${item.id})" style="background:none; border:none; color:#f87171; cursor:pointer"><i class="fas fa-trash"></i></button>
            </div>
        `;
    });

    count.innerText = itemsCount;
    totalDisplay.innerText = `${getSymbol(currentCurrency)}${(total * rates[currentCurrency]).toLocaleString()}`;
}

function removeFromCart(id) {
    cart = cart.filter(c => c.id !== id);
    saveAndRefresh();
}

function saveAndRefresh() {
    localStorage.setItem('shopit_cart', JSON.stringify(cart));
    updateCartUI();
}

function toggleCart(open = null) {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('overlay');
    const isOpen = open !== null ? !open : sidebar.classList.contains('active');
    
    if (isOpen) {
        sidebar.classList.remove('active');
        overlay.style.display = 'none';
    } else {
        sidebar.classList.add('active');
        overlay.style.display = 'block';
    }
}

function checkoutWhatsApp() {
    if (cart.length === 0) return alert("Cart is empty!");

    let message = "Hi ShopIT Services! I'd like to purchase:\n\n";
    let total = 0;

    cart.forEach(item => {
        message += `- ${item.name} x${item.qty} (${getSymbol(currentCurrency)}${(item.basePrice * rates[currentCurrency]).toFixed(2)})\n`;
        total += (item.basePrice * item.qty);
    });

    message += `\nTotal: ${getSymbol(currentCurrency)}${(total * rates[currentCurrency]).toLocaleString()}\n`;
    message += "Please send payment details.";

    window.open(`https://wa.me/YOURNUMBER?text=${encodeURIComponent(message)}`, '_blank');
}

// --- UTILS ---
function getSymbol(cur) {
    return { USD: '$', ZAR: 'R', GBP: '£', EUR: '€' }[cur];
}

function setupReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
}

// --- EVENT LISTENERS ---
document.getElementById('currency-selector').addEventListener('change', (e) => {
    currentCurrency = e.target.value;
    renderProducts();
    updateCartUI();
});

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.onclick = () => {
        document.querySelector('.filter-btn.active').classList.remove('active');
        btn.classList.add('active');
        renderProducts(btn.dataset.filter);
    };
});

init();