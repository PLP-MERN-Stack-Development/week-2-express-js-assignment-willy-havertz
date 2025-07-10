
const API_KEY = process.env.API_KEY;

module.exports = (req, res, next) => {
  const key = req.header("x-api-key");
  if (!key || key !== API_KEY) {
    return res.status(401).json({ error: "Invalid or missing API key" });
  }
  next();
};
