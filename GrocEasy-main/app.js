const appData = {
  products: [
    {
      id: 1,
      name: "Fresh Bananas (12 pieces)",
      category: "fruits",
      price: 69,
      image: "🍌",
      description: "Fresh, ripe bananas perfect for snacking or baking",
      rating: 4.5,
      reviews: 23,
      stock: 15
    },
    {
      id: 2,
      name: "Amul Toned Milk (1 litre)",
      category: "dairy",
      price: 68,
      image: "🥛",
      description: "Fresh toned milk, 3.5% fat content",
      rating: 4.7,
      reviews: 45,
      stock: 8
    },
    {
      id: 3,
      name: "Chicken Breast (1 kg)",
      category: "meat",
      price: 299,
      image: "🍗",
      description: "Fresh boneless, skinless chicken breast",
      rating: 4.3,
      reviews: 18,
      stock: 12
    },
    {
      id: 4,
      name: "Whole Wheat Bread (400g)",
      category: "pantry",
      price: 40,
      image: "🍞",
      description: "Freshly baked whole wheat bread loaf",
      rating: 4.4,
      reviews: 31,
      stock: 22
    },
    {
      id: 5,
      name: "Kashmiri Apples (1 kg)",
      category: "fruits",
      price: 159,
      image: "🍎",
      description: "Fresh, crisp Kashmiri apples",
      rating: 4.6,
      reviews: 67,
      stock: 18
    },
    {
      id: 6,
      name: "Greek Yogurt (400g)",
      category: "dairy",
      price: 99,
      image: "🥛",
      description: "Creamy Greek yogurt, high in protein",
      rating: 4.5,
      reviews: 29,
      stock: 25
    },
    {
      id: 7,
      name: "Fresh Spinach (250g)",
      category: "fruits",
      price: 45,
      image: "🥬",
      description: "Fresh, clean spinach leaves",
      rating: 4.2,
      reviews: 34,
      stock: 20
    },
    {
      id: 8,
      name: "Salmon Fillet (500g)",
      category: "meat",
      price: 899,
      image: "🐟",
      description: "Premium Atlantic salmon fillet",
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
  cartItems: []  // Initialize empty cart
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
    case 'customer-dashboard':
      initializeCustomerDashboard();
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

function initializeCustomerDashboard() {
  // Customer dashboard specific initialization if needed
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
  document.getElementById('login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: formData.get('email'),
                password: formData.get('password')
            })
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('currentUser', JSON.stringify(data.user));

        // Redirect based on user role
        if (data.user.userType === 'admin') {
            window.location.href = 'admin-dashboard.html';
        } else {
            window.location.href = 'customer-dashboard.html';
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please try again.');
    }
});
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
  document.addEventListener('click', async function(e) {
    // Add to cart buttons
    if (e.target.matches('.add-to-cart')) {
      e.preventDefault();
      const productId = parseInt(e.target.getAttribute('data-product-id'));
      await addToCart(productId);
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
async function addToCart(productId) {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser) {
    window.location.href = 'login.html';
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/api/cart/${currentUser.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ productId, quantity: 1 })
    });

    if (!response.ok) {
      throw new Error('Failed to add item to cart');
    }

    const product = appData.products.find(p => p.id === productId);
    if (product) {
      showNotification(`${product.name} added to cart!`);
    }
    
    const cartItems = await response.json();
    appData.cartItems = cartItems;
    updateCartCount();
    
    if (window.location.pathname.includes('cart.html')) {
      loadCartItems();
    }
  } catch (error) {
    console.error('Add to cart error:', error);
    showNotification('Failed to add item to cart');
  }
}

function removeFromCart(productId) {
  // Use backend to remove the item (set quantity to 0)
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser) {
    window.location.href = 'login.html';
    return;
  }

  (async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/cart/${currentUser.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 0 })
      });

      if (!response.ok) throw new Error('Failed to remove item');

      const cartItems = await response.json();
      appData.cartItems = cartItems;
      updateCartCount();
      loadCartItems();
      showNotification('Item removed from cart');
    } catch (err) {
      console.error('Remove from cart error:', err);
      showNotification('Failed to remove item');
    }
  })();
}

function updateCartQuantity(productId, action) {
  const item = appData.cartItems.find(i => i.productId === productId);
  if (!item) return;

  let newQuantity = item.quantity;
  if (action === 'increase') newQuantity = item.quantity + 1;
  else if (action === 'decrease') newQuantity = Math.max(1, item.quantity - 1);

  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser) {
    window.location.href = 'login.html';
    return;
  }

  (async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/cart/${currentUser.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: newQuantity })
      });

      if (!response.ok) throw new Error('Failed to update quantity');

      const cartItems = await response.json();
      appData.cartItems = cartItems;
      updateCartCount();
      loadCartItems();
    } catch (err) {
      console.error('Update quantity error:', err);
      showNotification('Failed to update quantity');
    }
  })();
}

async function updateCartCount() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const cartCount = appData.cartItems ? appData.cartItems.reduce((sum, item) => sum + item.quantity, 0) : 0;
  
  const cartCountElements = document.querySelectorAll('.cart-count');
  cartCountElements.forEach(el => el.textContent = cartCount || 0);
}

async function loadCartItems() {
  const container = document.getElementById('cart-items');
  if (!container) return;
  
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser) {
    window.location.href = 'login.html';
    return;
  }
  
  try {
    const response = await fetch(`http://localhost:3000/api/cart/${currentUser.id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch cart items');
    }
    
    const cartItems = await response.json();
    appData.cartItems = cartItems;
    
    if (cartItems.length === 0) {
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
    
    container.innerHTML = cartItems.map(item => `
      <div class="cart-item">
        <div class="cart-item__image">${item.image || ''}</div>
        <div class="cart-item__info">
          <div class="cart-item__name">${item.name}</div>
          <div class="cart-item__price">₹${(item.price).toFixed(2)} each</div>
        </div>
        <div class="cart-item__quantity">
          <button class="quantity-btn" data-product-id="${item.productId}" data-action="decrease">−</button>
          <span>${item.quantity}</span>
          <button class="quantity-btn" data-product-id="${item.productId}" data-action="increase">+</button>
        </div>
        <div class="cart-item__total">₹${(item.price * item.quantity).toFixed(2)}</div>
        <button class="cart-item__remove" data-product-id="${item.productId}">🗑️</button>
      </div>
    `).join('');
    
    updateCartTotals();
  } catch (error) {
    console.error('Load cart error:', error);
    container.innerHTML = `
      <div class="error-message">
        <h3>Failed to load cart items</h3>
        <p>Please try again later</p>
      </div>
    `;
  }
  
  // final render already handled above; ensure totals updated
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
    // Mirror current appData.products to keep inventory consistent
    const sampleInventory = appData.products.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      price: p.price,
      stock: p.stock,
      minStock: Math.max(5, Math.floor(p.stock / 2)),
      description: p.description
    }));

    localStorage.setItem('inventory', JSON.stringify(sampleInventory));
  }
}

// Initialize sample data when the app loads
initializeSampleData();