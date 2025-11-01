const appData = {
  products: [
    {
      id: 1,
      name: "Fresh Bananas (4 pieces)",
      category: "fruits",
      price: 40,
      image: "🍌",
      description: "Fresh, ripe bananas perfect for snacking or baking",
      rating: 4.5,
      reviews: 23,
      stock: 15
    },
    {
      id: 2,
      name: "Organic Milk (1/2 litre)",
      category: "dairy",
      price: 60,
      image: "🥛",
      description: "Fresh organic whole milk, 1 gallon",
      rating: 4.7,
      reviews: 45,
      stock: 8
    },
    {
      id: 3,
      name: "Chicken Breast (1 kg)",
      category: "meat",
      price: 320,
      image: "🍗",
      description: "Fresh boneless, skinless chicken breast, 2 lbs",
      rating: 4.3,
      reviews: 18,
      stock: 12
    },
    {
      id: 4,
      name: "Whole Wheat Bread (1 packet)",
      category: "pantry",
      price: 45,
      image: "🍞",
      description: "Freshly baked whole wheat bread loaf",
      rating: 4.4,
      reviews: 31,
      stock: 22
    },
    {
      id: 5,
      name: "Fresh Apples (1 kg)",
      category: "fruits",
      price: 120,
      image: "🍎",
      description: "Crisp Honeycrisp apples, 3 lb bag",
      rating: 4.6,
      reviews: 67,
      stock: 18
    },
    {
      id: 6,
      name: "Greek Yogurt (1 litre)",
      category: "dairy",
      price: 180,
      image: "🥛",
      description: "Plain Greek yogurt, 32 oz container",
      rating: 4.5,
      reviews: 29,
      stock: 25
    },
    {
      id: 7,
      name: "Fresh Spinach (1 bunch)",
      category: "fruits",
      price: 25,
      image: "🥬",
      description: "Fresh baby spinach leaves, 5 oz bag",
      rating: 4.2,
      reviews: 34,
      stock: 20
    },
    {
      id: 8,
      name: "Salmon Fillet (300 g)",
      category: "meat",
      price: 450,
      image: "🐟",
      description: "Fresh Atlantic salmon fillet, 1 lb",
      rating: 4.8,
      reviews: 52,
      stock: 6
    }
  ],
  categories: [
    {"name": "Fruits & Vegetables", "id": "fruits"},
    {"name": "Dairy", "id": "dairy"},
    {"name": "Meat & Seafood", "id": "meat"},
    {"name": "Pantry", "id": "pantry"}
  ],
  cartItems: [
    {id: 2, name: "Organic Milk", price: 60, quantity: 1, image: "🥛"},
    {id: 1, name: "Fresh Bananas", price: 40, quantity: 2, image: "🍌"},
    {id: 4, name: "Whole Wheat Bread", price: 45, quantity: 1, image: "🍞"}
  ]
};

let filteredProducts = [...appData.products];

// Initialize the application based on current page
document.addEventListener('DOMContentLoaded', function() {
  updateCartCount();
  
  // Initialize based on current page
  const currentPage = getCurrentPage();
  
  switch(currentPage) {
    case 'home':
      initializeHomePage();
      break;
    case 'products':
      initializeProductsPage();
      break;
    case 'cart':
      initializeCartPage();
      break;
    case 'checkout':
      initializeCheckoutPage();
      break;
    case 'login':
      initializeLoginPage();
      break;
    case 'register':
      initializeRegisterPage();
      break;
    case 'account':
      initializeAccountPage();
      break;
    case 'product-detail':
      initializeProductDetailPage();
      break;
    case 'admin-dashboard':
      initializeAdminDashboard();
      break;
  }
  
  // Add global event listeners
  addGlobalEventListeners();
});

function getCurrentPage() {
  const path = window.location.pathname;
  const filename = path.split('/').pop().replace('.html', '');
  return filename === '' || filename === 'index' ? 'home' : filename;
}

function initializeHomePage() {
  loadFeaturedProducts();
  checkUserAuthentication();
}

function initializeRegisterPage() {
  // Registration page specific initialization if needed
}

function initializeAdminDashboard() {
  // Admin dashboard specific initialization if needed
}

// Authentication functions
function checkUserAuthentication() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const adminLink = document.getElementById('adminLink');
  
  if (currentUser.userType === 'admin' && adminLink) {
    adminLink.style.display = 'block';
  }
}

