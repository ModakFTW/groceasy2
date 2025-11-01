const API_BASE = '/api';

const appState = {
  products: [],
  categories: [],
  cartItems: [],
  currentUser: null,
  token: null
};

let filteredProducts = [];

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

async function apiCall(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Request failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

async function loadCategories() {
  try {
    const categories = await apiCall('/products/categories');
    appState.categories = categories;
    return categories;
  } catch (error) {
    console.error('Failed to load categories:', error);
    return [];
  }
}

async function loadProducts(params = {}) {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const result = await apiCall(`/products${queryParams ? '?' + queryParams : ''}`);
    appState.products = result.products || result;
    return appState.products;
  } catch (error) {
    console.error('Failed to load products:', error);
    return [];
  }
}

async function loadCart() {
  if (!appState.token) {
    appState.cartItems = [];
    return [];
  }
  
  try {
    const cartData = await apiCall('/cart');
    appState.cartItems = cartData.map(item => ({
      id: item.products.id,
      name: item.products.name,
      price: Number(item.products.price),
      quantity: item.quantity,
      image: item.products.image_url,
      cartItemId: item.id
    }));
    return appState.cartItems;
  } catch (error) {
    console.error('Failed to load cart:', error);
    appState.cartItems = [];
    return [];
  }
}

document.addEventListener('DOMContentLoaded', async function() {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('currentUser');
  
  if (token && userStr) {
    appState.token = token;
    appState.currentUser = JSON.parse(userStr);
    updateAuthUI();
  }
  
  await loadCategories();
  
  const currentPage = getCurrentPage();
  
  switch(currentPage) {
    case 'home':
      await initializeHomePage();
      break;
    case 'products':
      await initializeProductsPage();
      break;
    case 'cart':
      await initializeCartPage();
      break;
    case 'checkout':
      await initializeCheckoutPage();
      break;
    case 'login':
      initializeLoginPage();
      break;
    case 'register':
      initializeRegisterPage();
      break;
    case 'account':
      await initializeAccountPage();
      break;
    case 'product-detail':
      await initializeProductDetailPage();
      break;
    case 'admin-dashboard':
      await initializeAdminDashboard();
      break;
  }
  
  addGlobalEventListeners();
  
  if (appState.token) {
    await loadCart();
    updateCartCount();
  }
});

function getCurrentPage() {
  const path = window.location.pathname;
  const filename = path.split('/').pop().replace('.html', '');
  return filename === '' || filename === 'index' ? 'home' : filename;
}

async function initializeHomePage() {
  await loadFeaturedProducts();
  checkUserAuthentication();
}

function initializeRegisterPage() {
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  
  try {
    const response = await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: formData.get('email'),
        password: formData.get('password'),
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName')
      })
    });
    
    localStorage.setItem('token', response.token);
    localStorage.setItem('currentUser', JSON.stringify(response.user));
    appState.token = response.token;
    appState.currentUser = response.user;
    
    showNotification('Registration successful! Welcome!');
    setTimeout(() => window.location.href = 'index.html', 1500);
  } catch (error) {
    showNotification('Registration failed: ' + error.message, 'error');
  }
}

async function initializeAdminDashboard() {
  if (!appState.currentUser || appState.currentUser.role !== 'admin') {
    showNotification('Admin access required', 'error');
    setTimeout(() => window.location.href = 'index.html', 1500);
    return;
  }
  
  try {
    const dashboardData = await apiCall('/admin/dashboard');
    const inventoryData = await apiCall('/admin/inventory');
    
    document.getElementById('total-orders').textContent = dashboardData.totalOrders || 0;
    document.getElementById('total-revenue').textContent = `₹${(dashboardData.totalRevenue || 0).toFixed(2)}`;
    document.getElementById('low-stock-count').textContent = dashboardData.lowStockItems?.length || 0;
    
    const inventoryContainer = document.getElementById('inventory-table-body');
    if (inventoryContainer && inventoryData) {
      inventoryContainer.innerHTML = inventoryData.map(product => `
        <tr>
          <td>${product.name}</td>
          <td>${product.categories?.name || 'N/A'}</td>
          <td>₹${Number(product.price).toFixed(2)}</td>
          <td>${product.stock}</td>
          <td class="${product.stock < product.min_stock ? 'low-stock' : ''}">${product.min_stock}</td>
        </tr>
      `).join('');
    }
  } catch (error) {
    console.error('Failed to load admin dashboard:', error);
    showNotification('Failed to load dashboard data', 'error');
  }
}

