# NovaCart — Discover. Shop. Love.

A full-stack e-commerce web application built with React, Vite, Node.js, Express, and MongoDB.

## Features

- Modern responsive UI with animations, skeletons, empty states and toasts
- JWT authentication with bcrypt password hashing
- Product browsing with search, filters, sorting and pagination
- Product details with gallery, reviews and related products
- Shopping cart (guest + authenticated, merged on login)
- Wishlist
- Multi-step checkout with order creation and stock decrement
- Order history and status tracking
- User profile with addresses
- Admin dashboard: stats, product CRUD, order status management, users

## Tech Stack

Frontend: React 18, Vite, React Router, Axios, react-icons, react-toastify
Backend: Node.js, Express, Mongoose, JWT, bcryptjs, helmet, cors, express-rate-limit
Database: MongoDB

## Folder Structure

```
Final_project/
  backend/
    config/
    controllers/
    middleware/
    models/
    routes/
    scripts/
    utils/
    server.js
  frontend/
    src/
      assets/
      components/
      context/
      hooks/
      pages/
      services/
      styles/
      utils/
      App.jsx
      main.jsx
```

## Prerequisites

- Node.js 18+ and npm
- MongoDB Community Server running locally (default port 27017)

Install MongoDB on Windows:
1. Download from https://www.mongodb.com/try/download/community
2. Install with default settings (runs as a service on port 27017).
3. Verify: `mongosh` (optional) or check Services for "MongoDB".

## Installation

### Backend

```powershell
cd "C:\Users\Nitish masa\OneDrive\Desktop\Final_project\backend"
npm install
Copy-Item .env.example .env
```

Edit `backend/.env` if needed (defaults work for local Mongo).

### Frontend

```powershell
cd "C:\Users\Nitish masa\OneDrive\Desktop\Final_project\frontend"
npm install
Copy-Item .env.example .env
```

## Seed Database

```powershell
cd "C:\Users\Nitish masa\OneDrive\Desktop\Final_project\backend"
npm run seed
```

This inserts 30+ products and creates:
- Admin: `admin@novacart.com` / `Admin@123`
- User: `user@novacart.com` / `User@123`

## Run the Application

### Option A — With a local MongoDB (recommended, data persists)

Backend (terminal 1):

```powershell
cd "C:\Users\Nitish masa\OneDrive\Desktop\Final_project\backend"
npm run dev
```

### Option B — Without installing MongoDB (in-memory, data resets on restart)

Backend (terminal 1):

```powershell
cd "C:\Users\Nitish masa\OneDrive\Desktop\Final_project\backend"
npm run dev:memory
```

Frontend (terminal 2):

```powershell
cd "C:\Users\Nitish masa\OneDrive\Desktop\Final_project\frontend"
npm run dev
```

URLs:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- API: http://localhost:5000/api

## Environment Variables

backend/.env:
```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/novacart
JWT_SECRET=replace_with_a_secure_random_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

frontend/.env:
```
VITE_API_URL=http://localhost:5000/api
```

## API Overview

Auth:
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/profile
- PUT /api/auth/profile

Products:
- GET /api/products (keyword, category, minPrice, maxPrice, rating, inStock, sort, page, limit)
- GET /api/products/:id
- GET /api/products/:id/related
- GET /api/products/categories
- POST /api/products/:id/reviews
- POST /api/products (admin)
- PUT /api/products/:id (admin)
- DELETE /api/products/:id (admin)

Cart:
- GET /api/cart
- POST /api/cart
- PUT /api/cart/:productId
- DELETE /api/cart/:productId
- DELETE /api/cart

Wishlist:
- GET /api/wishlist
- POST /api/wishlist/:productId
- DELETE /api/wishlist/:productId

Orders:
- POST /api/orders
- GET /api/orders/my-orders
- GET /api/orders/:id

Admin:
- GET /api/admin/dashboard
- GET /api/admin/orders
- PUT /api/admin/orders/:id/status
- GET /api/admin/users

## Security

- Passwords hashed with bcrypt
- JWT-based auth
- helmet, cors, express-rate-limit
- Role-based access control for admin routes
- Input validation on backend

## Notes

- Product images are loaded from Unsplash (requires internet).
- Card payments are simulated (no real provider).
- Change admin credentials after first login in production.
-NovaCart - Login feature development
## Development Updates

- Added login feature development.
- Working on NovaCart improvements.