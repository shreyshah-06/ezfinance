module.exports = (req, res, next) => {
  const apiKey = req.header("x-api-key"); // Get the API key from the header

  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(403).json({ error: "Forbidden: Invalid API Key" });
  }

  next(); // If valid, continue to the next middleware or route handler
};