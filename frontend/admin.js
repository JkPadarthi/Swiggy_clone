// Check if user is admin
document.addEventListener('DOMContentLoaded', function() {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
        window.location.href = '/login';
        return;
    }
    
    const user = JSON.parse(userStr);
    if (!user.is_admin) {
        alert('Access denied. Admin privileges required.');
        window.location.href = '/';
        return;
    }
    
    loadRestaurants();
});

async function loadRestaurants() {
    try {
        const response = await fetch('/api/restaurants');
        const data = await response.json();
        
        if (data.success) {
            const select = document.getElementById('itemRestaurant');
            select.innerHTML = '<option value="">Select Restaurant</option>';
            data.restaurants.forEach(restaurant => {
                const option = document.createElement('option');
                option.value = restaurant.id;
                option.textContent = restaurant.name;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading restaurants:', error);
    }
}

document.getElementById('addRestaurantForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const name = document.getElementById('restaurantName').value.trim();
    const description = document.getElementById('restaurantDescription').value.trim();
    const messageDiv = document.getElementById('adminMessage');
    const submitBtn = document.querySelector('#addRestaurantForm button[type="submit"]');
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Adding...';
    messageDiv.textContent = 'Adding restaurant...';
    messageDiv.className = 'message info';
    
    try {
        const response = await fetch('/api/admin/add-restaurant', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, description })
        });
        
        const data = await response.json();
        
        if (data.success) {
            messageDiv.textContent = '✅ Restaurant added successfully!';
            messageDiv.className = 'message success';
            document.getElementById('addRestaurantForm').reset();
            loadRestaurants(); // Reload restaurant list
        } else {
            messageDiv.textContent = '❌ ' + (data.message || 'Failed to add restaurant');
            messageDiv.className = 'message error';
        }
    } catch (error) {
        messageDiv.textContent = '❌ Error: ' + error.message;
        messageDiv.className = 'message error';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Add Restaurant';
    }
});

document.getElementById('addItemForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const restaurantId = parseInt(document.getElementById('itemRestaurant').value);
    const name = document.getElementById('itemName').value.trim();
    const description = document.getElementById('itemDescription').value.trim();
    const price = parseFloat(document.getElementById('itemPrice').value);
    const messageDiv = document.getElementById('adminMessage');
    const submitBtn = document.querySelector('#addItemForm button[type="submit"]');
    
    if (!restaurantId) {
        messageDiv.textContent = '❌ Please select a restaurant';
        messageDiv.className = 'message error';
        return;
    }
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Adding...';
    messageDiv.textContent = 'Adding menu item...';
    messageDiv.className = 'message info';
    
    try {
        const response = await fetch('/api/admin/add-item', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ restaurant_id: restaurantId, name, description, price })
        });
        
        const data = await response.json();
        
        if (data.success) {
            messageDiv.textContent = '✅ Menu item added successfully!';
            messageDiv.className = 'message success';
            document.getElementById('addItemForm').reset();
        } else {
            messageDiv.textContent = '❌ ' + (data.message || 'Failed to add item');
            messageDiv.className = 'message error';
        }
    } catch (error) {
        messageDiv.textContent = '❌ Error: ' + error.message;
        messageDiv.className = 'message error';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Add Item';
    }
});


