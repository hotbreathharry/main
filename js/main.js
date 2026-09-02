// ============================================================
// DATA: 10 Products (5 free, 5 premium)
// ============================================================
const products = [
    // FREE (5)
    {
        id: 1,
        name: 'Minimalist Landing',
        type: 'free',
        category: 'featured',
        image: 'images/minimalist.gif',
        copyText: 'Design a clean, minimalist landing page with a hero section, features grid, and a call-to-action button. Use a white background with subtle shadows and a sans-serif font.',
        date: '2026-08-15'
    },
    {
        id: 2,
        name: 'E-commerce Product',
        type: 'free',
        category: 'popular',
        image: 'images/ecommerce.gif',
        copyText: 'Create an e-commerce product page with image gallery, price, size selector, add-to-cart button, and related products carousel.',
        date: '2026-08-20'
    },
    {
        id: 3,
        name: 'Portfolio Grid',
        type: 'free',
        category: 'featured',
        image: 'images/portfolio.gif',
        copyText: 'Build a designer portfolio with a grid layout, hover overlay effects, project titles, and a smooth masonry-style arrangement.',
        date: '2026-08-25'
    },
    {
        id: 4,
        name: 'Blog Article',
        type: 'free',
        category: 'recent',
        image: 'images/blog.gif',
        copyText: 'Design a blog article template with a hero image, author bio, share buttons, related posts, and a clean typography hierarchy.',
        date: '2026-08-28'
    },
    {
        id: 5,
        name: 'Dashboard UI',
        type: 'free',
        category: 'popular',
        image: 'images/dashboard.gif',
        copyText: 'Create a modern dashboard with a sidebar navigation, stats cards, a line chart, and a recent activity feed.',
        date: '2026-09-01'
    },
    // PREMIUM (5)
    {
        id: 6,
        name: 'SaaS Landing Pro',
        type: 'premium',
        category: 'featured',
        image: 'images/saas-pro.gif',
        copyText: 'Premium: Full SaaS landing page with animated gradient hero, pricing tables, testimonial slider, and floating elements.',
        date: '2026-09-05'
    },
    {
        id: 7,
        name: 'Mobile App Showcase',
        type: 'premium',
        category: 'popular',
        image: 'images/mobile-app.gif',
        copyText: 'Premium: App showcase with 3D phone mockups, feature accordion, download buttons, and a video background section.',
        date: '2026-09-08'
    },
    {
        id: 8,
        name: 'Agency Website',
        type: 'premium',
        category: 'featured',
        image: 'images/agency.gif',
        copyText: 'Premium: Full agency website with animated counters, case studies grid, team cards, and a contact form with map.',
        date: '2026-09-10'
    },
    {
        id: 9,
        name: 'NFT Marketplace',
        type: 'premium',
        category: 'recent',
        image: 'images/nft.gif',
        copyText: 'Premium: NFT marketplace with wallet connect, trending grid, auction timer, and rarity badges.',
        date: '2026-09-12'
    },
    {
        id: 10,
        name: 'AI Chat Interface',
        type: 'premium',
        category: 'popular',
        image: 'images/ai-chat.gif',
        copyText: 'Premium: AI chat UI with message bubbles, typing indicator, sidebar history, and dark/light mode toggle.',
        date: '2026-09-15'
    }
];

// ============================================================
// ADVERTISEMENT CARD (appears at position 3 of each row)
// ============================================================
const adConfig = {
    image: 'images/ad-banner.gif', // replace with your ad image
    link: 'https://your-affiliate-link.com', // replace with your URL
    alt: 'Sponsor Ad'
};

// ============================================================
// STATE
// ============================================================
let currentPricingFilter = 'all';
let currentSortFilter = 'featured';
let copyCount = 0;
const MAX_FREE_COPIES = 3;

// ============================================================
// DOM REFS
// ============================================================
const grid = document.getElementById('productGrid');
const pricingFilter = document.getElementById('pricingFilter');
const sortFilter = document.getElementById('sortFilter');

// ============================================================
// RENDER FUNCTION
// ============================================================
function renderProducts() {
    let filtered = [...products];

    // Filter by pricing
    if (currentPricingFilter !== 'all') {
        filtered = filtered.filter(p => p.type === currentPricingFilter);
    }

    // Sort
    const sortMap = {
        'featured': (a, b) => (a.category === 'featured' ? -1 : 1),
        'popular': (a, b) => (a.category === 'popular' ? -1 : 1),
        'recent': (a, b) => new Date(b.date) - new Date(a.date)
    };
    if (sortMap[currentSortFilter]) {
        filtered.sort(sortMap[currentSortFilter]);
    }

    // Build HTML with ad cards inserted at every 3rd position (index 2, 5, 8, ...)
    let html = '';
    const adInterval = 3; // every 3rd card

    for (let i = 0; i < filtered.length; i++) {
        // Insert ad before product if (i % adInterval === 2) and not at end
        // We want ad at position 3, 6, 9... (1-indexed)
        if (i % adInterval === 2 && i < filtered.length - 1) {
            html += renderAdCard();
        }
        html += renderProductCard(filtered[i]);
    }

    // If the last row would be incomplete, add an ad at the end if needed
    // But we already insert ads at positions, so just ensure grid is clean
    grid.innerHTML = html;
}

