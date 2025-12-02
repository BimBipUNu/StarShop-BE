const authorizeRoles = (allowedRoles) => (req, res, next) => {
  if (!req.userRole) {
    return res.status(401).send({ message: 'Unauthorized! User role not found.' });
  }

  if (!allowedRoles.includes(req.userRole)) {
    return res.status(403).send({ message: 'Forbidden! You do not have the necessary role.' });
  }

  next();
};

module.exports = authorizeRoles;
