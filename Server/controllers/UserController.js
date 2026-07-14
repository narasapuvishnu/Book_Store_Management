const User = require('../models/User');
const Book = require('../models/Book');
const MyOrder = require('../models/MyOrder');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Signup User
const signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: 'user',
      token: generateToken(newUser._id, 'user')
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: 'user',
      token: generateToken(user._id, 'user')
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get User Profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Browse, Search & Filter Books
const getBooks = async (req, res) => {
  try {
    const { search, genre, minPrice, maxPrice, sortBy } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { genre: { $regex: search, $options: 'i' } }
      ];
    }

    if (genre && genre !== 'All') {
      query.genre = genre;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let apiQuery = Book.find(query);

    // Sort options
    if (sortBy === 'price-low') {
      apiQuery = apiQuery.sort({ price: 1 });
    } else if (sortBy === 'price-high') {
      apiQuery = apiQuery.sort({ price: -1 });
    } else if (sortBy === 'popularity') {
      apiQuery = apiQuery.sort({ averageRating: -1 });
    } else if (sortBy === 'latest') {
      apiQuery = apiQuery.sort({ createdAt: -1 });
    } else {
      apiQuery = apiQuery.sort({ createdAt: -1 });
    }

    const books = await apiQuery;
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// View Book Details
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Purchase / Checkout Cart
const checkout = async (req, res) => {
  try {
    const { shippingDetails, items } = req.body; // items: [{ bookId, quantity }]
    if (!shippingDetails || !items || items.length === 0) {
      return res.status(400).json({ message: 'Shipping details and cart items are required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Buyer user not found' });
    }

    const createdOrders = [];

    for (const item of items) {
      const book = await Book.findById(item.bookId);
      if (!book) {
        return res.status(404).json({ message: `Book with id ${item.bookId} not found` });
      }

      if (book.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for book "${book.title}"` });
      }

      // Deduct stock
      book.stock -= item.quantity;
      await book.save();

      // Delivery expected date: BookingDate + 5 days
      const expectedDeliveryDate = new Date();
      expectedDeliveryDate.setDate(expectedDeliveryDate.getDate() + 5);

      const orderData = {
        shippingDetails: {
          flatno: shippingDetails.flatno,
          city: shippingDetails.city,
          state: shippingDetails.state,
          pincode: shippingDetails.pincode
        },
        bookDetails: {
          bookId: book._id,
          title: book.title,
          author: book.author,
          genre: book.genre,
          description: book.description,
          itemImage: book.itemImage
        },
        buyer: {
          userId: user._id,
          userName: user.name
        },
        seller: {
          sellerId: book.sellerId,
          sellerName: book.sellerName
        },
        order: {
          totalamount: book.price * item.quantity,
          BookingDate: new Date(),
          Delivery: 'Pending',
          expectedDeliveryDate: expectedDeliveryDate
        }
      };

      const newOrder = await MyOrder.create(orderData);
      createdOrders.push(newOrder);
    }

    res.status(201).json({ message: 'Checkout successful', orders: createdOrders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// View Orders
const getUserOrders = async (req, res) => {
  try {
    const orders = await MyOrder.find({ 'buyer.userId': req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Rate / Review a Book
const rateBook = async (req, res) => {
  try {
    const { bookId, rating, comment } = req.body;
    if (!bookId || !rating || !comment) {
      return res.status(400).json({ message: 'bookId, rating and comment are required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if user already reviewed
    const existingReviewIndex = book.reviews.findIndex(
      (r) => r.userId.toString() === req.user.id.toString()
    );

    if (existingReviewIndex >= 0) {
      // Update review
      book.reviews[existingReviewIndex].rating = Number(rating);
      book.reviews[existingReviewIndex].comment = comment;
      book.reviews[existingReviewIndex].createdAt = new Date();
    } else {
      // Add new review
      book.reviews.push({
        userId: user._id,
        userName: user.name,
        rating: Number(rating),
        comment: comment
      });
    }

    await book.save();
    res.json({ message: 'Review submitted successfully', book });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single order details
const getOrderById = async (req, res) => {
  try {
    const order = await MyOrder.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    // Verify user owns the order or is seller/admin
    if (order.buyer.userId.toString() !== req.user.id.toString() && req.user.role !== 'seller' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  signupUser,
  loginUser,
  getUserProfile,
  getBooks,
  getBookById,
  checkout,
  getUserOrders,
  rateBook,
  getOrderById
};
