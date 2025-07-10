// routes/products.js
const express = require("express");
const { v4: uuidv4 } = require("uuid");
const auth = require("../middleware/auth");
const { validateId, validateProduct } = require("../middleware/validate");

const router = express.Router();

// In‑memory “database”
let products = [
  {
    id: "1",
    name: "Laptop",
    description: "16GB RAM laptop",
    price: 1200,
    category: "electronics",
    inStock: true,
  },
  {
    id: "2",
    name: "Smartphone",
    description: "128GB storage phone",
    price: 800,
    category: "electronics",
    inStock: true,
  },
  {
    id: "3",
    name: "Coffee Maker",
    description: "Programmable coffee maker",
    price: 50,
    category: "kitchen",
    inStock: false,
  },
];

router.get("/", (req, res) => {
  let result = [...products];
  const { category, search, page = 1, limit = 10, stats } = req.query;

  if (stats === "true") {
    const byCat = result.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {});
    return res.json({ total: result.length, byCategory: byCat });
  }

  if (category) result = result.filter((p) => p.category === category);
  if (search) {
    const q = search.toLowerCase();
    result = result.filter((p) => p.name.toLowerCase().includes(q));
  }

  const pg = parseInt(page, 10);
  const lim = parseInt(limit, 10);
  const start = (pg - 1) * lim;

  res.json({
    page: pg,
    total: result.length,
    results: result.slice(start, start + lim),
  });
});

// GET single product
router.get("/:id", validateId, (req, res) => {
  const prod = products.find((p) => p.id === req.params.id);
  if (!prod) return res.status(404).json({ error: "Product not found" });
  res.json(prod);
});

// POST /api/products
router.post("/", auth, validateProduct, (req, res) => {
  const newProd = { id: uuidv4(), ...req.body };
  products.push(newProd);
  res.status(201).json(newProd);
});

// PUT /api/products/:id
router.put("/:id", auth, validateId, validateProduct, (req, res) => {
  const idx = products.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Product not found" });
  products[idx] = { ...products[idx], ...req.body };
  res.json(products[idx]);
});

// DELETE /api/products/:id
router.delete("/:id", auth, validateId, (req, res) => {
  const idx = products.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Product not found" });
  const [deleted] = products.splice(idx, 1);
  res.json(deleted);
});

module.exports = router;
