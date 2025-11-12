# Changelog

All notable changes to this project will be documented in this file.

## [SCRATCH PAD - Current Work]

### ✅ Completed:
- ✅ Database connection testing implemented
- ✅ Database helper file created with all schemas (database_helper.py)
- ✅ SQL files ready for execution (create_tables.sql, insert_data.sql)
- ✅ User registration API endpoint added (/api/register)
- ✅ Registration frontend page created (register.html, register.js)
- ✅ Frontend styling updated with Swiggy-inspired design
- ✅ Improved restaurant cards and menu item display
- ✅ Enhanced cart page design
- ✅ Updated home page with better UI

### 📋 Ready for Testing:
1. Run SQL scripts to create tables
2. Run SQL scripts to insert sample data
3. Test user registration from frontend
4. Test login with registered users
5. Test restaurant browsing
6. Test add to cart functionality
7. Test checkout process

### 📝 SQL Commands to Run:
```bash
# Create tables
mysql -u your_username -p your_database < sql/create_tables.sql

# Insert sample data
mysql -u your_username -p your_database < sql/insert_data.sql
```

---

## [1.0.0] - Initial Release

### Added
- User login system (no password hashing)
- Restaurant listing page with 3 restaurants
- Menu items display (minimum 3 items per restaurant)
- Shopping cart functionality
  - Add items to cart
  - View cart items
  - Remove items from cart
  - Calculate total price
- Checkout system
  - Address input field
  - Order placement
  - Order confirmation
- Flask backend with REST API
- MySQL database integration
- Database schema (CREATE and INSERT SQL files)
- Frontend pages:
  - Home page
  - Login page
  - Restaurants page
  - Cart page
- Environment configuration (.env.example)
- Documentation (FEATURES.md, CHANGELOG.md, README.md)

### Technical Details
- Backend: Flask 3.0.0
- Database: MySQL (mysql-connector-python 8.2.0)
- Frontend: Vanilla HTML/CSS/JavaScript
- No external frontend frameworks
- Lightweight and simple design

### Database Tables Created
- users
- restaurants
- items
- cart
- orders
- order_items

### Sample Data
- 3 users (user1, user2, admin)
- 3 restaurants (Pizza Palace, Burger King, Sushi Express)
- 9 items total (3 per restaurant)

