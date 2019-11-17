const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

  let gotToken = false;
  try {
    if (req.headers.cookie) {
      tokens = req.headers.cookie.split(';');
      
      for (let i=0; i<tokens.length; i++) {
        info = tokens[i].split("=");
        for (let j=0; j<info.length; j++) {
          if (info[j].trim() == "token") {
            token = (info[j+1]).trim();
            const decoded = jwt.verify(token, 'fyp_room');
            req.userData = { userId: decoded.userId, role: decoded.role };
            
            gotToken = true;

            // This are to avoid the go back to prevous page 
            res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
            res.header('Expires', '-1');
            res.header('Pragma', 'no-cache');
            
            next();
          }
        }
      }
      if (gotToken == false) {
        throw new Error();
      }
    }

    else {
      throw new Error();
    }
  }
  catch(err) {
    // HERE I NEED TO DIRECT THE USER TO LOGIN PAGE

    res.status(401).json({
      message: 'Please log in to continue'
    });
  }
};