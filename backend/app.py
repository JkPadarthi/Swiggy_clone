from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, 
            static_folder='../frontend', 
            template_folder='../frontend', 
            static_url_path='')
CORS(app)

# Database configuration
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': int(os.getenv('DB_PORT', 3306)),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD'),
    'database': os.getenv('DB_NAME')
}

def get_db_connection():
    """Create and return database connection"""
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login')
def login_page():
    return render_template('login.html')

@app.route('/register')
def register_page():
    return render_template('register.html')

@app.route('/restaurants')
def restaurants_page():
    return render_template('restaurants.html')

@app.route('/cart')
def cart_page():
    return render_template('cart.html')

@app.route('/db-test')
def db_test_page():
    return render_template('db_test.html')

# Serve static files (JS, CSS) - must be after page routes
@app.route('/<filename>')
def serve_static_files(filename):
    """Serve static files (JS, CSS) from frontend directory"""
    import os
    frontend_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'frontend')
    # Only serve .js, .css files that actually exist
    if filename.endswith(('.js', '.css')):
        file_path = os.path.join(frontend_path, filename)
        if os.path.exists(file_path):
            return send_from_directory(frontend_path, filename)
    return "File not found", 404

# API Routes

@app.route('/api/db-test', methods=['GET'])
def test_db_connection():
    """Test database connection endpoint"""
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({
                'success': False,
                'message': 'Database connection failed',
                'error': 'Could not establish connection. Check your .env file settings.'
            }), 500
        
        # Try to execute a simple query
        cursor = conn.cursor()
        cursor.execute("SELECT 1")
        cursor.fetchone()
        
        # Check if tables exist
        cursor.execute("SHOW TABLES")
        tables = cursor.fetchall()
        table_names = [table[0] for table in tables] if tables else []
        
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Database connection successful!',
            'tables': table_names,
            'table_count': len(table_names)
        })
    except Error as e:
        return jsonify({
            'success': False,
            'message': 'Database connection failed',
            'error': str(e)
        }), 500
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Unexpected error',
            'error': str(e)
        }), 500

@app.route('/api/register', methods=['POST'])
def register():
    """User registration endpoint"""
    data = request.json
    username = data.get('username')
    password = data.get('password')
    email = data.get('email', '')
    
    if not username or not password:
        return jsonify({'success': False, 'message': 'Username and password required'}), 400
    
    conn = get_db_connection()
    if not conn:
        return jsonify({'success': False, 'message': 'Database connection failed'}), 500
    
    try:
        cursor = conn.cursor(dictionary=True)
        
        # Check if username already exists
        check_query = "SELECT * FROM users WHERE username = %s"
        cursor.execute(check_query, (username,))
        existing_user = cursor.fetchone()
        
        if existing_user:
            return jsonify({'success': False, 'message': 'Username already exists'}), 400
        
        # Insert new user
        insert_query = "INSERT INTO users (username, password, email) VALUES (%s, %s, %s)"
        cursor.execute(insert_query, (username, password, email))
        conn.commit()
        
        # Get the created user
        user_id = cursor.lastrowid
        return jsonify({
            'success': True,
            'message': 'Registration successful',
            'user': {'id': user_id, 'username': username}
        })
    except Error as e:
        conn.rollback()
        return jsonify({'success': False, 'message': f'Database error: {str(e)}'}), 500
    finally:
        if conn:
            conn.close()

@app.route('/api/login', methods=['POST'])
def login():
    """User login endpoint"""
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'success': False, 'message': 'Username and password required'}), 400
    
    conn = get_db_connection()
    if not conn:
        return jsonify({'success': False, 'message': 'Database connection failed'}), 500
    
    try:
        cursor = conn.cursor(dictionary=True)
        query = "SELECT * FROM users WHERE username = %s AND password = %s"
        cursor.execute(query, (username, password))
        user = cursor.fetchone()
        
        if user:
            return jsonify({
                'success': True,
                'message': 'Login successful',
                'user': {'id': user['id'], 'username': user['username']}
            })
        else:
            return jsonify({'success': False, 'message': 'Invalid credentials'}), 401
    except Error as e:
        return jsonify({'success': False, 'message': f'Database error: {str(e)}'}), 500
    finally:
        if conn:
            conn.close()

@app.route('/api/restaurants', methods=['GET'])
def get_restaurants():
    """Get all restaurants"""
    conn = get_db_connection()
    if not conn:
        return jsonify({'success': False, 'message': 'Database connection failed'}), 500
    
    try:
        cursor = conn.cursor(dictionary=True)
        query = "SELECT * FROM restaurants"
        cursor.execute(query)
        restaurants = cursor.fetchall()
        return jsonify({'success': True, 'restaurants': restaurants})
    except Error as e:
        return jsonify({'success': False, 'message': f'Database error: {str(e)}'}), 500
    finally:
        if conn:
            conn.close()

