const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
  //   let token;
  //   let isToken = false;

  //   if (req.headers.cookie) {
  //     tokens = req.headers.cookie.split(';');
  //     for (let i=0; i<tokens.length; i++) {
  //       info = tokens[i].split("=");
  //       for (let j=0; j<info.length; j++) {
  //         if (info[j] == "token") {
  //           token = info[j+1];
  //           token = token.trim();
  //           isToken = true;
  //           break;
  //         }
  //       }
  //     }
  //   }
  //   else {
  //     isToken = false;
  //   }
    

  //   if (isToken) {
  //     const decoded = jwt.verify(token, 'fyp_room');
  //     req.userData = { userId: decoded.userId, role: decoded.role };
  //     next();
  //   }
  //   else {
  //     throw new Error();
  //   }

    next();

  }
  catch(err) {
    res.status(401).json({
      message: 'Please log in to continue'
    });
  }
};