function initializeProductsPage() {
  loadAllProducts();
  
  // Handle category filtering from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get('category');
  if (category) {
    filterProducts('', category);
    // Update active filter button
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
      btn.classList.remove('active');
      if (btn.getAttribute('data-filter') === category) {
        btn.classList.add('active');
      }
    });
  }
  
  // Add search functionality
  const searchInput = document.getElementById('product-search');
  if (searchInput) {
    searchInput.addEventListener('input', function(e) {
      const searchTerm = e.target.value;
      const activeFilter = document.querySelector('.filter-btn.active');
      const category = activeFilter ? activeFilter.getAttribute('data-filter') : 'all';
      filterProducts(searchTerm, category);
    });
  }
  
  // Add filter button functionality
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const searchTerm = document.getElementById('product-search')?.value || '';
      const category = btn.getAttribute('data-filter');
      filterProducts(searchTerm, category);
    });
  });
}

function initializeCartPage() {
  loadCartItems();
}

function initializeCheckoutPage() {
  loadCheckoutItems();
  updateCheckoutTotals();
  
  // Add checkout form handler
  const checkoutForm = document.getElementById('checkout-form');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', function(e) {
      e.preventDefault();
      showNotification('Order placed successfully! Thank you for your purchase.');
      
      // Clear cart
      appData.cartItems = [];
      updateCartCount();
      
      // Navigate to account page
      setTimeout(() => {
        window.location.href = 'account.html';
      }, 2000);
    });
  }
}

function initializeLoginPage() {
  // Add login form handler
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      showNotification('Login successful! Welcome back, John!');
      setTimeout(() => {
        window.location.href = 'account.html';
      }, 1500);
    });
  }
}

function initializeAccountPage() {
  // Account page specific initialization if needed
}

function initializeProductDetailPage() {
  // Get product ID from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get('id'));
  
  if (productId) {
    loadProductDetail(productId);
  } else {
    // If no product ID, redirect to products page
    window.location.href = 'products.html';
  }
}

function addGlobalEventListeners() {
  // Mobile menu toggle
  const mobileToggle = document.querySelector('.nav__mobile-toggle');
  if (mobileToggle) {
    mobileToggle.addEventListener('click', toggleMobileMenu);
  }
  
  // Global event delegation for dynamic elements
  document.addEventListener('click', function(e) {
    // Add to cart buttons
    if (e.target.classList.contains('add-to-cart')) {
      const productId = parseInt(e.target.getAttribute('data-product-id'));
      addToCart(productId);
    }
    
    // Cart quantity buttons
    if (e.target.classList.contains('quantity-btn')) {
      const productId = parseInt(e.target.getAttribute('data-product-id'));
      const action = e.target.getAttribute('data-action');
      updateCartQuantity(productId, action);
    }
    
    // Remove from cart buttons
    if (e.target.classList.contains('cart-item__remove')) {
      const productId = parseInt(e.target.getAttribute('data-product-id'));
      removeFromCart(productId);
    }
    
    // View details buttons
    if (e.target.classList.contains('btn--secondary') && e.target.textContent.trim() === 'View Details') {
      const productId = parseInt(e.target.getAttribute('data-product-id'));
      navigateToProductDetail(productId);
    }
    
    // Clickable product card elements (image and title)
    if (e.target.classList.contains('product-card__clickable')) {
      const productId = parseInt(e.target.getAttribute('data-product-id'));
      navigateToProductDetail(productId);
    }
  });
}

// Cart functions
function addToCart(productId) {
  const product = appData.products.find(p => p.id === productId);
  if (!product) return;
  
  const existingItem = appData.cartItems.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    appData.cartItems.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image
    });
  }
  
  updateCartCount();
  showNotification(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
  const index = appData.cartItems.findIndex(item => item.id === productId);
  if (index > -1) {
    const item = appData.cartItems[index];
    appData.cartItems.splice(index, 1);
    updateCartCount();
    loadCartItems();
    showNotification(`${item.name} removed from cart`);
  }
}

function updateCartQuantity(productId, action) {
  const item = appData.cartItems.find(item => item.id === productId);
  if (!item) return;
  
  if (action === 'increase') {
    item.quantity += 1;
  } else if (action === 'decrease' && item.quantity > 1) {
    item.quantity -= 1;
  }
  
  updateCartCount();
  loadCartItems();
}

function updateCartCount() {
  const totalItems = appData.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountElements = document.querySelectorAll('.cart-count');
  cartCountElements.forEach(el => el.textContent = totalItems);
}

