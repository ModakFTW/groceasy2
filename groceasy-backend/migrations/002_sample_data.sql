-- Sample data for testing

-- Insert sample users
INSERT INTO users (first_name, last_name, email, password, phone, user_type) VALUES
('Admin', 'User', 'admin@groceasy.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LHRRAOFYzaGaNLqSq', '1234567890', 'admin'),
('John', 'Doe', 'john@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LHRRAOFYzaGaNLqSq', '9876543210', 'customer');

-- Insert sample products
INSERT INTO products (name, description, price, category, image, stock, rating, reviews_count) VALUES
('Fresh Bananas (4 pieces)', 'Fresh, ripe bananas perfect for snacking or baking', 40.00, 'fruits', '🍌', 15, 4.5, 23),
('Organic Milk (1/2 litre)', 'Fresh organic whole milk', 60.00, 'dairy', '🥛', 8, 4.7, 45),
('Chicken Breast (1 kg)', 'Fresh boneless, skinless chicken breast', 320.00, 'meat', '🍗', 12, 4.3, 18),
('Whole Wheat Bread (1 packet)', 'Freshly baked whole wheat bread loaf', 45.00, 'pantry', '🍞', 22, 4.4, 31),
('Fresh Apples (1 kg)', 'Crisp Honeycrisp apples', 120.00, 'fruits', '🍎', 18, 4.6, 67),
('Greek Yogurt (1 litre)', 'Plain Greek yogurt', 180.00, 'dairy', '🥛', 25, 4.5, 29),
('Fresh Spinach (1 bunch)', 'Fresh baby spinach leaves', 25.00, 'fruits', '🥬', 20, 4.2, 34),
('Salmon Fillet (300 g)', 'Fresh Atlantic salmon fillet', 450.00, 'meat', '🐟', 6, 4.8, 52);