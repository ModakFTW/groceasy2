// Cart management
async function loadCart() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/cart/${currentUser.id}`);
        if (!response.ok) throw new Error('Failed to load cart');
        
        const cartItems = await response.json();
        displayCart(cartItems);
        updateCartSummary(cartItems);
    } catch (error) {
        console.error('Error loading cart:', error);
        alert('Failed to load cart. Please try again.');
    }
}

function displayCart(items) {
    const cartContainer = document.getElementById('cart-items');
    
    if (items.length === 0) {
        cartContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        return;
    }

    const itemsHtml = items.map(item => `
        <div class="cart-item">
            <div class="cart-item__details">
                <h3>${item.name}</h3>
                <p class="price">₹${item.price.toFixed(2)}</p>
            </div>
            <div class="cart-item__quantity">
                <button onclick="updateQuantity(${item.productId}, ${item.quantity - 1})" ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity(${item.productId}, ${item.quantity + 1})">+</button>
            </div>
            <div class="cart-item__total">
                ₹${(item.price * item.quantity).toFixed(2)}
            </div>
            <button class="cart-item__remove" onclick="removeFromCart(${item.productId})">
                Remove
            </button>
        </div>
    `).join('');

    cartContainer.innerHTML = itemsHtml;
}

function updateCartSummary(items) {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = subtotal > 500 ? 0 : 50;
    const tax = subtotal * 0.18; // 18% tax
    const total = subtotal + deliveryFee + tax;

    document.getElementById('cart-subtotal').textContent = `₹${subtotal.toFixed(2)}`;
    document.getElementById('delivery-fee').textContent = `₹${deliveryFee.toFixed(2)}`;
    document.getElementById('cart-tax').textContent = `₹${tax.toFixed(2)}`;
    document.getElementById('cart-total').textContent = `₹${total.toFixed(2)}`;

    // Update cart count in navigation
    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector('.cart-count').textContent = cartCount;
}

async function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) return;

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
            body: JSON.stringify({
                productId,
                quantity: newQuantity
            })
        });

        if (!response.ok) throw new Error('Failed to update cart');
        
        const updatedCart = await response.json();
        displayCart(updatedCart);
        updateCartSummary(updatedCart);
    } catch (error) {
        console.error('Error updating cart:', error);
        alert('Failed to update cart. Please try again.');
    }
}

async function removeFromCart(productId) {
    await updateQuantity(productId, 0);
}

// Load cart when page loads
document.addEventListener('DOMContentLoaded', loadCart);