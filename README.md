# 📚 BookStore Management System

A modern, full-stack Book Store Marketplace and Management Web Application built with the **MERN Stack** (MongoDB, Express, React, Node.js) and bundled via **Vite**.

The application provides a complete multi-role ecosystem where **Customers** discover, review, and buy literature; **Verified Merchants** list books, update stock dynamically, and fulfill orders; and **Platform Administrators** oversee operations, users, and catalog listings.

---

## ✨ Key Features & Capabilities

### 🎨 Modern Aurora Glassmorphism UI
- **Obsidian & Aurora Palette**: Styled with curated gradients, ambient lighting effects, and frosted glass containers (`backdrop-filter: blur(16px)`).
- **Typography & Motion**: Powered by **Space Grotesk** and **Plus Jakarta Sans** with micro-animations, 3D floating hero spotlight cards, and image hover-zoom effects.
- **Responsive Layout**: Designed for seamless browsing across desktops, tablets, and smartphones.

### 👤 Customer Experience
- **Authentication**: Secure Signup & Sign In powered by JWT tokens and bcrypt encryption.
- **Smart Catalog Browsing**:
  - Filter books across genres (Fiction, Non-Fiction, Science, Romance, Fantasy, Biography, History, Children).
  - Search by title, author, or keyword.
  - Price range sliders and multi-criteria sorting (Popularity, Latest, Price Low-to-High, Price High-to-Low).
- **Customer Reviews & Feedback**:
  - Interactive star ratings (1 to 5 stars).
  - Detailed reader review testimonials with author badges and review counts.
- **Shopping Cart & Checkout**:
  - Real-time cart badge counter.
  - Quantity adjustments, dynamic subtotal calculations, and shipping address checkout.
- **Personal Wishlist & Order Tracking**:
  - Save books to wishlist for future purchases.
  - Track order progression (Pending → Shipped → Delivered) with visual step trackers.

### 🏪 Merchant / Seller Portal
- **Seller Authentication**: Merchant registration with built-in Admin verification workflows.
- **Demo Auto-Fill Access**: One-click quick login for testing (`seller@bookstore.com` / `seller123`).
- **Real-Time Dynamic Stock Controls**:
  - Inline `+` and `-` buttons on inventory cards to update book stock instantly in the database.
- **Catalog Listings Management**:
  - Add new book titles with image uploads (handled by Multer).
  - Edit prices, stock quantity, synopsis, genre, and metadata.
  - Delete obsolete listings.
- **Merchant Orders Board**:
  - View real-time orders placed by customers and update delivery status.

### ⚡ Platform Administrator Panel
- **Dashboard Overview**: Metrics tracking total platform revenue, registered users, approved merchants, and catalog count.
- **User Management**: Inspect and manage registered buyers.
- **Seller Approval System**: Approve or reject newly registered merchant accounts.
- **Global Catalog Moderation**: Supervise all listed books and remove non-compliant listings.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, React Router v7, Axios, Vite, Vanilla CSS3 (Custom Design System) |
| **Backend** | Node.js, Express.js, RESTful APIs |
| **Database** | MongoDB, Mongoose ODM |
| **Authentication** | JSON Web Tokens (JWT), Bcrypt password hashing |
| **File Handling** | Multer (Multipart book cover image storage) |
| **Development** | Concurrently, Nodemon |

---

## 🚀 Getting Started

Follow the instructions below to run the project locally on your machine.

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally, or a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) URI

### 1. Clone the Repository
```bash
git clone https://github.com/narasapuvishnu/Book_Store_Management.git
cd Book_Store_Management
```

### 2. Install Dependencies
Install dependencies for the root orchestrator, backend server, and frontend client:
```bash
# Root dependencies
npm install

# Backend dependencies
npm install --prefix Server

# Frontend dependencies
npm install --prefix Client
```

### 3. Configure Server Environment Variables
Ensure a `.env` file exists inside the `Server/` folder:
```env
PORT=8000
MONGO_URI=mongodb://127.0.0.1:27017/BookStore
JWT_SECRET=super_secure_jwt_secret_token_12345
```

### 4. Seed Curated Books (Optional but Recommended)
Populate the database with 18 curated bestselling titles across all genres with covers, reviews, and stock:
```bash
npm run seed
```

### 5. Start the Application
Run both the Express API and Vite React frontend concurrently with a single command:
```bash
npm run dev
```

- **Frontend Client**: [http://localhost:5173](http://localhost:5173)
- **Backend API Server**: [http://localhost:8000](http://localhost:8000)

---

## 🔑 Pre-Configured Demo Credentials

For quick evaluation, you can log in directly using the credentials below:

| Role | Email | Password | Access Portal |
|---|---|---|---|
| **Seller / Merchant** | `seller@bookstore.com` | `seller123` | [Seller Portal](http://localhost:5173/seller/login) *(has Auto Fill)* |
| **Customer / Buyer** | `vamshi6218@gmail.com` | *(your password)* | [User Sign In](http://localhost:5173/login) |

---

## 📁 Project Architecture

```
Book_Store_Management/
├── Client/                     # React + Vite Frontend
│   ├── src/
│   │   ├── Admin/              # Admin dashboard, users, sellers & books management
│   │   ├── Components/         # Navigation, Hero Home, Footer
│   │   ├── Seller/             # Merchant inventory, book editing, order processing
│   │   ├── User/               # Catalog, product details, reviews, cart, orders
│   │   ├── App.jsx             # Route definitions and auth state guards
│   │   └── index.css           # Custom Aurora Glassmorphism design system
│   ├── package.json
│   └── vite.config.js
│
├── Server/                     # Node.js + Express Backend
│   ├── config/                 # Database connection logic
│   ├── controllers/            # Admin, Seller, and User controllers
│   ├── middlewares/            # JWT auth guard & Multer image upload
│   ├── models/                 # Mongoose schemas (Book, Seller, User, MyOrder, Admin)
│   ├── routes/                 # Express API routes
│   ├── uploads/                # Book cover image storage directory
│   ├── seedBooks.js            # Automated catalog & reviews seeder
│   ├── setupSeller.js          # Demo seller account provisioner
│   └── server.js               # Express application entrypoint
│
├── package.json                # Root concurrent scripts
└── README.md
```

---

## 📜 License
This project is open-source and available under the [MIT License](LICENSE).
