# GrocEasy Setup Guide

## Quick Start

Your GrocEasy application is now running on Replit! However, to fully use all features, you need to set up the Supabase database.

## Supabase Database Setup

### Step 1: Access Your Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and log into your account
2. Open the project you configured with the credentials in Replit Secrets

### Step 2: Run Database Migrations
You need to run two SQL scripts to set up your database:

1. In your Supabase dashboard, click on **SQL Editor** in the left sidebar
2. Click **New Query**

#### Migration 1: Create Database Schema
Copy the entire contents of `supabase/migrations/20251031164418_001_initial_schema.sql` and paste it into the SQL editor, then click **Run**.

This will create all the necessary tables:
- users
- categories
- products
- cart_items
- orders
- order_items
- admin_logs

#### Migration 2: Insert Sample Data
Copy the entire contents of `supabase/migrations/20251031164545_002_insert_sample_data.sql` and paste it into the SQL editor, then click **Run**.

This will populate your database with:
- 4 product categories (Fruits & Vegetables, Dairy, Meat & Seafood, Pantry)
- 8 sample products

### Step 3: Create an Admin User (Optional)
To access the admin dashboard, you'll need to create an admin user. You can do this in two ways:

**Option A: Register through the app and update the role**
1. Register a new user through the app at `/register.html`
2. In Supabase SQL Editor, run:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

**Option B: Create admin user directly in database**
1. In Supabase SQL Editor, run:
```sql
INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES
  ('admin@groceasy.com', '$2a$10$YourHashedPasswordHere', 'Admin', 'User', 'admin');
```
(Note: You'll need to hash the password using bcrypt first, or register through the app and update the role)

## Verifying Setup

1. **Check the Homepage**: Should display 4 categories and featured products
2. **Browse Products**: Navigate to Products page - should show all 8 sample products
3. **Test Registration**: Try creating a new user account
4. **Test Login**: Log in with your created account
5. **Test Shopping**: Add items to cart and proceed to checkout

## API Health Check
Visit `/api/health` to verify the backend API is running properly.

## Troubleshooting

### Products not loading?
- Verify you've run both migration scripts in Supabase
- Check the browser console for errors
- Verify your Supabase credentials are correct in Replit Secrets

### Can't log in?
- Make sure you've registered a user first
- Check that JWT_SECRET is set in Replit Secrets
- Verify the password meets requirements

### Admin dashboard not accessible?
- Make sure your user's role is set to 'admin' in the database
- Log out and log back in after updating the role

## What's Next?

- Customize product categories and add your own products
- Update styling in `style.css` to match your branding
- Configure payment integration for real transactions
- Add email notifications for orders
- Deploy to production using Replit's deployment feature

## Support

For issues specific to:
- **Supabase**: Visit [Supabase Documentation](https://supabase.com/docs)
- **Replit**: Use Replit support or community forums
- **This App**: Check the code in `GrocEasy-main/` directory

Enjoy your grocery store! 🌱
