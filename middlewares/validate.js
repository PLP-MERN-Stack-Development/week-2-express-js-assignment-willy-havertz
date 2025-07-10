
function validateId(req, res, next) {
  const uuidRegex = /^[0-9a-fA-F\-]{36}$/;
  if (!uuidRegex.test(req.params.id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }
  next();
}

// Validate request body for product create/update
function validateProduct(req, res, next) {
  const { name, description, price, category, inStock } = req.body;
  if (
    typeof name !== "string" ||
    typeof description !== "string" ||
    typeof price !== "number" ||
    typeof category !== "string" ||
    typeof inStock !== "boolean"
  ) {
    return res.status(400).json({
      error:
        "Product must include name(string), description(string), price(number), category(string), inStock(boolean)",
    });
  }
  next();
}

module.exports = { validateId, validateProduct };
