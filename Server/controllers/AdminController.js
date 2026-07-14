const Admin = require('../models/Admin');
const User = require('../models/User');
const Seller = require('../models/Seller');
const Book = require('../models/Book');
const MyOrder = require('../models/MyOrder');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Signup Admin
const signupAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await Admin.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      _id: newAdmin._id,
      name: newAdmin.name,
      email: newAdmin.email,
      role: 'admin',
      token: generateToken(newAdmin._id, 'admin')
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login Admin
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: 'admin',
      token: generateToken(admin._id, 'admin')
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Dashboard Statistics
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSellers = await Seller.countDocuments();
    const totalBooks = await Book.countDocuments();
    const totalOrders = await MyOrder.countDocuments();

    // Calculate total revenue
    const orders = await MyOrder.find({});
    const totalRevenue = orders.reduce((sum, order) => sum + (order.order.totalamount || 0), 0);

    // Group books by genre for stats/charts
    const genreAggregation = await Book.aggregate([
      { $group: { _id: '$genre', count: { $sum: 1 } } }
    ]);
    const genreStats = genreAggregation.map(g => ({ genre: g._id, count: g.count }));

    // Group orders by delivery status
    const deliveryAggregation = await MyOrder.aggregate([
      { $group: { _id: '$order.Delivery', count: { $sum: 1 } } }
    ]);
    const deliveryStats = deliveryAggregation.map(d => ({ status: d._id, count: d.count }));

    // Recent activities (last 5 orders and last 5 sellers/users)
    const recentOrders = await MyOrder.find({}).sort({ createdAt: -1 }).limit(5);
    const recentSellers = await Seller.find({}).sort({ createdAt: -1 }).limit(5);

    const activities = [];
    recentOrders.forEach(o => {
      activities.push({
        type: 'order',
        message: `New order of $${o.order.totalamount} for "${o.bookDetails.title}" placed by ${o.buyer.userName}`,
        time: o.createdAt
      });
    });
    recentSellers.forEach(s => {
      activities.push({
        type: 'seller',
        message: `New seller application by ${s.name} (${s.email})`,
        time: s.createdAt
      });
    });

    // Sort combined activities by date descending
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));

    res.json({
      stats: {
        totalUsers,
        totalSellers,
        totalBooks,
        totalOrders,
        totalRevenue
      },
      genreStats,
      deliveryStats,
      recentActivities: activities.slice(0, 8)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Manage Users - List & Delete
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Manage Sellers - List, Approve & Delete
const getAllSellers = async (req, res) => {
  try {
    const sellers = await Seller.find({}).select('-password').sort({ createdAt: -1 });
    res.json(sellers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const approveSeller = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }
    seller.isApproved = true;
    await seller.save();
    res.json({ message: 'Seller approved successfully', seller });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteSeller = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }
    await Seller.findByIdAndDelete(req.params.id);
    res.json({ message: 'Seller deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Manage Books - List & Delete
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({}).sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBookByAdmin = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: 'Book deleted successfully by Admin' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
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
};
