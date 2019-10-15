const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    if (decoded.role != 'manager') {
      return res.status(401).json({
        message: 'Only manager can perform these actions'
      })
    };
    req.userData = { userId: decoded.userId, role: decoded.role };
    next();
  }
  catch(err) {
    res.status(401).json({
      message: 'Please log in to continue'
    });
  }
};