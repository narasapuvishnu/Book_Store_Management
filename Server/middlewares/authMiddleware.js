const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Seller = require('../models/Seller');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.user = decoded; // { id, role }

      if (decoded.role === 'admin') {
        req.adminUser = await Admin.findById(decoded.id).select('-password');
        if (!req.adminUser) {
          return res.status(401).json({ message: 'Admin user not found' });
        }
      } else if (decoded.role === 'seller') {
        req.sellerUser = await Seller.findById(decoded.id).select('-password');
        if (!req.sellerUser) {
          return res.status(401).json({ message: 'Seller not found' });
        }
        // Check if approved
        if (!req.sellerUser.isApproved) {
          return res.status(403).json({ message: 'Seller profile is pending Admin approval' });
        }
      } else if (decoded.role === 'user') {
        req.clientUser = await User.findById(decoded.id).select('-password');
        if (!req.clientUser) {
          return res.status(401).json({ message: 'User not found' });
        }
      } else {
        return res.status(401).json({ message: 'Invalid token role' });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token verification failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admin role required' });
  }
};

const sellerOnly = (req, res, next) => {
  if (req.user && req.user.role === 'seller') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Seller role required' });
  }
};

const userOnly = (req, res, next) => {
  if (req.user && req.user.role === 'user') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: User role required' });
  }
};

module.exports = { protect, adminOnly, sellerOnly, userOnly };
