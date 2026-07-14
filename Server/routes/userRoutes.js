const express = require('express');
const router = express.Router();
const {
  signupUser,
  loginUser,
  getUserProfile,
  getBooks,
  getBookById,
  checkout,
  getUserOrders,
  rateBook,
  getOrderById
} = require('../controllers/UserController');
const { protect, userOnly } = require('../middlewares/authMiddleware');

router.post('/signup', signupUser);
router.post('/login', loginUser);
router.get('/profile', protect, userOnly, getUserProfile);

// Public browsing routes
router.get('/books', getBooks);
router.get('/books/:id', getBookById);

// Protected shopping/orders routes
router.post('/orders', protect, userOnly, checkout);
router.get('/orders', protect, userOnly, getUserOrders);
router.get('/orders/:id', protect, getOrderById);
router.post('/rate', protect, userOnly, rateBook);

module.exports = router;