function checkUserAuthentication() {
  const adminLink = document.getElementById('adminLink');
  const accountLink = document.querySelector('.nav__account');
  
  if (appState.currentUser) {
    if (accountLink) {
      accountLink.textContent = appState.currentUser.firstName || 'Account';
      accountLink.href = 'account.html';
    }
    
    if (appState.currentUser.role === 'admin' && adminLink) {
      adminLink.style.display = 'block';
    }
  } else {
    if (accountLink) {
      accountLink.textContent = 'Login';
      accountLink.href = 'login.html';
    }
  }
}

function updateAuthUI() {
  const accountLink = document.querySelector('.nav__account');
  if (accountLink && appState.currentUser) {
    accountLink.textContent = appState.currentUser.firstName || 'Account';
    accountLink.href = 'account.html';
  }
}

async function initializeProductsPage() {
  const products = await loadProducts({ limit: 100 });
  filteredProducts = products;
  loadAllProducts();
  
  const urlParams = new URLSearchParams(window.location.search);
  const categorySlug = urlParams.get('category');
  if (categorySlug) {
    const category = appState.categories.find(c => c.slug === categorySlug);
    if (category) {
      filterProducts('', category.id);
      const filterButtons = document.querySelectorAll('.filter-btn');
      filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-filter') === categorySlug) {
          btn.classList.add('active');
        }
      });
    }
  }
  
  const searchInput = document.getElementById('product-search');
  if (searchInput) {
    searchInput.addEventListener('input', function(e) {
      const searchTerm = e.target.value;
      const activeFilter = document.querySelector('.filter-btn.active');
      const categorySlug = activeFilter ? activeFilter.getAttribute('data-filter') : 'all';
      const category = appState.categories.find(c => c.slug === categorySlug);
      filterProducts(searchTerm, category?.id);
    });
  }
  
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const searchTerm = document.getElementById('product-search')?.value || '';
      const categorySlug = btn.getAttribute('data-filter');
      const category = appState.categories.find(c => c.slug === categorySlug);
      filterProducts(searchTerm, category?.id);
    });
  });
}

async function initializeCartPage() {
  await loadCart();
  loadCartItems();
}

async function initializeCheckoutPage() {
  await loadCart();
  loadCheckoutItems();
  updateCheckoutTotals();
  
  const checkoutForm = document.getElementById('checkout-form');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', handleCheckout);
  }
}

async function handleCheckout(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  
  try {
    const shippingAddress = `${formData.get('address')}, ${formData.get('city')}, ${formData.get('postal')}`;
    
    await apiCall('/orders/create', {
      method: 'POST',
      body: JSON.stringify({
        shippingAddress,
        paymentMethod: formData.get('payment')
      })
    });
    
    showNotification('Order placed successfully! Thank you for your purchase.');
    appState.cartItems = [];
    updateCartCount();
    
    setTimeout(() => {
      window.location.href = 'account.html';
    }, 2000);
  } catch (error) {
    showNotification('Order failed: ' + error.message, 'error');
  }
}

function initializeLoginPage() {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  
  try {
    const response = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: formData.get('email'),
        password: formData.get('password')
      })
    });
    
    localStorage.setItem('token', response.token);
    localStorage.setItem('currentUser', JSON.stringify(response.user));
    appState.token = response.token;
    appState.currentUser = response.user;
    
    showNotification(`Login successful! Welcome back, ${response.user.firstName || response.user.email}!`);
    setTimeout(() => window.location.href = 'index.html', 1500);
  } catch (error) {
    showNotification('Login failed: ' + error.message, 'error');
  }
}

