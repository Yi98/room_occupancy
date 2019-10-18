const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    let token;

    if (req.headers.cookie) {
      token = req.headers.cookie.split('=')[1];
    } else {
      token = req.headers.authorization.split(' ')[1];
    }

    // const decoded = jwt.verify(token, process.env.JWT_KEY);
    const decoded = jwt.verify(token, 'fyp_room');

    req.userData = { userId: decoded.userId, role: decoded.role };
    next();
  }
  catch(err) {
    res.status(401).json({
      message: 'Please log in to continue'
    });
  }
};