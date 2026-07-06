/**
 * Global Express error handler.
 * Maps common error types to user-friendly HTTP responses.
 * Must be registered LAST in the middleware chain.
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong. Please try again.';

  // ── Mongoose Validation Error ───────────────────────────────────────────
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const messages = Object.values(err.errors).map((e) => e.message);
    message = messages.join('. ');
  }

  // ── Mongoose Duplicate Key Error ────────────────────────────────────────
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0];
    const fieldName = field
      ? field.charAt(0).toUpperCase() + field.slice(1)
      : 'Value';
    message = `${fieldName} already exists. Please use a different one.`;
  }

  // ── Mongoose Cast Error (invalid ObjectId) ──────────────────────────────
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}.`;
  }

  // ── JWT Errors ──────────────────────────────────────────────────────────
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token.';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Session expired. Please log in again.';
  }

  // ── Multer Errors ───────────────────────────────────────────────────────
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 400;
    message = 'File is too large. Maximum size is 5MB.';
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    statusCode = 400;
    message = 'Unexpected file field. Use the "resume" field name.';
  }

  // ── Log Error (server-side) ─────────────────────────────────────────────
  if (statusCode >= 500) {
    console.error(`[${new Date().toISOString()}] Server Error:`, {
      statusCode,
      message,
      path: req.path,
      method: req.method,
      stack: err.stack,
    });
  }

  // ── Send Response ───────────────────────────────────────────────────────
  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      originalError: err.message,
    }),
  });
};

module.exports = errorHandler;