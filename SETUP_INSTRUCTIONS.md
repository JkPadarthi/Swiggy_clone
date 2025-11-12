# Setup Instructions

## Step 1: Database Configuration
Your `.env` file is already created. Make sure it has your database credentials:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=swiggy_clone
```

## Step 2: Create Database Tables

Run the following command in your terminal to create all tables:

```bash
mysql -u your_username -p your_database_name < sql/create_tables.sql
```

Or if you prefer to run it directly in MySQL:

```sql
source sql/create_tables.sql;
```

## Step 3: Insert Sample Data

Run the following command to insert sample restaurants and items:

```bash
mysql -u your_username -p your_database_name < sql/insert_data.sql
```

Or in MySQL:

```sql
source sql/insert_data.sql;
```

## Step 4: Start the Flask Application

```bash
cd backend
python3 app.py
```

The application will run on `http://localhost:5000`

## Step 5: Test the Application

1. **Test Database Connection**: Visit `http://localhost:5000/db-test`
2. **Register a New User**: Visit `http://localhost:5000/register`
3. **Login**: Use your registered credentials at `http://localhost:5000/login`
4. **Browse Restaurants**: Visit `http://localhost:5000/restaurants`
5. **Add to Cart**: Click "ADD" on any menu item
6. **Checkout**: Go to cart, enter address, and place order

## Database Schema Reference

See `backend/database_helper.py` for complete database schema documentation.

## Sample Users (from insert_data.sql)

- Username: `user1`, Password: `password1`
- Username: `user2`, Password: `password2`
- Username: `admin`, Password: `admin123`

## Sample Restaurants

1. **Pizza Palace** - Italian cuisine
2. **Burger King** - Fast food
3. **Sushi Express** - Japanese dishes

Each restaurant has 3 menu items.