async function initializeAccountPage() {
  if (!appState.token) {
    window.location.href = 'login.html';
    return;
  }
  
  try {
    const profile = await apiCall('/users/profile');
    const orders = await apiCall('/orders');
    
    const profileSection = document.querySelector('.account-info');
    if (profileSection && profile) {
      document.getElementById('user-name').textContent = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'User';
      document.getElementById('user-email').textContent = profile.email;
    }
    
    const ordersContainer = document.getElementById('orders-list');
    if (ordersContainer) {
      if (orders && orders.length > 0) {
        ordersContainer.innerHTML = orders.map(order => `
          <div class="order-card">
            <div class="order-header">
              <div>
                <strong>Order #${order.id.substring(0, 8)}</strong>
                <span class="order-date">${new Date(order.created_at).toLocaleDateString()}</span>
              </div>
              <span class="order-status status-${order.status}">${order.status}</span>
            </div>
            <div class="order-total">Total: ₹${Number(order.total).toFixed(2)}</div>
          </div>
        `).join('');
      } else {
        ordersContainer.innerHTML = '<p>No orders yet. Start shopping!</p>';
      }
    }
    
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', handleLogout);
    }
  } catch (error) {
    console.error('Failed to load account:', error);
    showNotification('Failed to load account data', 'error');
  }
}

function handleLogout() {
  localStorage.removeItem('token');
  localStorage.removeItem('currentUser');
  appState.token = null;
  appState.currentUser = null;
  appState.cartItems = [];
  showNotification('Logged out successfully');
  setTimeout(() => window.location.href = 'index.html', 1000);
}

async function initializeProductDetailPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  
  if (productId) {
    await loadProductDetail(productId);
  } else {
    window.location.href = 'products.html';
  }
}

function addGlobalEventListeners() {
  const mobileToggle = document.querySelector('.nav__mobile-toggle');
  if (mobileToggle) {
    mobileToggle.addEventListener('click', toggleMobileMenu);
  }
  
  document.addEventListener('click', async function(e) {
    if (e.target.classList.contains('add-to-cart')) {
      const productId = e.target.getAttribute('data-product-id');
      await addToCart(productId);
    }
    
    if (e.target.classList.contains('quantity-btn')) {
      const productId = e.target.getAttribute('data-product-id');
      const action = e.target.getAttribute('data-action');
      await updateCartQuantity(productId, action);
    }
    
    if (e.target.classList.contains('cart-item__remove')) {
      const productId = e.target.getAttribute('data-product-id');
      await removeFromCart(productId);
    }
    
    if (e.target.classList.contains('btn--secondary') && e.target.textContent.trim() === 'View Details') {
      const productId = e.target.getAttribute('data-product-id');
      navigateToProductDetail(productId);
    }
    
    if (e.target.classList.contains('product-card__clickable')) {
      const productId = e.target.getAttribute('data-product-id');
      navigateToProductDetail(productId);
    }
  });
}

async function addToCart(productId) {
  if (!appState.token) {
    showNotification('Please login to add items to cart', 'error');
    setTimeout(() => window.location.href = 'login.html', 1500);
    return;
  }
  
  try {
    const result = await apiCall('/cart/add', {
      method: 'POST',
      body: JSON.stringify({
        productId: productId,
        quantity: 1
      })
    });
    
    await loadCart();
    updateCartCount();
    showNotification('Item added to cart!');
  } catch (error) {
    showNotification('Failed to add to cart: ' + error.message, 'error');
  }
}

async function removeFromCart(productId) {
  const item = appState.cartItems.find(item => item.id === productId);
  if (!item) {
    console.error('Cart item not found for productId:', productId);
    return;
  }
  
  try {
    await apiCall(`/cart/${item.cartItemId}`, {
      method: 'DELETE'
    });
    
    await loadCart();
    updateCartCount();
    loadCartItems();
    showNotification('Item removed from cart');
  } catch (error) {
    showNotification('Failed to remove item: ' + error.message, 'error');
  }
}

