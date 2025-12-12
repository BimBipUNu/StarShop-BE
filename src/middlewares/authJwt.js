const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  let token = req.headers['x-access-token'];

  if (!token && req.headers.authorization) {
    // Header Authorization thường có dạng: "Bearer eyJhbGci..."
    // Chúng ta cần cắt bỏ chữ "Bearer " (7 ký tự đầu) để lấy token
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      token = parts[1];
    }
  }

  if (!token) {
    return res.status(403).send({ message: 'No token provided!' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Unauthorized!' });
    }
    req.user = decoded;
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

module.exports = { verifyToken };
