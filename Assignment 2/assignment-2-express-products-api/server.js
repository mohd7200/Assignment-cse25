const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 3000;
const DATA_FILE = "products.json";

app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.send(`
    <h1>Products REST API</h1>
    <p>100 products are available.</p>
    <p>Use <a href="/products">/products</a> to view all products.</p>
  `);
});

// Get all products
app.get("/products", (req, res) => {
  const products = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  res.json(products);
});

// Get one product by ID
app.get("/products/:id", (req, res) => {
  const products = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  const product = products.find(p => p.id === Number(req.params.id));

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
});

// Add a product
app.post("/products", (req, res) => {
  const products = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));

  const newProduct = {
    id: products.length ? Math.max(...products.map(p => p.id)) + 1 : 1,
    name: req.body.name,
    price: req.body.price,
    category: req.body.category,
    description: req.body.description
  };

  if (!newProduct.name || newProduct.price === undefined || !newProduct.category) {
    return res.status(400).json({
      message: "name, price and category are required"
    });
  }

  products.push(newProduct);
  fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2));

  res.status(201).json(newProduct);
});

// Update a product
app.put("/products/:id", (req, res) => {
  const products = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  const index = products.findIndex(p => p.id === Number(req.params.id));

  if (index === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  products[index] = {
    ...products[index],
    ...req.body,
    id: products[index].id
  };

  fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2));
  res.json(products[index]);
});

// Delete a product
app.delete("/products/:id", (req, res) => {
  const products = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  const index = products.findIndex(p => p.id === Number(req.params.id));

  if (index === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  const deleted = products.splice(index, 1)[0];
  fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2));

  res.json({ message: "Product deleted", product: deleted });
});

app.listen(PORT, () => {
  console.log(`Assignment 2 API running at http://localhost:${PORT}`);
});
