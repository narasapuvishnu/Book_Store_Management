const Seller = require('../models/Seller');
const Book = require('../models/Book');
const MyOrder = require('../models/MyOrder');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Signup Seller
const signupSeller = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const sellerExists = await Seller.findOne({ email });
    if (sellerExists) {
      return res.status(400).json({ message: 'Seller already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newSeller = await Seller.create({
      name,
      email,
      password: hashedPassword,
      isApproved: false // Requires Admin approval
    });

    res.status(201).json({
      _id: newSeller._id,
      name: newSeller.name,
      email: newSeller.email,
      role: 'seller',
      isApproved: false,
      message: 'Signup successful! Registration is pending Admin approval.'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login Seller
const loginSeller = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const seller = await Seller.findOne({ email });
    if (!seller) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!seller.isApproved) {
      return res.status(403).json({
        message: 'Your account is pending Admin approval. You cannot log in yet.',
        isApproved: false
      });
    }

    res.json({
      _id: seller._id,
      name: seller.name,
      email: seller.email,
      role: 'seller',
      isApproved: true,
      token: generateToken(seller._id, 'seller')
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Seller Profile
const getSellerProfile = async (req, res) => {
  try {
    const seller = await Seller.findById(req.user.id).select('-password');
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }
    res.json(seller);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add Book
const addBook = async (req, res) => {
  try {
    const { title, author, genre, description, price, stock } = req.body;

    if (!title || !author || !genre || !description || !price || !stock) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Book cover image is required' });
    }

    const itemImage = req.file.filename;

    const book = await Book.create({
      title,
      author,
      genre,
      description,
      price: Number(price),
      stock: Number(stock),
      itemImage,
      sellerId: req.user.id,
      sellerName: req.sellerUser.name,
      availability: Number(stock) > 0
    });

    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Book
const updateBook = async (req, res) => {
  try {
    const { title, author, genre, description, price, stock } = req.body;
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Verify ownership
    if (book.sellerId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Access denied: You do not own this book' });
    }

    book.title = title || book.title;
    book.author = author || book.author;
    book.genre = genre || book.genre;
    book.description = description || book.description;
    book.price = price !== undefined ? Number(price) : book.price;
    book.stock = stock !== undefined ? Number(stock) : book.stock;
    book.availability = book.stock > 0;

    if (req.file) {
      book.itemImage = req.file.filename;
    }

    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Book
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Verify ownership
    if (book.sellerId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Access denied: You do not own this book' });
    }

    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Seller's Own Books
const getSellerBooks = async (req, res) => {
  try {
    const books = await Book.find({ sellerId: req.user.id }).sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// View Orders for Seller
const getSellerOrders = async (req, res) => {
  try {
    const orders = await MyOrder.find({ 'seller.sellerId': req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Order Status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const order = await MyOrder.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify seller is authorized
    if (order.seller.sellerId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    order.order.Delivery = status;
    await order.save();

    res.json({ message: 'Order status updated successfully', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  signupSeller,
  loginSeller,
  getSellerProfile,
  addBook,
  updateBook,
  deleteBook,
  getSellerBooks,
  getSellerOrders,
  updateOrderStatus
};
