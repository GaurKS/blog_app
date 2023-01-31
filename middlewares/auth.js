const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      status: 403,
      message: "A token is required for authentication"
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded._id,
      email: decoded.email
    };
  } catch (err) {
    console.log("err :", err);
    return res.status(401).send({
      status: 401,
      message: "Invalid Token"
    });
  }
  return next();
};
