# 🛍️ Gaura — Backend REST API (Node.js + Express + MySQL)

## 📦 Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MySQL2 |
| Sessions | express-session |
| Cross-origin | cors |
| Environment | dotenv |

---

## ⚙️ Project Setup

```bash
mkdir backend && cd backend
npm init -y
npm install express mysql2 express-session cors dotenv
```

### Folder Structure

```
/backend
  /routes
    products.js
    cart.js
    orders.js
    admin.js
    auth.js
  /controllers
    productsController.js
    cartController.js
    ordersController.js
    adminController.js
  /middleware
    authMiddleware.js
  db.js
  server.js
  .env
```

### .env File

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=gaura_db
SESSION_SECRET=gaura_secret_key
PORT=3000
```

---

## 🗄️ Database Tables Required

Make sure these tables exist in your MySQL database before starting.

- `users` — registered customers
- `products` — saree listings
- `orders` — placed orders
- `order_items` — items inside each order
- `admin` — admin login credentials
- `reviews` — product reviews (optional/bonus)

---

## 🔗 All API Endpoints

### 🛒 Products

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get single product by ID |
| GET | `/api/products?sort=price_asc` | Get products sorted by price |
| GET | `/api/products?search=katan` | Search products by name |

**Business Logic to include:**
- Apply 25% discount on all prices before sending response
- Formula: `discounted_price = original_price * 0.75`

---

### 🛍️ Cart (Session Based)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/cart` | View current cart |
| POST | `/api/cart` | Add item to cart |
| PUT | `/api/cart/:productId` | Update item quantity |
| DELETE | `/api/cart/:productId` | Remove item from cart |
| DELETE | `/api/cart` | Clear entire cart |

**Cart Item Body (POST):**
```json
{
  "productId": 3,
  "quantity": 1
}
```

**Business Logic:**
- Cart is stored in server session (not database)
- Calculate total with discounted prices
- No login required to use cart

---

### 📦 Orders

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/orders` | Place a new order |
| GET | `/api/orders/:id` | Get order details by ID |

**Order Body (POST):**
```json
{
  "name": "Priya Sharma",
  "email": "priya@email.com",
  "phone": "9876543210",
  "address": "123 Main Street",
  "city": "Mumbai",
  "pincode": "400001",
  "cart": [
    { "productId": 3, "quantity": 1 }
  ]
}
```

**Business Logic:**
- If pincode starts with `400` → shipping = ₹0 (Mumbai free shipping)
- Else → shipping = ₹199
- International orders → shipping = ₹999
- Save order to `orders` table
- Save each cart item to `order_items` table
- Clear session cart after order is placed

---

### 🔐 Auth (User)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |
| GET | `/api/auth/me` | Get logged in user info |

**Register Body:**
```json
{
  "name": "Priya Sharma",
  "email": "priya@email.com",
  "password": "password123"
}
```

**Login Body:**
```json
{
  "email": "priya@email.com",
  "password": "password123"
}
```

> ⚠️ Note: User auth is bonus. Focus on cart + orders + admin first.

---

### 🔧 Admin

> All admin routes require admin to be logged in (check session in middleware)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/admin/login` | Admin login |
| POST | `/api/admin/logout` | Admin logout |
| GET | `/api/admin/products` | View all products |
| POST | `/api/admin/products` | Add new product |
| PUT | `/api/admin/products/:id` | Edit product |
| DELETE | `/api/admin/products/:id` | Delete product |
| GET | `/api/admin/orders` | View all orders |
| GET | `/api/admin/orders/:id` | View single order details |

**Add Product Body (POST):**
```json
{
  "name": "Banarasi Katan Silk Saree",
  "description": "Pure handwoven silk saree",
  "price": 18000,
  "stock": 5,
  "image_url": "saree1.jpg",
  "category": "katan"
}
```

---

## 🔒 Middleware

### Admin Auth Middleware (`/middleware/authMiddleware.js`)

Protects all `/api/admin/*` routes (except login). Checks if admin session exists.

```js
// If no admin session → return 401 Unauthorized
// If session exists → allow request to proceed
```

---

## 💡 Business Logic Summary

| Rule | Logic |
|---|---|
| Discount | `discounted_price = original_price * 0.75` |
| Mumbai Free Shipping | `pincode.startsWith("400")` → shipping = ₹0 |
| Domestic Shipping | Other Indian pincodes → shipping = ₹199 |
| International Shipping | Non-India → shipping = ₹999 |
| Cart Storage | Stored in express-session (no DB needed) |
| Admin Access | Session-based, protected by middleware |

---

## 📋 Build Priority Order

Build in this order — each step is usable for demo even if next steps are incomplete.

```
Step 1 → db.js + server.js + basic Express setup
Step 2 → GET /api/products (fetch all products from DB)
Step 3 → Session cart (POST, GET, DELETE /api/cart)
Step 4 → POST /api/orders (place order, save to DB)
Step 5 → POST /api/admin/login + admin middleware
Step 6 → Admin product CRUD (add/edit/delete)
Step 7 → GET /api/admin/orders (view orders)
Step 8 → Search + Sort for products (bonus)
Step 9 → User register/login (bonus)
```

---

## 🧪 Testing Your API

Use **Postman** or **Thunder Client** (VS Code extension) to test all routes before frontend connects.

**Quick test sequence:**
1. GET `/api/products` → should return product list
2. POST `/api/cart` with a productId → should add to session cart
3. GET `/api/cart` → should show cart contents
4. POST `/api/orders` with full details → should save order to DB
5. POST `/api/admin/login` → should set admin session
6. POST `/api/admin/products` → should add a product (needs admin session)

---

## 🚀 Run the Server

```bash
node server.js
# or for auto-restart on file changes:
npx nodemon server.js
```

Server runs at: `http://localhost:3000`

---

## 📌 For Examiner — Key Points to Explain

- REST API separates frontend and backend concerns cleanly
- Sessions manage cart without requiring user login
- Shipping logic is handled server-side to prevent tampering
- Discount calculation is centralized in the backend
- Admin routes are protected by session middleware
- MySQL stores persistent data (products, orders); session stores temporary cart
