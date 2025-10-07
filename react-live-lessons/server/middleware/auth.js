const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    // Verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) {
      return res.status(401).json({ message: 'Token verification failed, access denied' });
    }

    // Add user id to request
    req.user = verified.id;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token, access denied' });
  }
};