async function updateCartQuantity(productId, action) {
  const item = appState.cartItems.find(item => item.id === productId);
  if (!item) {
    console.error('Cart item not found for productId:', productId);
    return;
  }
  
  const newQuantity = action === 'increase' ? item.quantity + 1 : item.quantity - 1;
  
  if (newQuantity < 1) return;
  
  try {
    await apiCall(`/cart/${item.cartItemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity: newQuantity })
    });
    
    await loadCart();
    updateCartCount();
    loadCartItems();
  } catch (error) {
    showNotification('Failed to update quantity: ' + error.message, 'error');
  }
}

function updateCartCount() {
  const totalItems = appState.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountElements = document.querySelectorAll('.cart-count');
  cartCountElements.forEach(el => el.textContent = totalItems);
}

function loadCartItems() {
  const container = document.getElementById('cart-items');
  if (!container) return;
  
  if (appState.cartItems.length === 0) {
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
  
  container.innerHTML = appState.cartItems.map(item => `
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
  const subtotal = appState.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.0975;
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
  
  container.innerHTML = appState.cartItems.map(item => `
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
  const subtotal = appState.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.0975;
  const deliveryFee = subtotal > 0 ? 331 : 0;
  const total = subtotal + tax + deliveryFee;
  
  const subtotalEl = document.getElementById('checkout-subtotal');
  const taxEl = document.getElementById('checkout-tax');
  const deliveryEl = document.getElementById('checkout-delivery');
  const totalEl = document.getElementById('checkout-total');
  const orderButton = document.querySelector('.btn--primary');
  
  if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toFixed(2)}`;
  if (taxEl) taxEl.textContent = `₹${tax.toFixed(2)}`;
  if (deliveryEl) deliveryEl.textContent = `₹${deliveryFee.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `₹${total.toFixed(2)}`;
  if (orderButton && orderButton.textContent.includes('Place Order')) {
    orderButton.textContent = `Place Order - ₹${total.toFixed(2)}`;
  }
}

async function loadFeaturedProducts() {
  const container = document.getElementById('featured-products');
  if (!container) return;
  
  const products = await loadProducts({ limit: 4 });
  container.innerHTML = products.map(product => createProductCard(product)).join('');
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
      <div class="product-card__image product-card__clickable" data-product-id="${product.id}">${product.image_url}</div>
      <div class="product-card__content">
        <h3 class="product-card__title product-card__clickable" data-product-id="${product.id}">${product.name}</h3>
        <div class="product-card__price">₹${Number(product.price).toFixed(2)}</div>
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

async function filterProducts(searchTerm, categoryId) {
  const params = {};
  if (searchTerm) params.search = searchTerm;
  if (categoryId && categoryId !== 'all') params.category = categoryId;
  params.limit = 100;
  
  const products = await loadProducts(params);
  filteredProducts = products;
  loadAllProducts();
}

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

function showNotification(message, type = 'success') {
  const existing = document.querySelector('.notification');
  if (existing) {
    existing.remove();
  }
  
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'error' ? '#ef4444' : 'var(--color-success)'};
    color: var(--color-btn-primary-text);
    padding: var(--space-16);
    border-radius: var(--radius-base);
    box-shadow: var(--shadow-lg);
    z-index: 1000;
    animation: slideIn 0.3s ease;
    max-width: 300px;
  `;
  notification.textContent = message;
  
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
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

function navigateToProductDetail(productId) {
  window.location.href = `product-detail.html?id=${productId}`;
}

async function loadProductDetail(productId) {
  try {
    const product = await apiCall(`/products/${productId}`);
    
    const breadcrumb = document.getElementById('product-breadcrumb');
    if (breadcrumb) {
      breadcrumb.textContent = product.name;
    }
    
    const container = document.getElementById('product-detail-content');
    if (container) {
      container.innerHTML = createProductDetailHTML(product);
    }
  } catch (error) {
    console.error('Failed to load product:', error);
    window.location.href = 'products.html';
  }
}

function createProductDetailHTML(product) {
  const stars = generateStars(product.rating);
  
  return `
    <div class="product-detail-container">
      <div class="product-detail__image">
        <div class="product-image-large">${product.image_url}</div>
      </div>
      <div class="product-detail__info">
        <h1 class="product-detail__title">${product.name}</h1>
        <div class="product-detail__price">₹${Number(product.price).toFixed(2)}</div>
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
