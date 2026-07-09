const express = require('express');
const fs = require('fs');
const path = require('path');
const { items, toppings } = require('./data/products');

const app = express();
const PORT = process.env.PORT || 3000;
const ordersFile = path.join(__dirname, 'data', 'orders.json');

const DELIVERY_FEE = 2.99;
const FREE_DELIVERY_OVER = 30;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/menu', (req, res) => {
  const q = (req.query.q || '').toLowerCase();
  const category = req.query.category || '';
  const results = items.filter(p => {
    const matchesQuery =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.tags || []).some(t => t.toLowerCase().includes(q));
    const matchesCategory = !category || p.category === category;
    return matchesQuery && matchesCategory;
  });
  res.json({ items: results, toppings, deliveryFee: DELIVERY_FEE, freeDeliveryOver: FREE_DELIVERY_OVER });
});

app.get('/api/menu/:id', (req, res) => {
  const p = items.find(x => String(x.id) === String(req.params.id));
  if (!p) return res.status(404).json({ error: 'Not found' });
  res.json(p);
});

app.post('/api/orders', (req, res) => {
  const { cart, delivery } = req.body;
  if (!Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }
  if (!delivery || !delivery.name || !delivery.phone || !delivery.address) {
    return res.status(400).json({ error: 'Missing delivery info (name, phone, address)' });
  }

  const subtotal = cart.reduce((s, i) => s + Number(i.unitPrice || 0) * Number(i.qty || 1), 0);
  const deliveryFee = subtotal >= FREE_DELIVERY_OVER ? 0 : DELIVERY_FEE;
  const etaMinutes = 25 + Math.floor(Math.random() * 20);

  const order = {
    id: 'ord_' + Date.now(),
    cart,
    delivery,
    subtotal: Number(subtotal.toFixed(2)),
    deliveryFee,
    total: Number((subtotal + deliveryFee).toFixed(2)),
    etaMinutes,
    createdAt: new Date().toISOString(),
    status: 'preparing'
  };

  try {
    const existing = fs.existsSync(ordersFile) ? JSON.parse(fs.readFileSync(ordersFile)) : [];
    existing.push(order);
    fs.writeFileSync(ordersFile, JSON.stringify(existing, null, 2));
  } catch (err) {
    console.error('Failed to save order', err);
    return res.status(500).json({ error: 'Failed to save order' });
  }

  res.json({ orderId: order.id, etaMinutes, total: order.total, deliveryFee });
});

app.get('/api/orders', (req, res) => {
  try {
    const existing = fs.existsSync(ordersFile) ? JSON.parse(fs.readFileSync(ordersFile)) : [];
    res.json(existing);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read orders' });
  }
});

app.listen(PORT, () => console.log(`Pizza server running on http://localhost:${PORT}`));
