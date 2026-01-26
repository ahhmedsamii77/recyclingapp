function globalErrorHandler(error, req, res, next) {
  return res.status(error.statusCode || 500).json({ 
    message: error.message, 
  });
}

export { globalErrorHandler,
 };