function loadCartItems() {
  const container = document.getElementById('cart-items');
  if (!container) return;
  
  if (appData.cartItems.length === 0) {
    container.innerHTML = `
      <div class="empty-cart">
        <h3>Your cart is empty</h3>
        <p>Add some products to get started!</p>
        <button class="btn btn--primary" onclick="window.location.href='products.html'">Continue Shopping</button>
      </div>
    `;
    updateCartTotals();
    return;
  }
  
  container.innerHTML = appData.cartItems.map(item => `
    <div class="cart-item">
      <div class="cart-item__image">${item.image}</div>
      <div class="cart-item__info">
        <div class="cart-item__name">${item.name}</div>
        <div class="cart-item__price">₹${item.price.toFixed(2)} each</div>
      </div>
      <div class="cart-item__quantity">
        <button class="quantity-btn" data-product-id="${item.id}" data-action="decrease">−</button>
        <span>${item.quantity}</span>
        <button class="quantity-btn" data-product-id="${item.id}" data-action="increase">+</button>
      </div>
      <div class="cart-item__total">₹${(item.price * item.quantity).toFixed(2)}</div>
      <button class="cart-item__remove" data-product-id="${item.id}">🗑️</button>
    </div>
  `).join('');
  
  updateCartTotals();
}

function updateCartTotals() {
  const subtotal = appData.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.0975; // 9.75% tax
  const deliveryFee = subtotal > 0 ? 331 : 0;
  const total = subtotal + tax + deliveryFee;
  
  const subtotalEl = document.getElementById('cart-subtotal');
  const taxEl = document.getElementById('cart-tax');
  const totalEl = document.getElementById('cart-total');
  
  if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toFixed(2)}`;
  if (taxEl) taxEl.textContent = `₹${tax.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `₹${total.toFixed(2)}`;
}

function loadCheckoutItems() {
  const container = document.getElementById('checkout-items');
  if (!container) return;
  
  container.innerHTML = appData.cartItems.map(item => `
    <div class="checkout-item">
      <div class="checkout-item__image">${item.image}</div>
      <div class="checkout-item__info">
        <div class="checkout-item__name">${item.name}</div>
        <div class="checkout-item__quantity">Qty: ${item.quantity}</div>
      </div>
      <div class="checkout-item__price">₹${(item.price * item.quantity).toFixed(2)}</div>
    </div>
  `).join('');
}

function updateCheckoutTotals() {
  const subtotal = appData.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.0975; // 9.75% tax
  const deliveryFee = subtotal > 0 ? 331 : 0;
  const total = subtotal + tax + deliveryFee;
  
  // Update checkout summary
  const subtotalEl = document.getElementById('checkout-subtotal');
  const taxEl = document.getElementById('checkout-tax');
  const deliveryEl = document.getElementById('checkout-delivery');
  const totalEl = document.getElementById('checkout-total');
  const orderButton = document.querySelector('.btn--primary');
  
  if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toFixed(2)}`;
  if (taxEl) taxEl.textContent = `₹${tax.toFixed(2)}`;
  if (deliveryEl) deliveryEl.textContent = `₹${deliveryFee.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `₹${total.toFixed(2)}`;
  if (orderButton) orderButton.textContent = `Place Order - ₹${total.toFixed(2)}`;
}

// Product display functions
function loadFeaturedProducts() {
  const container = document.getElementById('featured-products');
  if (!container) return;
  
  const featuredProducts = appData.products.slice(0, 4);
  container.innerHTML = featuredProducts.map(product => createProductCard(product)).join('');
}

function loadAllProducts() {
  const container = document.getElementById('all-products');
  if (!container) return;
  
  container.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');
}

function createProductCard(product) {
  const stars = generateStars(product.rating);
  
  return `
    <div class="product-card" data-product-id="${product.id}">
      <div class="product-card__image product-card__clickable" data-product-id="${product.id}">${product.image}</div>
      <div class="product-card__content">
        <h3 class="product-card__title product-card__clickable" data-product-id="${product.id}">${product.name}</h3>
        <div class="product-card__price">₹${product.price.toFixed(2)}</div>
        <div class="product-card__rating">
          <span class="stars">${stars}</span>
          <span>(${product.reviews})</span>
        </div>
        <div class="product-card__actions">
          <button class="btn btn--primary add-to-cart" data-product-id="${product.id}">
            Add to Cart
          </button>
          <button class="btn btn--secondary" data-product-id="${product.id}">
            View Details
          </button>
        </div>
      </div>
    </div>
  `;
}

function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return '⭐'.repeat(fullStars) + (hasHalfStar ? '⭐' : '') + '☆'.repeat(emptyStars);
}

function filterProducts(searchTerm, category) {
  filteredProducts = appData.products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'all' || product.category === category;
    return matchesSearch && matchesCategory;
  });
  
  loadAllProducts();
}

// Mobile menu functionality
function toggleMobileMenu() {
  const navLinks = document.querySelector('.nav__links');
  if (navLinks.style.display === 'flex') {
    navLinks.style.display = 'none';
  } else {
    navLinks.style.display = 'flex';
    navLinks.style.flexDirection = 'column';
    navLinks.style.position = 'absolute';
    navLinks.style.top = '100%';
    navLinks.style.left = '0';
    navLinks.style.right = '0';
    navLinks.style.backgroundColor = 'var(--color-surface)';
    navLinks.style.padding = 'var(--space-16)';
    navLinks.style.borderTop = '1px solid var(--color-border)';
    navLinks.style.zIndex = '1000';
  }
}

