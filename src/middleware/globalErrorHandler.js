function globalErrorHandler(error, req, res, next) {
  return res.status(error.statusCode || 500).json({ 
    message: error.message, 
    stack: process.env.NODE_ENV === "development" ? error.stack : null
  });
}

export { globalErrorHandler,
 };
