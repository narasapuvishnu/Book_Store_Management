import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Shared Layout Components
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Home from './Components/Home';

// User Views
import Login from './User/Login';
import Signup from './User/Signup';
import Uhome from './User/Uhome';
import Products from './User/Products';
import Uitem from './User/Uitem';
import MyOrders from './User/MyOrders';
import OrderItem from './User/OrderItem';
import Cart from './User/Cart';

// Seller Views
import Slogin from './Seller/Slogin';
import Ssignup from './Seller/Ssignup';
import Shome from './Seller/Shome';
import Addbook from './Seller/Addbook';
import Book from './Seller/Book';
import MyProducts from './Seller/MyProducts';
import Orders from './Seller/Orders';

// Admin Views
import Alogin from './Admin/Alogin';
import Asignup from './Admin/Asignup';
import Ahome from './Admin/Ahome';
import Users from './Admin/Users';
import Seller from './Admin/Seller';
import Items from './Admin/Items';

const App = () => {
  // Session Authentication state
  const [auth, setAuth] = useState(() => {
    const savedAuth = localStorage.getItem('bookstore_auth');
    return savedAuth ? JSON.parse(savedAuth) : null;
  });

  // Shopping Cart state
  const [cart, setCart] = useState(() => {
    if (auth && auth.role === 'user') {
      const savedCart = localStorage.getItem(`cart_${auth._id}`);
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });

  // Keep cart aligned if auth changes
  useEffect(() => {
    if (auth && auth.role === 'user') {
      const savedCart = localStorage.getItem(`cart_${auth._id}`);
      setCart(savedCart ? JSON.parse(savedCart) : []);
    } else {
      setCart([]);
    }
  }, [auth]);

  const login = (userData) => {
    setAuth(userData);
    localStorage.setItem('bookstore_auth', JSON.stringify(userData));
  };

  const logout = () => {
    setAuth(null);
    localStorage.removeItem('bookstore_auth');
  };

  // Cart operations
  const addToCart = (book) => {
    if (!auth) return;
    const existingIndex = cart.findIndex(item => item._id === book._id);
    let updated;
    if (existingIndex >= 0) {
      updated = [...cart];
      updated[existingIndex].quantity += 1;
    } else {
      updated = [...cart, { ...book, quantity: 1 }];
    }
    setCart(updated);
    localStorage.setItem(`cart_${auth._id}`, JSON.stringify(updated));
  };

  const updateQuantity = (bookId, newQty) => {
    if (!auth) return;
    let updated;
    if (newQty <= 0) {
      updated = cart.filter(item => item._id !== bookId);
    } else {
      updated = cart.map(item => item._id === bookId ? { ...item, quantity: newQty } : item);
    }
    setCart(updated);
    localStorage.setItem(`cart_${auth._id}`, JSON.stringify(updated));
  };

  const removeFromCart = (bookId) => {
    if (!auth) return;
    const updated = cart.filter(item => item._id !== bookId);
    setCart(updated);
    localStorage.setItem(`cart_${auth._id}`, JSON.stringify(updated));
  };

  const clearCart = () => {
    if (!auth) return;
    setCart([]);
    localStorage.removeItem(`cart_${auth._id}`);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Auth Guards
  const UserGuard = ({ children }) => {
    if (!auth || auth.role !== 'user') {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  const SellerGuard = ({ children }) => {
    if (!auth || auth.role !== 'seller') {
      return <Navigate to="/seller/login" replace />;
    }
    return children;
  };

  const AdminGuard = ({ children }) => {
    if (!auth || auth.role !== 'admin') {
      return <Navigate to="/admin/login" replace />;
    }
    return children;
  };

  return (
    <Router>
      <div className="app-container">
        <Navbar auth={auth} logout={logout} cartCount={cartCount} />
        
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<Uitem auth={auth} addToCart={addToCart} />} />
            
            {/* User Auth */}
            <Route path="/login" element={auth ? <Navigate to="/" replace /> : <Login login={login} />} />
            <Route path="/signup" element={auth ? <Navigate to="/" replace /> : <Signup login={login} />} />
            
            {/* Seller Auth */}
            <Route path="/seller/login" element={auth ? <Navigate to="/seller/dashboard" replace /> : <Slogin login={login} />} />
            <Route path="/seller/signup" element={auth ? <Navigate to="/seller/dashboard" replace /> : <Ssignup />} />

            {/* Admin Auth */}
            <Route path="/admin/login" element={auth ? <Navigate to="/admin/dashboard" replace /> : <Alogin login={login} />} />
            <Route path="/admin/signup" element={auth ? <Navigate to="/admin/dashboard" replace /> : <Asignup login={login} />} />

            {/* Protected User Routes */}
            <Route path="/user/dashboard" element={<UserGuard><Uhome auth={auth} /></UserGuard>} />
            <Route path="/user/orders" element={<UserGuard><MyOrders auth={auth} /></UserGuard>} />
            <Route path="/user/orders/:id" element={<UserGuard><OrderItem auth={auth} /></UserGuard>} />
            <Route path="/cart" element={
              <UserGuard>
                <Cart
                  auth={auth}
                  cart={cart}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                  clearCart={clearCart}
                />
              </UserGuard>
            } />

            {/* Protected Seller Routes */}
            <Route path="/seller/dashboard" element={<SellerGuard><Shome auth={auth} /></SellerGuard>} />
            <Route path="/seller/products" element={<SellerGuard><MyProducts auth={auth} /></SellerGuard>} />
            <Route path="/seller/add-book" element={<SellerGuard><Addbook auth={auth} /></SellerGuard>} />
            <Route path="/seller/edit-book/:id" element={<SellerGuard><Book auth={auth} /></SellerGuard>} />
            <Route path="/seller/orders" element={<SellerGuard><Orders auth={auth} /></SellerGuard>} />

            {/* Protected Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminGuard><Ahome auth={auth} /></AdminGuard>} />
            <Route path="/admin/users" element={<AdminGuard><Users auth={auth} /></AdminGuard>} />
            <Route path="/admin/sellers" element={<AdminGuard><Seller auth={auth} /></AdminGuard>} />
            <Route path="/admin/books" element={<AdminGuard><Items auth={auth} /></AdminGuard>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
};

export default App;
