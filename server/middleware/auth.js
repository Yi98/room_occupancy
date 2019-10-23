const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    let token;

    if (req.headers.cookie) {
      tokens = req.headers.cookie.split(';');
      for (let i=0; i<tokens.length; i++) {
        info = tokens[i].split("=");
        for (let j=0; j<info.length; j++) {
          console.log(info[j]);
          if (info[j] == "token") {
            console.log("Ehe");
            token = info[j+1];
            console.log(token);
            break;
          }
        }
      }
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