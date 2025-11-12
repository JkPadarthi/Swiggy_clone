-- Insert Users
INSERT INTO users (username, password, email) VALUES
('user1', 'password1', 'user1@example.com'),
('user2', 'password2', 'user2@example.com'),
('admin', 'admin123', 'admin@example.com');

-- Insert Restaurants
INSERT INTO restaurants (name, description) VALUES
('Pizza Palace', 'Delicious pizzas and Italian cuisine'),
('Burger King', 'Juicy burgers and fast food'),
('Sushi Express', 'Fresh sushi and Japanese dishes');

-- Insert Items for Pizza Palace (restaurant_id = 1)
INSERT INTO items (restaurant_id, name, description, price) VALUES
(1, 'Margherita Pizza', 'Classic pizza with tomato and mozzarella', 299.00),
(1, 'Pepperoni Pizza', 'Pizza with pepperoni and cheese', 399.00),
(1, 'Veggie Supreme', 'Pizza loaded with vegetables', 349.00);

-- Insert Items for Burger King (restaurant_id = 2)
INSERT INTO items (restaurant_id, name, description, price) VALUES
(2, 'Classic Burger', 'Beef patty with lettuce and tomato', 199.00),
(2, 'Chicken Burger', 'Grilled chicken burger with special sauce', 249.00),
(2, 'Veg Burger', 'Vegetarian burger with fresh veggies', 179.00);

-- Insert Items for Sushi Express (restaurant_id = 3)
INSERT INTO items (restaurant_id, name, description, price) VALUES
(3, 'Salmon Sushi', 'Fresh salmon sushi rolls', 449.00),
(3, 'California Roll', 'Crab and avocado roll', 299.00),
(3, 'Dragon Roll', 'Eel and cucumber roll', 399.00);

