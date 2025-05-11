const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit to 100 requests per 15 minutes
  message: "Too many requests from this IP, please try again later",
});

const organLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 50, // Limit to 50 requests per 10 minutes
  message: "Too many requests, please try again later",
});

const bloodLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // Limit to 100 requests per 10 minutes
  message: "Too many requests, please try again later",
});

module.exports = { apiLimiter, organLimiter, bloodLimiter };
