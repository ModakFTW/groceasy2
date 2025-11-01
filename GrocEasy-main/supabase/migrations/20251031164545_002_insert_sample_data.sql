/*
  # Insert Sample Data

  1. Insert categories
  2. Insert products
  3. Insert sample admin user (for testing)

  Note: Passwords are hashed with bcryptjs in the auth routes
*/

INSERT INTO categories (name, slug, description) VALUES
  ('Fruits & Vegetables', 'fruits', 'Fresh fruits and vegetables'),
  ('Dairy', 'dairy', 'Milk, yogurt, cheese and more'),
  ('Meat & Seafood', 'meat', 'Fresh meat and seafood'),
  ('Pantry', 'pantry', 'Pantry staples and dry goods')
ON CONFLICT (name) DO NOTHING;

INSERT INTO products (category_id, name, description, price, stock, min_stock, rating, reviews, image_url) VALUES
  ((SELECT id FROM categories WHERE slug = 'fruits'), 'Fresh Bananas (4 pieces)', 'Fresh, ripe bananas perfect for snacking or baking', 40, 15, 10, 4.5, 23, '🍌'),
  ((SELECT id FROM categories WHERE slug = 'dairy'), 'Organic Milk (1/2 litre)', 'Fresh organic whole milk, 1 gallon', 60, 8, 10, 4.7, 45, '🥛'),
  ((SELECT id FROM categories WHERE slug = 'meat'), 'Chicken Breast (1 kg)', 'Fresh boneless, skinless chicken breast, 2 lbs', 320, 12, 8, 4.3, 18, '🍗'),
  ((SELECT id FROM categories WHERE slug = 'pantry'), 'Whole Wheat Bread (1 packet)', 'Freshly baked whole wheat bread loaf', 45, 22, 5, 4.4, 31, '🍞'),
  ((SELECT id FROM categories WHERE slug = 'fruits'), 'Fresh Apples (1 kg)', 'Crisp Honeycrisp apples, 3 lb bag', 120, 18, 10, 4.6, 67, '🍎'),
  ((SELECT id FROM categories WHERE slug = 'dairy'), 'Greek Yogurt (1 litre)', 'Plain Greek yogurt, 32 oz container', 180, 25, 8, 4.5, 29, '🥛'),
  ((SELECT id FROM categories WHERE slug = 'fruits'), 'Fresh Spinach (1 bunch)', 'Fresh baby spinach leaves, 5 oz bag', 25, 20, 12, 4.2, 34, '🥬'),
  ((SELECT id FROM categories WHERE slug = 'meat'), 'Salmon Fillet (300 g)', 'Fresh Atlantic salmon fillet, 1 lb', 450, 6, 10, 4.8, 52, '🐟')
ON CONFLICT DO NOTHING;
