const jwt = require("jsonwebtoken");

// Middleware to verify JWT token
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if authorization header exists
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        msg: "Access denied. Please login to continue.",
      });
    }

    // Check if it's a Bearer token
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        msg: "Invalid authorization format. Use 'Bearer <token>'",
      });
    }

    const token = authHeader.split(" ")[1];

    // Check if token is empty
    if (!token || token === "null" || token === "undefined") {
      return res.status(401).json({
        success: false,
        msg: "Access denied. Please login to continue.",
      });
    }

    // Check if JWT_SECRET is configured
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not configured");
      return res.status(500).json({
        success: false,
        msg: "Server configuration error. Please contact administrator.",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Validate decoded token has required fields
    if (!decoded.id || !decoded.email) {
      return res.status(401).json({
        success: false,
        msg: "Invalid token structure. Please login again.",
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        msg: "Your session has expired. Please login again.",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        msg: "Invalid token. Please login again.",
      });
    }

    if (error.name === "NotBeforeError") {
      return res.status(401).json({
        success: false,
        msg: "Token not yet active. Please try again later.",
      });
    }

    return res.status(401).json({
      success: false,
      msg: "Authentication failed. Please login again.",
    });
  }
};

// Middleware to check for specific roles
const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        msg: "Access denied. Please login to continue.",
      });
    }

    // Check if user has a role
    if (!req.user.role) {
      return res.status(403).json({
        success: false,
        msg: "Access denied. User role not found.",
      });
    }

    // Check if user's role is allowed
    if (!allowedRoles.includes(req.user.role)) {
      const rolesText = allowedRoles.join(" or ");
      return res.status(403).json({
        success: false,
        msg: `Access denied. This action requires ${rolesText} privileges.`,
      });
    }

    next();
  };
};

module.exports = { authMiddleware, roleMiddleware };