// ============================================================
// RENDER PRODUCT CARD
// ============================================================
function renderProductCard(product) {
    const isPremium = product.type === 'premium';
    const isSignedIn = window.isSignedIn || false;
    const isPremiumMember = window.isPremiumMember || false;

    let buttonHtml;
    if (isPremium) {
        if (isSignedIn && isPremiumMember) {
            // Premium member can copy
            buttonHtml = `<button class="btn-copy" data-id="${product.id}" data-copy="${product.copyText}"><i class="fas fa-copy"></i> Copy</button>`;
        } else {
            // Not premium → show star → go to subscription
            buttonHtml = `<button class="btn-premium" data-id="${product.id}"><i class="fas fa-star"></i> Go Premium</button>`;
        }
    } else {
        buttonHtml = `<button class="btn-copy" data-id="${product.id}" data-copy="${product.copyText}"><i class="fas fa-copy"></i> Copy</button>`;
    }

    const badge = isPremium ? `<span class="premium-badge">⭐ PREMIUM</span>` : '';

    return `
        <div class="product-card" data-type="${product.type}" data-id="${product.id}">
            <img src="${product.image}" alt="${product.name}" loading="lazy" />
            ${badge}
            <div class="product-name">${product.name}</div>
            ${buttonHtml}
        </div>
    `;
}

// ============================================================
// RENDER AD CARD
// ============================================================
function renderAdCard() {
    return `
        <div class="ad-card">
            <a href="${adConfig.link}" target="_blank" rel="noopener noreferrer">
                <img src="${adConfig.image}" alt="${adConfig.alt}" loading="lazy" />
            </a>
        </div>
    `;
}

// ============================================================
// EVENT HANDLING (delegation on grid)
// ============================================================
grid.addEventListener('click', function(e) {
    const btn = e.target.closest('button');
    if (!btn) return;

    // Copy button (free or premium member)
    if (btn.classList.contains('btn-copy')) {
        const copyText = btn.dataset.copy;
        if (copyText) {
            handleCopy(copyText, btn);
        }
        return;
    }

    // Go Premium button (star)
    if (btn.classList.contains('btn-premium')) {
        window.location.href = 'subscription.html';
        return;
    }
});

// ============================================================
// COPY HANDLER with rate limit (3 free copies)
// ============================================================
function handleCopy(text, btn) {
    // Check if user is premium member (global flag)
    if (window.isPremiumMember) {
        // Unlimited for premium
        copyToClipboard(text, btn);
        return;
    }

    // Free user: check copy count
    const used = getCopyCount();
    if (used >= MAX_FREE_COPIES) {
        alert(`You've used all ${MAX_FREE_COPIES} free copies. Please subscribe to continue copying!`);
        window.location.href = 'subscription.html';
        return;
    }

    // Increment and copy
    incrementCopyCount();
    copyToClipboard(text, btn);
}

// ============================================================
// Clipboard + animation feedback
// ============================================================
function copyToClipboard(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
        const original = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        btn.style.background = '#4ecdc4';
        setTimeout(() => {
            btn.innerHTML = original;
            btn.style.background = '';
        }, 1500);
    }).catch(() => {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        const original = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
            btn.innerHTML = original;
        }, 1500);
    });
}

// ============================================================
// Copy count (localStorage)
// ============================================================
function getCopyCount() {
    const count = parseInt(localStorage.getItem('promptCopyCount') || '0');
    // Reset if more than a day has passed? Let's just use session-based for simplicity
    // But we'll store in sessionStorage so it resets per session
    const sessionCount = parseInt(sessionStorage.getItem('promptCopyCount') || '0');
    return sessionCount;
}

function incrementCopyCount() {
    const current = parseInt(sessionStorage.getItem('promptCopyCount') || '0');
    sessionStorage.setItem('promptCopyCount', String(current + 1));
}

// ============================================================
// FILTER CHANGE HANDLERS
// ============================================================
pricingFilter.addEventListener('change', function() {
    currentPricingFilter = this.value;
    renderProducts();
});

sortFilter.addEventListener('change', function() {
    currentSortFilter = this.value;
    renderProducts();
});

// ============================================================
// NAV TOGGLE (mobile)
// ============================================================
document.getElementById('navToggle')?.addEventListener('click', function() {
    document.querySelector('.nav-menu').classList.toggle('active');
});

// ============================================================
// NOTIFY FORM
// ============================================================
document.getElementById('notifyForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('notifyEmail').value;
    if (email) {
        // Store in localStorage or send to a service (we'll store for demo)
        let list = JSON.parse(localStorage.getItem('notifyList') || '[]');
        if (!list.includes(email)) {
            list.push(email);
            localStorage.setItem('notifyList', JSON.stringify(list));
        }
        document.getElementById('notifyMessage').textContent = '✅ You\'re on the list! We\'ll notify you.';
        document.getElementById('notifyEmail').value = '';
    }
});

// ============================================================
// INIT
// ============================================================
renderProducts();

// Check auth state from auth.js
// The auth.js will set window.isSignedIn and window.isPremiumMember
// We'll re-render when auth changes
document.addEventListener('authStateChanged', function() {
    renderProducts();
});