// Utility functions
function showNotification(message) {
  // Remove existing notification
  const existing = document.querySelector('.notification');
  if (existing) {
    existing.remove();
  }
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--color-success);
    color: var(--color-btn-primary-text);
    padding: var(--space-16);
    border-radius: var(--radius-base);
    box-shadow: var(--shadow-lg);
    z-index: 1000;
    animation: slideIn 0.3s ease;
    max-width: 300px;
  `;
  notification.textContent = message;
  
  // Add animation keyframes if not exists
  if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
  
  document.body.appendChild(notification);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Product detail functions
function navigateToProductDetail(productId) {
  window.location.href = `product-detail.html?id=${productId}`;
}

function loadProductDetail(productId) {
  const product = appData.products.find(p => p.id === productId);
  if (!product) {
    // Product not found, redirect to products page
    window.location.href = 'products.html';
    return;
  }
  
  // Update breadcrumb
  const breadcrumb = document.getElementById('product-breadcrumb');
  if (breadcrumb) {
    breadcrumb.textContent = product.name;
  }
  
  // Load product detail content
  const container = document.getElementById('product-detail-content');
  if (container) {
    container.innerHTML = createProductDetailHTML(product);
  }
}

function createProductDetailHTML(product) {
  const stars = generateStars(product.rating);
  
  return `
    <div class="product-detail-container">
      <div class="product-detail__image">
        <div class="product-image-large">${product.image}</div>
      </div>
      <div class="product-detail__info">
        <h1 class="product-detail__title">${product.name}</h1>
        <div class="product-detail__price">₹${product.price.toFixed(2)}</div>
        <div class="product-detail__rating">
          <span class="stars">${stars}</span>
          <span class="rating-text">${product.rating} (${product.reviews} reviews)</span>
        </div>
        <div class="product-detail__description">
          <h3>Description</h3>
          <p>${product.description}</p>
        </div>
        <div class="product-detail__stock">
          <span class="stock-label">Stock:</span>
          <span class="stock-value ${product.stock > 10 ? 'in-stock' : product.stock > 0 ? 'low-stock' : 'out-of-stock'}">
            ${product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
          </span>
        </div>
        <div class="product-detail__actions">
          <button class="btn btn--primary btn--lg add-to-cart" data-product-id="${product.id}" ${product.stock === 0 ? 'disabled' : ''}>
            ${product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
          <button class="btn btn--secondary btn--lg" onclick="window.location.href='products.html'">
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  `;
}

// Initialize sample data if not exists
function initializeSampleData() {
  // Initialize sample inventory data for admin dashboard
  if (!localStorage.getItem('inventory')) {
    const sampleInventory = [
      {
        id: 1,
        name: "Fresh Bananas (4 pieces)",
        category: "fruits",
        price: 40,
        stock: 15,
        minStock: 10,
        description: "Fresh, ripe bananas perfect for snacking or baking"
      },
      {
        id: 2,
        name: "Organic Milk (1/2 litre)",
        category: "dairy",
        price: 60,
        stock: 8,
        minStock: 15,
        description: "Fresh organic whole milk"
      },
      {
        id: 3,
        name: "Chicken Breast (1 kg)",
        category: "meat",
        price: 320,
        stock: 12,
        minStock: 8,
        description: "Fresh boneless, skinless chicken breast"
      },
      {
        id: 4,
        name: "Whole Wheat Bread (1 packet)",
        category: "pantry",
        price: 45,
        stock: 22,
        minStock: 5,
        description: "Freshly baked whole wheat bread loaf"
      },
      {
        id: 5,
        name: "Fresh Apples (1 kg)",
        category: "fruits",
        price: 120,
        stock: 18,
        minStock: 10,
        description: "Crisp Honeycrisp apples"
      },
      {
        id: 6,
        name: "Greek Yogurt (1 litre)",
        category: "dairy",
        price: 180,
        stock: 25,
        minStock: 8,
        description: "Plain Greek yogurt"
      },
      {
        id: 7,
        name: "Fresh Spinach (1 bunch)",
        category: "fruits",
        price: 25,
        stock: 20,
        minStock: 12,
        description: "Fresh baby spinach leaves"
      },
      {
        id: 8,
        name: "Salmon Fillet (300 g)",
        category: "meat",
        price: 450,
        stock: 6,
        minStock: 10,
        description: "Fresh Atlantic salmon fillet"
      }
    ];
    localStorage.setItem('inventory', JSON.stringify(sampleInventory));
  }
}

// Initialize sample data when the app loads
initializeSampleData();