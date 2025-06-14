// Cart state
let cartItems = [];
let shippingCost = 50; // Fixed shipping cost in EGP

// Load cart on page load
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    setupEventListeners();
});

// Load cart items from server or localStorage
async function loadCart() {
    try {
        const token = getAuthToken();
        if (token) {
            // Load from server if user is logged in
            const response = await fetch('/api/v1/cart', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch cart');
            const data = await response.json();
            cartItems = data.items;
        } else {
            // Load from localStorage if user is not logged in
            cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
        }
        
        updateCartDisplay();
        updateCartBadge();
    } catch (error) {
        console.error('Error loading cart:', error);
        showNotification('Failed to load cart items', 'error');
    }
}

// Update cart display
function updateCartDisplay() {
    const cartItemsList = document.getElementById('cartItemsList');
    
    if (cartItems.length === 0) {
        cartItemsList.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
                <a href="products.html" class="continue-shopping">Continue Shopping</a>
            </div>
        `;
        return;
    }

    cartItemsList.innerHTML = cartItems.map(item => `
        <div class="cart-item" data-id="${item.productId}">
            <img src="${item.image}" alt="${item.name}" class="item-image">
            <div class="item-details">
                <h3 class="item-name">${item.name}</h3>
                <p class="item-price">${item.price.toFixed(2)} EGP</p>
            </div>
            <div class="item-actions">
                <div class="quantity-controls">
                    <button class="quantity-btn minus" onclick="updateQuantity('${item.productId}', ${item.quantity - 1})">-</button>
                    <input type="number" class="quantity" value="${item.quantity}" min="1" max="10" 
                           onchange="updateQuantity('${item.productId}', this.value)">
                    <button class="quantity-btn plus" onclick="updateQuantity('${item.productId}', ${item.quantity + 1})">+</button>
                </div>
                <button class="remove-btn" onclick="removeFromCart('${item.productId}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');

    updateCartTotals();
}

// Update cart totals
function updateCartTotals() {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + shippingCost;

    document.getElementById('subtotalAmount').textContent = `${subtotal.toFixed(2)} EGP`;
    document.getElementById('shippingAmount').textContent = `${shippingCost.toFixed(2)} EGP`;
    document.getElementById('totalAmount').textContent = `${total.toFixed(2)} EGP`;
}

// Update cart badge
function updateCartBadge() {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.querySelector('.cart-badge');
    if (badge) {
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

// Update item quantity
async function updateQuantity(productId, newQuantity) {
    newQuantity = parseInt(newQuantity);
    if (newQuantity < 1) newQuantity = 1;
    if (newQuantity > 10) newQuantity = 10;

    try {
        const token = getAuthToken();
        if (token) {
            // Update on server if user is logged in
            const response = await fetch(`/api/v1/cart/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ quantity: newQuantity })
            });
            if (!response.ok) throw new Error('Failed to update quantity');
        }

        // Update local cart state
        cartItems = cartItems.map(item => 
            item.productId === productId ? { ...item, quantity: newQuantity } : item
        );

        // Update localStorage if user is not logged in
        if (!token) {
            localStorage.setItem('cart', JSON.stringify(cartItems));
        }

        updateCartDisplay();
        updateCartBadge();
    } catch (error) {
        console.error('Error updating quantity:', error);
        showNotification('Failed to update quantity', 'error');
    }
}

// Remove item from cart
async function removeFromCart(productId) {
    try {
        const token = getAuthToken();
        if (token) {
            // Remove from server if user is logged in
            const response = await fetch(`/api/v1/cart/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to remove item');
        }

        // Update local cart state
        cartItems = cartItems.filter(item => item.productId !== productId);

        // Update localStorage if user is not logged in
        if (!token) {
            localStorage.setItem('cart', JSON.stringify(cartItems));
        }

        updateCartDisplay();
        updateCartBadge();
        showNotification('Item removed from cart');
    } catch (error) {
        console.error('Error removing item:', error);
        showNotification('Failed to remove item', 'error');
    }
}

// Setup event listeners
function setupEventListeners() {
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckout);
    }

    // Format card number input
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            e.target.value = value;
        });
    }

    // Format expiry date input
    const expiryDateInput = document.getElementById('expiryDate');
    if (expiryDateInput) {
        expiryDateInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 2) {
                value = value.slice(0, 2) + '/' + value.slice(2);
            }
            e.target.value = value;
        });
    }
}

// Handle checkout
async function handleCheckout(e) {
    e.preventDefault();

    const token = getAuthToken();
    if (!token) {
        showNotification('Please log in to checkout', 'error');
        window.location.href = 'login.html';
        return;
    }

    if (cartItems.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }

    try {
        // Create order
        const formData = new FormData(e.target);
        const orderData = {
            items: cartItems,
            shipping: {
                fullName: formData.get('fullName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                address: formData.get('address'),
                city: formData.get('city'),
                state: formData.get('state'),
                zipCode: formData.get('zipCode'),
                country: formData.get('country')
            },
            payment: {
                cardName: formData.get('cardName'),
                cardNumber: formData.get('cardNumber'),
                expiryDate: formData.get('expiryDate'),
                cvv: formData.get('cvv')
            },
            totalAmount: parseFloat(document.getElementById('totalAmount').textContent),
            shippingCost
        };

        const response = await fetch('/api/v1/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) throw new Error('Failed to create order');

        // Clear cart after successful order
        const clearCartResponse = await fetch('/api/v1/cart', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!clearCartResponse.ok) throw new Error('Failed to clear cart');

        cartItems = [];
        localStorage.removeItem('cart');
        
        showNotification('Order placed successfully!');
        setTimeout(() => {
            window.location.href = 'orders.html';
        }, 2000);
    } catch (error) {
        console.error('Error during checkout:', error);
        showNotification('Failed to process checkout', 'error');
    }
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Get auth token from localStorage
function getAuthToken() {
    return localStorage.getItem('token');
} 