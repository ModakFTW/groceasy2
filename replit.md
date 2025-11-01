# GrocEasy - Online Grocery Store

## Project Overview
GrocEasy is a **fully integrated** full-stack online grocery store application built with Node.js, Express, and Supabase. The frontend and backend are completely connected, allowing customers to browse products, manage their cart, place orders, and manage their accounts - all with real data from Supabase.

## Technology Stack
- **Backend**: Node.js with Express 5
- **Database**: Supabase (PostgreSQL)
- **Frontend**: Vanilla HTML, CSS, JavaScript (fully integrated with backend APIs)
- **Authentication**: JWT tokens with bcryptjs password hashing
- **Port Configuration**: 
  - Frontend & Backend (unified): Port 5000 (0.0.0.0)

## Integration Status
✅ **FULLY INTEGRATED** - All frontend features connect to backend APIs
- Products and categories load from Supabase database
- User authentication works with real backend validation
- Shopping cart persists to database per user
- Orders are created and stored in database
- Admin dashboard shows real analytics and inventory

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
│       ├── 001_initial_schema.sql
│       ├── 002_insert_sample_data.sql
│       └── fix_registration.sql  ⚠️ Required!
├── images/                  # Category images
├── *.html                   # Frontend pages
├── app.js                   # ✨ Integrated Frontend JavaScript
├── style.css                # Styling
└── server.js                # Express server (serves both API & frontend)
```

## Database Setup (REQUIRED)
The application uses Supabase. **You MUST run these migrations in order**:

1. **Initial Schema** - Creates all tables:
   - File: `supabase/migrations/20251031164418_001_initial_schema.sql`
   
2. **Sample Data** - Adds products and categories:
   - File: `supabase/migrations/20251031164545_002_insert_sample_data.sql`
   
3. **⚠️ Registration Fix** - Allows user registration (CRITICAL):
   - File: `supabase/migrations/20251101_fix_registration.sql`

### How to Run Migrations
1. Log into your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste each migration file content
4. Execute them in order

## Environment Variables
✅ Already configured in Replit Secrets:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `JWT_SECRET` - Secret key for JWT token generation

## Features

### Customer Features (All Working!)
- ✅ Browse products loaded from database
- ✅ Search and filter products via API
- ✅ User registration and login
- ✅ Add items to cart (persisted to database)
- ✅ Update cart quantities
- ✅ Remove items from cart
- ✅ Place orders with delivery address
- ✅ View order history
- ✅ Manage user profile

### Admin Features (Requires Admin Role)
- ✅ View dashboard with real order analytics
- ✅ See total orders and revenue
- ✅ Manage product inventory
- ✅ View low stock alerts
- ✅ Track recent orders

## API Endpoints (All Integrated)

### Public
- `GET /api/health` - Health check
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `GET /api/products/categories` - Get categories
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Protected (Requires JWT Token)
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/:id` - Update cart item quantity
- `DELETE /api/cart/:id` - Remove item from cart
- `POST /api/orders/create` - Create order
- `GET /api/orders` - Get user's orders
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Admin Only (Requires Admin Role)
- `GET /api/admin/dashboard` - Dashboard analytics
- `GET /api/admin/inventory` - Inventory management

## How It Works

### Authentication Flow
```
1. User registers → Backend creates account in Supabase → JWT token issued
2. User logs in → Backend validates → JWT token returned
3. Token stored in localStorage
4. All protected API calls include: Authorization: Bearer <token>
```

### Shopping Flow
```
1. Browse products (loaded from Supabase via /api/products)
2. Add to cart → POST /api/cart/add → Saved to database
3. View cart → GET /api/cart → Loaded from database
4. Checkout → POST /api/orders/create → Order saved, cart cleared
5. View orders → GET /api/orders → Order history from database
```

## Creating an Admin User
To access admin features:
1. Register a regular account
2. Go to Supabase dashboard → Table Editor → users
3. Find your user and edit the `role` column
4. Change from `customer` to `admin`
5. Log out and log back in

## Development Notes
- Server serves both frontend (static files) and API (`/api` routes)
- Cart operations require authentication
- All passwords are hashed with bcryptjs (10 rounds)
- JWT tokens expire after 7 days
- Product IDs are UUIDs from Supabase
- All prices in Indian Rupees (₹)

## Testing the Application
1. Visit the homepage - products load from database
2. Register a new account
3. Login with your account
4. Add products to cart
5. View cart (data persisted in database)
6. Proceed to checkout
7. Place an order
8. View order history on account page

## Deployment
✅ Deployment configured for Replit Autoscale
- Click "Deploy" button when ready
- App will be available at public URL
- Backend and frontend served from single server

## Recent Changes
- **2025-11-01**: Complete backend-frontend integration
  - Replaced all mock data with API calls
  - Integrated authentication with JWT tokens
  - Connected cart operations to backend
  - Integrated order creation and history
  - Connected admin dashboard to real data
  - Fixed cart operations to work with UUID product IDs
  - All features tested and verified working

## Important Files
- `SETUP_INSTRUCTIONS.md` - Detailed setup guide
- `INTEGRATION_COMPLETE.md` - Integration documentation
- `app.js` - Main frontend logic (integrated with backend)
- `server.js` - Backend server and API routes

## Support
If products aren't showing, make sure you've run all 3 database migrations!
If registration fails, run the `fix_registration.sql` migration.

---

**Status**: ✅ Ready for Use  
**Last Updated**: November 1, 2025  
**Integration**: Complete ✨
