# GrocEasy - Online Grocery Store

## Project Overview
GrocEasy is a full-stack online grocery store application built with Node.js, Express, and Supabase. It allows customers to browse products, add items to their cart, place orders, and manage their accounts. Admin users can manage inventory and view order analytics.

## Technology Stack
- **Backend**: Node.js with Express 5
- **Database**: Supabase (PostgreSQL)
- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Authentication**: JWT tokens with bcryptjs password hashing
- **Port Configuration**: 
  - Frontend & Backend (unified): Port 5000 (0.0.0.0)

## Project Structure
```
GrocEasy-main/
├── config/
│   └── supabase.js          # Supabase client configuration
├── middleware/
│   └── auth.js              # JWT authentication middleware
├── routes/
│   ├── auth.js              # User registration & login
│   ├── users.js             # User profile management
│   ├── products.js          # Product catalog
│   ├── cart.js              # Shopping cart operations
│   ├── orders.js            # Order management
│   └── admin.js             # Admin dashboard & inventory
├── supabase/
│   └── migrations/          # Database schema & sample data
├── images/                  # Category images
├── *.html                   # Frontend pages
├── app.js                   # Frontend JavaScript
├── style.css                # Styling
└── server.js                # Express server entry point
```

## Database Setup
The application uses Supabase with the following tables:
- `users` - Customer and admin accounts
- `categories` - Product categories
- `products` - Product catalog
- `cart_items` - Shopping cart items
- `orders` - Customer orders
- `order_items` - Order line items
- `admin_logs` - Admin activity tracking

### Running Migrations
To set up your Supabase database, run the SQL migrations in the Supabase SQL Editor:
1. Log into your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the migrations in order:
   - `supabase/migrations/20251031164418_001_initial_schema.sql`
   - `supabase/migrations/20251031164545_002_insert_sample_data.sql`

## Environment Variables
The following secrets are required (already configured in Replit Secrets):
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `JWT_SECRET` - Secret key for JWT token generation

## Features
### Customer Features
- Browse products by category
- Search and filter products
- Add items to shopping cart
- Place orders with delivery address
- View order history
- Manage user profile

### Admin Features
- View dashboard with order analytics
- Manage product inventory
- Add/edit/delete products
- View low stock alerts
- Track admin activity

## API Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `POST /api/orders/create` - Create order
- `GET /api/admin/dashboard` - Admin dashboard data
- `GET /api/admin/inventory` - Inventory management

## Development Notes
- The application serves both frontend and API from a single Express server
- Static files (HTML, CSS, JS, images) are served from the root directory
- API routes are prefixed with `/api`
- JWT tokens expire after 7 days
- All prices are in Indian Rupees (₹)

## Recent Changes
- 2025-11-01: Imported from GitHub and configured for Replit environment
- Server configured to bind to 0.0.0.0:5000 for Replit compatibility
- Updated Express 5 routing to handle SPA fallback properly
