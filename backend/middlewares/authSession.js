const jwt = require("jsonwebtoken");

const authSession = (req, res, next) => {
  if (!req.session.token) {
    return res.status(401).json({ message: "No session found" });
  }

  jwt.verify(req.session.token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired session" });
    }

    req.userId = decoded.UserInfo.id;
    next();
  });
};

module.exports = authSession;
