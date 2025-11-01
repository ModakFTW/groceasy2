# GrocEasy Setup Instructions

## Quick Start Summary
✅ Your GrocEasy app is now running on Replit!  
✅ Backend API is working on port 5000  
✅ Frontend is accessible via the Webview  

## Database Setup Required

You need to run the database migrations in your Supabase console:

### Step 1: Access Supabase SQL Editor
1. Go to https://supabase.com and log into your project
2. Click on "SQL Editor" in the left sidebar

### Step 2: Run Migrations in Order
Run these SQL files in your Supabase SQL Editor (copy and paste the contents):

1. **Initial Schema** (creates all tables):
   - File: `GrocEasy-main/supabase/migrations/20251031164418_001_initial_schema.sql`
   
2. **Sample Data** (adds sample products and categories):
   - File: `GrocEasy-main/supabase/migrations/20251031164545_002_insert_sample_data.sql`
   
3. **Fix Registration** (allows users to register):
   - File: `GrocEasy-main/supabase/migrations/20251101_fix_registration.sql`

### Step 3: Verify Setup
After running the migrations, test the app:
- Visit the app in Webview
- Try registering a new user account
- Browse products and add items to cart
- Place a test order

## Backend API Endpoints Working

✅ **Health Check**: `GET /api/health`  
✅ **Categories**: `GET /api/products/categories`  
✅ **Products List**: `GET /api/products`  
✅ **Product Search**: `GET /api/products?search=banana`  
✅ **Category Filter**: `GET /api/products?category=<category_id>`  
✅ **User Registration**: `POST /api/auth/register`  
✅ **User Login**: `POST /api/auth/login`  
✅ **Cart Operations**: `GET/POST/PUT/DELETE /api/cart/*`  
✅ **Order Creation**: `POST /api/orders/create`  
✅ **Admin Dashboard**: `GET /api/admin/dashboard`  

## Creating an Admin User

To access admin features, you need to create an admin user. After registering a normal user:

1. Go to your Supabase dashboard
2. Click "Table Editor" → "users"
3. Find your user and click to edit
4. Change the `role` column from `customer` to `admin`
5. Save changes

## Environment Variables (Already Configured)
- ✅ `VITE_SUPABASE_URL` - Your Supabase project URL
- ✅ `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- ✅ `JWT_SECRET` - Secret for JWT token generation

## Deployment
When you're ready to deploy:
- Click the "Deploy" button in Replit
- Your deployment is already configured for autoscale
- The app will be available at a public URL

## Features Available

### Customer Features
- ✅ Browse products by category
- ✅ Search and filter products
- ✅ Add items to cart
- ✅ Checkout and place orders
- ✅ View order history
- ✅ Manage profile

### Admin Features (requires admin role)
- ✅ View sales dashboard
- ✅ Manage inventory
- ✅ Add/edit products
- ✅ View all orders
- ✅ Track low stock items

## Troubleshooting

**User registration fails?**
- Make sure you've run the `20251101_fix_registration.sql` migration

**Products not showing?**
- Make sure you've run the sample data migration

**Can't access admin features?**
- Make sure your user role is set to 'admin' in Supabase

Need help? Check the server logs in the Console tab!
