let restaurants = [];
let currentRestaurantItems = {};

async function loadRestaurants() {
    const container = document.getElementById('restaurants');
    container.innerHTML = '<div style="text-align: center; padding: 40px;"><p style="color: #686b78;">Loading restaurants...</p></div>';
    
    try {
        console.log('Loading restaurants...');
        const response = await fetch('/api/restaurants');
        console.log('Response status:', response.status);
        
        const data = await response.json();
        console.log('Restaurants data:', data);
        
        if (data.success) {
            restaurants = data.restaurants;
            if (restaurants.length === 0) {
                container.innerHTML = '<div style="text-align: center; padding: 40px;"><p style="color: #686b78;">No restaurants available. Please add restaurants to the database.</p></div>';
            } else {
                displayRestaurants();
            }
        } else {
            container.innerHTML = '<div style="text-align: center; padding: 40px;"><p style="color: #dc3545;">❌ Error loading restaurants: ' + (data.message || 'Unknown error') + '</p><p style="color: #686b78; font-size: 14px; margin-top: 10px;">Make sure the database is connected and tables are created.</p></div>';
        }
    } catch (error) {
        console.error('Error loading restaurants:', error);
        container.innerHTML = '<div style="text-align: center; padding: 40px;"><p style="color: #dc3545;">❌ Error: ' + error.message + '</p><p style="color: #686b78; font-size: 14px; margin-top: 10px;">Please check if the server is running.</p></div>';
    }
}

async function loadRestaurantItems(restaurantId) {
    if (currentRestaurantItems[restaurantId]) {
        return currentRestaurantItems[restaurantId];
    }
    
    const itemsContainer = document.getElementById(`items-${restaurantId}`);
    if (itemsContainer) {
        itemsContainer.innerHTML = '<p style="padding: 20px; text-align: center; color: #93959f;">Loading items...</p>';
    }
    
    try {
        console.log(`Loading items for restaurant ${restaurantId}...`);
        const response = await fetch(`/api/restaurants/${restaurantId}/items`);
        const data = await response.json();
        
        if (data.success) {
            currentRestaurantItems[restaurantId] = data.items;
            return data.items;
        } else {
            console.error('Error loading items:', data.message);
            if (itemsContainer) {
                itemsContainer.innerHTML = '<p style="padding: 20px; text-align: center; color: #dc3545;">Error loading items</p>';
            }
        }
    } catch (error) {
        console.error('Error loading items:', error);
        if (itemsContainer) {
            itemsContainer.innerHTML = '<p style="padding: 20px; text-align: center; color: #dc3545;">Error loading items</p>';
        }
    }
    return [];
}

function displayRestaurants() {
    const container = document.getElementById('restaurants');
    
    if (restaurants.length === 0) {
        container.innerHTML = '<p>No restaurants available</p>';
        return;
    }
    
    container.innerHTML = restaurants.map(restaurant => `
        <div class="restaurant-card">
            <div class="restaurant-header">
                <h3>${restaurant.name}</h3>
                <p>${restaurant.description || 'Delicious food awaits'}</p>
            </div>
            <div class="items-list" id="items-${restaurant.id}">
                <p style="padding: 20px; text-align: center; color: #93959f;">Loading items...</p>
            </div>
        </div>
    `).join('');
    
    // Load items for each restaurant
    restaurants.forEach(restaurant => {
        loadRestaurantItems(restaurant.id).then(items => {
            displayItems(restaurant.id, items);
        });
    });
}

function displayItems(restaurantId, items) {
    const itemsContainer = document.getElementById(`items-${restaurantId}`);
    
    if (!itemsContainer) return;
    
    if (items.length === 0) {
        itemsContainer.innerHTML = '<p style="padding: 20px; text-align: center; color: #93959f;">No items available for this restaurant</p>';
        return;
    }
    
    itemsContainer.innerHTML = items.map(item => `
        <div class="item-card">
            <div class="item-info">
                <h4>${item.name}</h4>
                <p>${item.description || ''}</p>
                <span class="item-price">₹${item.price}</span>
            </div>
            <div class="item-actions">
                <button class="add-to-cart-btn" onclick="addToCart(${item.id}, '${item.name.replace(/'/g, "\\'")}')">
                    ADD
                </button>
            </div>
        </div>
    `).join('');
}

async function addToCart(itemId, itemName) {
    const btn = event.target;
    const originalText = btn.textContent;
    
    // Show loading state
    btn.disabled = true;
    btn.textContent = 'ADDING...';
    
    try {
        console.log('Adding item to cart:', itemId);
        const response = await fetch('/api/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ item_id: itemId, quantity: 1 })
        });
        
        const data = await response.json();
        console.log('Add to cart response:', data);
        
        if (data.success) {
            btn.textContent = '✓ ADDED';
            btn.style.backgroundColor = '#28a745';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.backgroundColor = '';
                btn.disabled = false;
            }, 2000);
            
            // Show notification
            showNotification('✅ ' + itemName + ' added to cart!', 'success');
        } else {
            btn.textContent = originalText;
            btn.disabled = false;
            showNotification('❌ Error: ' + (data.message || 'Failed to add item'), 'error');
        }
    } catch (error) {
        console.error('Add to cart error:', error);
        btn.textContent = originalText;
        btn.disabled = false;
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

// Load restaurants on page load
loadRestaurants();

