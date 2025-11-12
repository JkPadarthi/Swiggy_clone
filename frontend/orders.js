// Check if user is logged in
document.addEventListener('DOMContentLoaded', function() {
    const user = loadUserInfo();
    if (!user) {
        alert('Please login to view order history');
        window.location.href = '/login';
        return;
    }
    
    loadOrders(user.id);
});

async function loadOrders(userId) {
    const container = document.getElementById('ordersContainer');
    container.innerHTML = '<p style="text-align: center; padding: 40px; color: #686b78;">Loading orders...</p>';
    
    try {
        console.log('Loading orders for user:', userId);
        const response = await fetch(`/api/orders?user_id=${userId}`);
        console.log('Orders response status:', response.status);
        
        const data = await response.json();
        console.log('Orders data:', data);
        
        if (data.success) {
            if (data.orders.length === 0) {
                container.innerHTML = `
                    <div style="text-align: center; padding: 60px;">
                        <p style="color: #686b78; font-size: 18px; margin-bottom: 20px;">No orders yet</p>
                        <a href="/restaurants" class="btn" style="width: auto; padding: 12px 24px;">Browse Restaurants</a>
                    </div>
                `;
            } else {
                displayOrders(data.orders);
            }
        } else {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <p style="color: #dc3545;">❌ Error loading orders: ${data.message || 'Unknown error'}</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading orders:', error);
        container.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <p style="color: #dc3545;">❌ Error: ${error.message}</p>
            </div>
        `;
    }
}

function displayOrders(orders) {
    const container = document.getElementById('ordersContainer');
    
    container.innerHTML = orders.map(order => {
        const orderDate = new Date(order.created_at).toLocaleString();
        const statusColor = order.status === 'pending' ? '#ffc107' : 
                           order.status === 'confirmed' ? '#28a745' : 
                           order.status === 'delivered' ? '#17a2b8' : '#6c757d';
        
        return `
            <div class="order-card">
                <div class="order-header">
                    <div>
                        <h3>Order #${order.id}</h3>
                        <p style="color: #686b78; font-size: 14px; margin-top: 5px;">${orderDate}</p>
                    </div>
                    <div class="order-status" style="background-color: ${statusColor}20; color: ${statusColor}; padding: 8px 16px; border-radius: 6px; font-weight: 600; font-size: 13px;">
                        ${order.status.toUpperCase()}
                    </div>
                </div>
                
                <div class="order-details">
                    <div class="order-info">
                        <p><strong>Address:</strong> ${order.address}</p>
                        <p><strong>Items:</strong> ${order.item_count}</p>
                    </div>
                    <div class="order-total">
                        <strong>Total: ₹${parseFloat(order.total_amount).toFixed(2)}</strong>
                    </div>
                </div>
                
                <div class="order-items">
                    <h4 style="margin-bottom: 15px; color: #282c3f;">Items:</h4>
                    ${order.items.map(item => `
                        <div class="order-item">
                            <div>
                                <strong>${item.name}</strong>
                                <p style="color: #686b78; font-size: 13px; margin-top: 3px;">${item.restaurant_name}</p>
                                <p style="color: #686b78; font-size: 12px; margin-top: 3px;">Qty: ${item.quantity} × ₹${parseFloat(item.price).toFixed(2)}</p>
                            </div>
                            <div class="item-total">
                                ₹${(parseFloat(item.price) * item.quantity).toFixed(2)}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }).join('');
}

