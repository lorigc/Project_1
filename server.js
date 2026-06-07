const express = require('express');
const fs = require('fs');
const path = require('path');
const products = require('./data/products');

const app = express();
const PORT = process.env.PORT || 3000;
const ordersFile = path.join(__dirname, 'data', 'orders.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/products', (req, res) => {
  const q = (req.query.q || '').toLowerCase();
  const results = products.filter(p => {
    return (
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.tags || []).some(t => t.toLowerCase().includes(q))
    );
  });
  res.json(results);
});

app.get('/api/products/:id', (req, res) => {
  const p = products.find(x => String(x.id) === String(req.params.id));
  if (!p) return res.status(404).json({ error: 'Not found' });
  res.json(p);
});

app.post('/api/orders', (req, res) => {
  const { cart, shipping } = req.body;
  if (!Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }
  if (!shipping || !shipping.name || !shipping.address) {
    return res.status(400).json({ error: 'Missing shipping info' });
  }

  const order = {
    id: 'ord_' + Date.now(),
    cart,
    shipping,
    createdAt: new Date().toISOString(),
    status: 'processing'
  };

  try {
    const existing = fs.existsSync(ordersFile) ? JSON.parse(fs.readFileSync(ordersFile)) : [];
    existing.push(order);
    fs.writeFileSync(ordersFile, JSON.stringify(existing, null, 2));
  } catch (err) {
    console.error('Failed to save order', err);
    return res.status(500).json({ error: 'Failed to save order' });
  }

  const shippingEstimateDays = 3 + Math.floor(Math.random() * 5);
  res.json({ orderId: order.id, etaDays: shippingEstimateDays });
});

app.get('/api/orders', (req, res) => {
  // simple read-only endpoint to list orders
  try {
    const existing = fs.existsSync(ordersFile) ? JSON.parse(fs.readFileSync(ordersFile)) : [];
    res.json(existing);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read orders' });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
