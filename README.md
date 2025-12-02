# StarShop - Online Shopping Website Backend

This is the backend for the "StarShop" online shopping website, built with NodeJS, Express, and Sequelize (Code First) for MySQL.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
  - [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
  - [Auth](#auth)
  - [Users](#users)
  - [Products](#products)
  - [Orders](#orders)
  - [Stats (Admin Only)](#stats-admin-only)
  - [Swagger UI](#swagger-ui)

## Features

- User authentication (register, login) with JWT.
- Password hashing with Bcrypt.
- Role-based authorization (admin, staff, user).
- CRUD operations for products (admin, staff).
- Order creation and management.
- Admin statistics (total revenue, monthly revenue, top-selling products).

## Technology Stack

- NodeJS
- Express
- Sequelize ORM (MySQL)
- JSON Web Token (JWT)
- Bcrypt
- Express-validator
- Dotenv

## Project Structure

```
/src
  /config           # Sequelize configuration
  /models           # Sequelize models (Code First)
  /migrations       # Database migrations (optional, as we use sync for simplicity)
  /seeders          # Sample data seeders
  /controllers      # Request handlers
  /services         # Business logic
  /routes           # API routes
  /middlewares      # Authentication and authorization middleware
  /utils            # Utility functions (e.g., database sync)
/server.js        # Main application file
/package.json
/package-lock.json
/.env.example
/README.md
```

## Getting Started

### Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js (v14 or higher) installed
- MySQL server running (e.g., XAMPP, Docker, local installation)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd StarShop
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Variables

Create a `.env` file in the project root based on `.env.example` and fill in your database credentials and JWT secret.

Example `.env`:

```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=starshop_db
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1d
```

**Note:** If you don't see `.env.example`, you may need to create it manually with the content above.

### Database Setup

This project uses Sequelize's "Code First" approach to automatically generate and alter the database schema based on your models.

1.  **Create an empty MySQL database** named `starshop_db` (or whatever you configured `DB_NAME` to be) in your MySQL server.

2.  To synchronize the database and run seeders, add the following scripts to your `package.json`:

    ```json
    "scripts": {
      "start": "node server.js",
      "db:sync": "node src/utils/sync.js",
      "db:seed": "npx sequelize-cli db:seed:all",
      "db:migrate": "npx sequelize-cli db:migrate"
    }
    ```

    **Note:** Ensure that `sequelize-cli` is globally or locally installed. If not, run `npm install -g sequelize-cli` or `npm install sequelize-cli`.

3.  Run the database synchronization and seeding:
    ```bash
    npm run db:sync
    npm run db:seed
    ```

### Running the Application

To start the Express server:

```bash
npm start
```

The server will run on `http://localhost:3000` (or the `PORT` you configured).

## API Endpoints

All API endpoints are prefixed with `/api`.

### 🔐 AUTH

-   `POST /api/auth/register`
    -   Registers a new user.
    -   Request Body: `{ name, email, password }`
    -   Default `role` is "user".
-   `POST /api/auth/login`
    -   Logs in a user and returns a JWT token.
    -   Request Body: `{ email, password }`

### 👤 USERS (Requires JWT)

-   `GET /api/users` (Admin Only)
    -   Get all users.
-   `GET /api/users/:id`
    -   Get user by ID.
-   `PUT /api/users/:id`
    -   Update user information. Users can only update their own profile unless they are an admin.
    -   Request Body: `{ name?, email?, password?, phone?, address? }`
-   `DELETE /api/users/:id` (Admin Only)
    -   Delete a user.

### 🛒 PRODUCTS (Requires JWT for CRUD, public for GET)

-   `GET /api/products`
    -   Get all products. Supports search by `name`, `category`, `minPrice`, `maxPrice` as query parameters.
    -   Example: `/api/products?name=abc&category=phone&minPrice=100&maxPrice=500`
-   `GET /api/products/:id`
    -   Get product by ID.
-   `POST /api/products` (Admin, Staff Only)
    -   Create a new product.
    -   Request Body: `{ name, description?, category, price, imageUrl?, stock }`
-   `PUT /api/products/:id` (Admin, Staff Only)
    -   Update product information.
    -   Request Body: `{ name?, description?, category?, price?, imageUrl?, stock? }`
-   `DELETE /api/products/:id` (Admin, Staff Only)
    -   Delete a product.

### 📦 ORDERS (Requires JWT)

-   `POST /api/orders` (User Only)
    -   Create a new order based on cart items.
    -   Request Body: `[{ productId, quantity }]`
-   `GET /api/orders` (User Only)
    -   Get orders for the authenticated user.
-   `GET /api/orders/all` (Admin Only)
    -   Get all orders.
-   `PUT /api/orders/:id/approve` (Admin, Staff Only)
    -   Approve an order.
-   `PUT /api/orders/:id/cancel` (Admin, Staff Only)
    -   Cancel an order.

### 📊 STATS (Admin Only, Requires JWT)

-   `GET /api/stats/revenue`
    -   Get total revenue from approved orders.
-   `GET /api/stats/revenue/monthly`
    -   Get monthly revenue from approved orders.
-   `GET /api/stats/products/top-selling`
    -   Get top-selling products. Optional query parameter `limit` (default is 5).

### 📖 Swagger UI

Access the API documentation through Swagger UI at:

```
http://localhost:3000/api-docs
```
