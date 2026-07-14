const express = require('express');
const router = express.Router();
const {
  signupAdmin,
  loginAdmin,
  getDashboardStats,
  getAllUsers,
  deleteUser,
  getAllSellers,
  approveSeller,
  deleteSeller,
  getAllBooks,
  deleteBookByAdmin
} = require('../controllers/AdminController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

router.post('/signup', signupAdmin);
router.post('/login', loginAdmin);

// Protected admin routes
router.get('/stats', protect, adminOnly, getDashboardStats);

// Users management
router.get('/users', protect, adminOnly, getAllUsers);
router.delete('/users/:id', protect, adminOnly, deleteUser);

// Sellers management
router.get('/sellers', protect, adminOnly, getAllSellers);
router.put('/sellers/:id/approve', protect, adminOnly, approveSeller);
router.delete('/sellers/:id', protect, adminOnly, deleteSeller);

// Books management
router.get('/books', protect, adminOnly, getAllBooks);
router.delete('/books/:id', protect, adminOnly, deleteBookByAdmin);

module.exports = router;
