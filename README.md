# 📚 Book Store Management System

A full-stack Book Store Management web application built with the MERN stack (MongoDB, Express, React, Node.js). The application offers a complete marketplace where Users can browse and purchase books, Sellers can list and manage their inventories, and Admins can moderate the platform.

### 🌐 Live Demo
The application is deployed and live on Render:
👉 **[Live App Link](https://book-store-management-o2k9.onrender.com)**

---

## 🚀 Features

### 👤 User Panel
* **Account Management**: Signup and login with JWT authentication.
* **Browse Books**: View books, search, and check book details.
* **Cart Management**: Add books to the cart, update quantities, and checkout.
* **Order History**: Track past and current orders.

### 💼 Seller Panel
* **Dashboard**: Track books listed and orders received.
* **Manage Listings**: Add new books (with cover image upload), update book details, and delete listings.
* **Order Processing**: Manage and update the status of orders placed by users.

### 🔑 Admin Panel
* **Dashboard**: Platform overview showing metrics of users, sellers, and books.
* **Moderation**: View and manage all registered Users, Sellers, and Books.
* **Security**: Admin-only route protection.

---

## 🛠️ Technology Stack

* **Frontend**: React, React Router v7, Axios, Vite, Vanilla CSS.
* **Backend**: Node.js, Express.js.
* **Database**: MongoDB (via Mongoose).
* **Security & Authentication**: JWT (JSON Web Tokens), Bcrypt (password hashing).
* **Storage**: Multer (handling file uploads for book covers).

---

## ⚙️ Local Setup Instructions

Follow these steps to run the project locally on your machine:

### 1. Clone the repository
```bash
git clone https://github.com/narasapuvishnu/Book_Store_Management.git
cd Book_Store_Management
```

### 2. Configure Environment Variables
Create a `.env` file inside the `Server` directory:
```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### 3. Install Dependencies & Start
From the project root directory, run the concurrent dev script:
```bash
# Install root packages and run both client and server locally
npm install
npm run dev
```

---

## 📦 Deployment Configuration
* **Render**: Configured to install and build both the client and server concurrently using custom build scripts.
* **Vercel**: Configured via `vercel.json` to host the frontend React app statically (`Client/dist`), ignoring the server-side directories to bypass build environment limitations.
