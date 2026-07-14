const express = require('express');
const router = express.Router();
const {
  signupSeller,
  loginSeller,
  getSellerProfile,
  addBook,
  updateBook,
  deleteBook,
  getSellerBooks,
  getSellerOrders,
  updateOrderStatus
} = require('../controllers/SellerController');
const { protect, sellerOnly } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');

router.post('/signup', signupSeller);
router.post('/login', loginSeller);
router.get('/profile', protect, sellerOnly, getSellerProfile);

// Books CRUD
router.post('/books', protect, sellerOnly, upload.single('itemImage'), addBook);
router.put('/books/:id', protect, sellerOnly, upload.single('itemImage'), updateBook);
router.delete('/books/:id', protect, sellerOnly, deleteBook);
router.get('/books', protect, sellerOnly, getSellerBooks);

// Order management
router.get('/orders', protect, sellerOnly, getSellerOrders);
router.put('/orders/:id/status', protect, sellerOnly, updateOrderStatus);

module.exports = router;
