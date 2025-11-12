let cartItems = [];

async function loadCart() {
    const container = document.getElementById('cartItems');
    container.innerHTML = '<div style="text-align: center; padding: 40px;"><p style="color: #686b78;">Loading cart...</p></div>';
    
    try {
        console.log('Loading cart...');
        const response = await fetch('/api/cart');
        console.log('Cart response status:', response.status);
        
        const data = await response.json();
        console.log('Cart data:', data);
        
        if (data.success) {
            cartItems = data.cart;
            displayCart();
        } else {
            container.innerHTML = '<div style="text-align: center; padding: 40px;"><p style="color: #dc3545;">❌ Error loading cart: ' + (data.message || 'Unknown error') + '</p></div>';
        }
    } catch (error) {
        console.error('Error loading cart:', error);
        container.innerHTML = '<div style="text-align: center; padding: 40px;"><p style="color: #dc3545;">❌ Error: ' + error.message + '</p><p style="color: #686b78; font-size: 14px; margin-top: 10px;">Please check if the server is running.</p></div>';
    }
}

function displayCart() {
    const container = document.getElementById('cartItems');
    const checkoutSection = document.getElementById('checkoutSection');
    
    if (cartItems.length === 0) {
        container.innerHTML = '<div class="empty-cart"><p>Your cart is empty</p></div>';
        checkoutSection.style.display = 'none';
        return;
    }
    
    let total = 0;
    container.innerHTML = cartItems.map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        return `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p style="color: #93959f; font-size: 12px;">${item.restaurant_name}</p>
                    <p style="color: #686b78; font-size: 13px; margin-top: 5px;">Qty: ${item.quantity}</p>
                </div>
                <div style="display: flex; align-items: center; gap: 15px;">
                    <span class="cart-item-price">₹${itemTotal}</span>
                    <button class="remove-btn" onclick="removeFromCart(${item.item_id})">
                        Remove
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML += `<div class="total-price">₹${total}</div>`;
    checkoutSection.style.display = 'block';
}

async function removeFromCart(itemId) {
    const btn = event.target;
    const originalText = btn.textContent;
    
    // Show loading state
    btn.disabled = true;
    btn.textContent = 'Removing...';
    
    try {
        console.log('Removing item from cart:', itemId);
        const response = await fetch('/api/cart', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ item_id: itemId })
        });
        
        const data = await response.json();
        console.log('Remove from cart response:', data);
        
        if (data.success) {
            showNotification('✅ Item removed from cart', 'success');
            loadCart(); // Reload cart
        } else {
            btn.disabled = false;
            btn.textContent = originalText;
            showNotification('❌ Error: ' + (data.message || 'Failed to remove item'), 'error');
        }
    } catch (error) {
        console.error('Remove from cart error:', error);
        btn.disabled = false;
        btn.textContent = originalText;
        showNotification('❌ Error: ' + error.message, 'error');
    }
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 15px 20px;
        background-color: ${type === 'success' ? '#d4edda' : '#f8d7da'};
        color: ${type === 'success' ? '#155724' : '#721c24'};
        border-radius: 6px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

document.getElementById('checkoutForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if user is logged in
    const user = loadUserInfo();
    if (!user) {
        alert('Please login to place an order');
        window.location.href = '/login';
        return;
    }
    
    const address = document.getElementById('address').value.trim();
    const messageDiv = document.getElementById('checkoutMessage');
    const submitBtn = document.querySelector('#checkoutForm button[type="submit"]');
    
    // Clear previous messages
    messageDiv.textContent = '';
    messageDiv.className = 'message';
    
    if (!address) {
        messageDiv.textContent = '❌ Please enter a delivery address';
        messageDiv.className = 'message error';
        return;
    }
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Placing Order...';
    messageDiv.textContent = 'Processing your order...';
    messageDiv.className = 'message info';
    
    try {
        console.log('Placing order with address:', address);
        const response = await fetch('/api/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ address, user_id: user.id })
        });
        
        console.log('Checkout response status:', response.status);
        const data = await response.json();
        console.log('Checkout response data:', data);
        
        if (data.success) {
            messageDiv.textContent = `✅ Order placed successfully! Order ID: ${data.order_id}`;
            messageDiv.className = 'message success';
            document.getElementById('checkoutForm').reset();
            showNotification('✅ Order placed successfully!', 'success');
            setTimeout(() => {
                loadCart(); // Reload to show empty cart
            }, 2000);
        } else {
            messageDiv.textContent = '❌ ' + (data.message || 'Checkout failed');
            messageDiv.className = 'message error';
            submitBtn.disabled = false;
            submitBtn.textContent = 'Place Order';
        }
    } catch (error) {
        console.error('Checkout error:', error);
        messageDiv.textContent = '❌ Error: ' + error.message + '. Please check if the server is running.';
        messageDiv.className = 'message error';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Place Order';
    }
});

// Load cart on page load
loadCart();

