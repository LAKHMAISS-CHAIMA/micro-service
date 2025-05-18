const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: "Validation failed", errors: err.errors });
  }

  res.status(500).json({ message: "Something went wrong", error: err.message });
};

module.exports = errorHandler;
