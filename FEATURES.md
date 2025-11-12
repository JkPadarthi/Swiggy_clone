# Features Documentation

## Overview
This is a simple food ordering application (Jwiggy) with basic food ordering functionality.

## Implemented Features

### 1. User Authentication
- **Login System**: Simple username/password login (no password hashing for simplicity)
- **User Management**: Users can log in and access the application
- **Session**: User information stored in localStorage after login

### 2. Restaurant Management
- **Restaurant Listing**: Display all available restaurants
- **Restaurant Details**: Each restaurant shows name and description
- **Three Restaurants**: 
  - Pizza Palace (Italian cuisine)
  - Burger King (Fast food)
  - Sushi Express (Japanese cuisine)

### 3. Menu Items
- **Item Display**: Each restaurant displays its menu items
- **Item Information**: Shows name, description, and price
- **Minimum Items**: Each restaurant has at least 3 items

### 4. Shopping Cart
- **Add to Cart**: Users can add items to cart from restaurant pages
- **Cart Display**: View all items in cart with details
- **Cart Management**: 
  - View items with restaurant name
  - See quantity and total price per item
  - Remove items from cart
  - Calculate total cart value

### 5. Checkout Process
- **Address Input**: Single field for delivery address
- **Order Placement**: Direct checkout after entering address
- **Order Processing**: 
  - Creates order record
  - Saves order items
  - Clears cart after successful order
  - Shows order confirmation

## Technical Features

### Backend
- Flask-based REST API
- MySQL database integration
- SQL query parsing and execution
- Error handling and validation

### Frontend
- Lightweight HTML/CSS/JavaScript
- Responsive design
- Simple and clean UI
- No heavy frameworks or libraries

### Database
- MySQL database
- Normalized schema with foreign keys
- Tables: users, restaurants, items, cart, orders, order_items

## Database Schema

1. **users**: User accounts (username, password - no hashing)
2. **restaurants**: Restaurant information
3. **items**: Menu items linked to restaurants
4. **cart**: Shopping cart items
5. **orders**: Order records with address and total
6. **order_items**: Individual items in each order

## API Endpoints

- `POST /api/login` - User login
- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/<id>/items` - Get items for a restaurant
- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add item to cart
- `DELETE /api/cart` - Remove item from cart
- `POST /api/checkout` - Place order

## Limitations (By Design)

- No password hashing (as requested)
- Simple cart (not user-specific in current implementation)
- No payment integration
- No order tracking beyond initial placement
- Basic error handling