@app.route('/api/restaurants/<int:restaurant_id>/items', methods=['GET'])
def get_restaurant_items(restaurant_id):
    """Get items for a specific restaurant"""
    conn = get_db_connection()
    if not conn:
        return jsonify({'success': False, 'message': 'Database connection failed'}), 500
    
    try:
        cursor = conn.cursor(dictionary=True)
        query = "SELECT * FROM items WHERE restaurant_id = %s"
        cursor.execute(query, (restaurant_id,))
        items = cursor.fetchall()
        return jsonify({'success': True, 'items': items})
    except Error as e:
        return jsonify({'success': False, 'message': f'Database error: {str(e)}'}), 500
    finally:
        if conn:
            conn.close()

@app.route('/api/cart', methods=['GET', 'POST', 'DELETE'])
def cart():
    """Cart operations"""
    conn = get_db_connection()
    if not conn:
        return jsonify({'success': False, 'message': 'Database connection failed'}), 500
    
    try:
        cursor = conn.cursor(dictionary=True)
        
        if request.method == 'GET':
            # Get cart items (in a real app, this would be user-specific)
            query = "SELECT c.*, i.name, i.price, i.description, r.name as restaurant_name FROM cart c JOIN items i ON c.item_id = i.id JOIN restaurants r ON i.restaurant_id = r.id"
            cursor.execute(query)
            cart_items = cursor.fetchall()
            return jsonify({'success': True, 'cart': cart_items})
        
        elif request.method == 'POST':
            # Add item to cart
            data = request.json
            item_id = data.get('item_id')
            quantity = data.get('quantity', 1)
            
            if not item_id:
                return jsonify({'success': False, 'message': 'Item ID required'}), 400
            
            # Check if item already in cart
            check_query = "SELECT * FROM cart WHERE item_id = %s"
            cursor.execute(check_query, (item_id,))
            existing = cursor.fetchone()
            
            if existing:
                # Update quantity
                update_query = "UPDATE cart SET quantity = quantity + %s WHERE item_id = %s"
                cursor.execute(update_query, (quantity, item_id))
            else:
                # Insert new item
                insert_query = "INSERT INTO cart (item_id, quantity) VALUES (%s, %s)"
                cursor.execute(insert_query, (item_id, quantity))
            
            conn.commit()
            return jsonify({'success': True, 'message': 'Item added to cart'})
        
        elif request.method == 'DELETE':
            # Remove item from cart
            data = request.json
            item_id = data.get('item_id')
            
            if not item_id:
                return jsonify({'success': False, 'message': 'Item ID required'}), 400
            
            delete_query = "DELETE FROM cart WHERE item_id = %s"
            cursor.execute(delete_query, (item_id,))
            conn.commit()
            return jsonify({'success': True, 'message': 'Item removed from cart'})
    
    except Error as e:
        return jsonify({'success': False, 'message': f'Database error: {str(e)}'}), 500
    finally:
        if conn:
            conn.close()

@app.route('/api/checkout', methods=['POST'])
def checkout():
    """Process checkout"""
    conn = get_db_connection()
    if not conn:
        return jsonify({'success': False, 'message': 'Database connection failed'}), 500
    
    try:
        data = request.json
        address = data.get('address')
        
        if not address:
            return jsonify({'success': False, 'message': 'Address required'}), 400
        
        cursor = conn.cursor(dictionary=True)
        
        # Get cart items
        cart_query = "SELECT * FROM cart"
        cursor.execute(cart_query)
        cart_items = cursor.fetchall()
        
        if not cart_items:
            return jsonify({'success': False, 'message': 'Cart is empty'}), 400
        
        # Calculate total
        total = 0
        for item in cart_items:
            item_query = "SELECT price FROM items WHERE id = %s"
            cursor.execute(item_query, (item['item_id'],))
            item_data = cursor.fetchone()
            total += item_data['price'] * item['quantity']
        
        # Create order
        order_query = "INSERT INTO orders (user_id, address, total_amount, status) VALUES (%s, %s, %s, %s)"
        cursor.execute(order_query, (1, address, total, 'pending'))  # Assuming user_id = 1 for now
        order_id = cursor.lastrowid
        
        # Create order items
        for item in cart_items:
            item_query = "SELECT price FROM items WHERE id = %s"
            cursor.execute(item_query, (item['item_id'],))
            item_data = cursor.fetchone()
            order_item_query = "INSERT INTO order_items (order_id, item_id, quantity, price) VALUES (%s, %s, %s, %s)"
            cursor.execute(order_item_query, (order_id, item['item_id'], item['quantity'], item_data['price']))
        
        # Clear cart
        clear_cart_query = "DELETE FROM cart"
        cursor.execute(clear_cart_query)
        
        conn.commit()
        return jsonify({'success': True, 'message': 'Order placed successfully', 'order_id': order_id})
    
    except Error as e:
        conn.rollback()
        return jsonify({'success': False, 'message': f'Database error: {str(e)}'}), 500
    finally:
        if conn:
            conn.close()

if __name__ == '__main__':
    app.run(debug=True, port=5000)

