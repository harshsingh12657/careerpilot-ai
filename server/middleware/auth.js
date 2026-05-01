const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;
    
    console.log('Auth header:', req.headers.authorization);
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    console.log('Token received:', token.substring(0, 20) + '...');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded:', decoded);
    
    req.user = await User.findById(decoded.id).select('-password');
    console.log('User found:', req.user?._id);
    
    return next();
  } catch (error) {
    console.error('Auth error:', error.message);
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = { protect };