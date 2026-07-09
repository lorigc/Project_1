const $ = sel => document.querySelector(sel);
const fmt = n => '$' + Number(n).toFixed(2);

let menu = [];
let toppings = [];
let deliveryFee = 2.99;
let freeDeliveryOver = 30;
let activeCategory = '';
let cart = JSON.parse(localStorage.getItem('slice-cart') || '[]');

const CATEGORIES = [
  { id: '', label: 'All' },
  { id: 'pizza', label: '🍕 Pizzas' },
  { id: 'side', label: '🥨 Sides' },
  { id: 'drink', label: '🥤 Drinks' },
  { id: 'dessert', label: '🍫 Desserts' }
];

/* ---------- data ---------- */

async function loadMenu(q = '') {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (activeCategory) params.set('category', activeCategory);
  const res = await fetch('/api/menu?' + params);
  const data = await res.json();
  menu = data.items;
  toppings = data.toppings;
  deliveryFee = data.deliveryFee;
  freeDeliveryOver = data.freeDeliveryOver;
  renderMenu();
}

function saveCart() {
  localStorage.setItem('slice-cart', JSON.stringify(cart));
}

/* ---------- menu view ---------- */

function renderCategories() {
  const nav = $('#categories');
  nav.innerHTML = '';
  CATEGORIES.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'chip' + (activeCategory === c.id ? ' active' : '');
    btn.textContent = c.label;
    btn.addEventListener('click', () => {
      activeCategory = c.id;
      renderCategories();
      loadMenu($('#q').value.trim());
    });
    nav.appendChild(btn);
  });
}

function renderMenu() {
  const container = $('#menu');
  container.innerHTML = '';
  if (menu.length === 0) {
    container.innerHTML = '<div class="empty">Nothing found 🍽️</div>';
    return;
  }
  menu.forEach(p => {
    const isPizza = p.category === 'pizza';
    const priceLabel = isPizza
      ? `<span class="from">from</span> ${fmt(p.sizes[0].price)}`
      : fmt(p.price);
    const el = document.createElement('button');
    el.className = 'item-card';
    el.innerHTML = `
      <div class="item-art">${p.emoji}</div>
      <div class="item-info">
        <h3>${p.name}</h3>
        <p>${p.description}</p>
      </div>
      <div class="item-side">
        <div class="price">${priceLabel}</div>
        <span class="add-btn">+</span>
      </div>
    `;
    el.addEventListener('click', () => (isPizza ? openSheet(p) : quickAdd(p)));
    container.appendChild(el);
  });
}

function quickAdd(p) {
  addToCart({
    itemId: p.id,
    name: p.name,
    emoji: p.emoji,
    detail: '',
    unitPrice: p.price,
    qty: 1
  });
  toast(`${p.name} added to cart`);
}

/* ---------- customization sheet ---------- */

let sheetState = null;

function openSheet(p) {
  sheetState = { item: p, sizeId: p.sizes[1] ? p.sizes[1].id : p.sizes[0].id, toppingIds: [], qty: 1 };
  renderSheet();
  $('#sheetOverlay').hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeSheet() {
  $('#sheetOverlay').hidden = true;
  document.body.style.overflow = '';
  sheetState = null;
}

function sheetUnitPrice() {
  const { item, sizeId, toppingIds } = sheetState;
  const size = item.sizes.find(s => s.id === sizeId);
  const tops = toppingIds.reduce((s, id) => s + toppings.find(t => t.id === id).price, 0);
  return size.price + tops;
}

function renderSheet() {
  const { item, sizeId, toppingIds, qty } = sheetState;
  const body = $('#sheetBody');
  body.innerHTML = `
    <div class="item-head">
      <div class="item-art">${item.emoji}</div>
      <div>
        <h3>${item.name}</h3>
        <p class="desc">${item.description}</p>
      </div>
    </div>
    <h4>Size</h4>
    ${item.sizes.map(s => `
      <div class="option-row ${s.id === sizeId ? 'selected' : ''}" data-size="${s.id}">
        <span>${s.label}</span><span class="opt-price">${fmt(s.price)}</span>
      </div>`).join('')}
    <h4>Extra toppings</h4>
    ${toppings.map(t => `
      <div class="option-row ${toppingIds.includes(t.id) ? 'selected' : ''}" data-topping="${t.id}">
        <span>${t.name}</span><span class="opt-price">+${fmt(t.price)}</span>
      </div>`).join('')}
    <div class="sheet-footer">
      <div class="qty-stepper">
        <button id="qtyMinus">−</button><span>${qty}</span><button id="qtyPlus">+</button>
      </div>
      <button class="primary" id="sheetAdd">Add ${qty} · ${fmt(sheetUnitPrice() * qty)}</button>
    </div>
  `;

  body.querySelectorAll('[data-size]').forEach(el =>
    el.addEventListener('click', () => { sheetState.sizeId = el.dataset.size; renderSheet(); }));
  body.querySelectorAll('[data-topping]').forEach(el =>
    el.addEventListener('click', () => {
      const id = el.dataset.topping;
      const i = sheetState.toppingIds.indexOf(id);
      if (i >= 0) sheetState.toppingIds.splice(i, 1);
      else sheetState.toppingIds.push(id);
      renderSheet();
    }));
  $('#qtyMinus').addEventListener('click', () => { if (sheetState.qty > 1) { sheetState.qty--; renderSheet(); } });
  $('#qtyPlus').addEventListener('click', () => { sheetState.qty++; renderSheet(); });
  $('#sheetAdd').addEventListener('click', () => {
    const size = item.sizes.find(s => s.id === sheetState.sizeId);
    const topNames = sheetState.toppingIds.map(id => toppings.find(t => t.id === id).name);
    addToCart({
      itemId: item.id,
      name: item.name,
      emoji: item.emoji,
      detail: [size.label, ...topNames].join(' · '),
      unitPrice: sheetUnitPrice(),
      qty: sheetState.qty
    });
    toast(`${item.name} added to cart`);
    closeSheet();
  });
}

/* ---------- cart ---------- */

function addToCart(line) {
  const key = line.itemId + '|' + line.detail;
  const existing = cart.find(c => c.key === key);
  if (existing) existing.qty += line.qty;
  else cart.push({ key, ...line });
  saveCart();
  updateCartBadge();
  if (!$('#view-cart').hidden) renderCart();
}

function updateCartBadge() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const badge = $('#cartCount');
  badge.hidden = count === 0;
  badge.textContent = count;
}

function cartSubtotal() {
  return cart.reduce((s, i) => s + i.unitPrice * i.qty, 0);
}

function renderCart() {
  const items = $('#cartItems');
  const summary = $('#cartSummary');
  const form = $('#checkoutForm');
  $('#orderResult').hidden = true;

  if (cart.length === 0) {
    items.innerHTML = '<div class="empty">Your cart is empty 🧺<br>Head to the menu and grab a slice!</div>';
    summary.hidden = true;
    form.hidden = true;
    return;
  }

  items.innerHTML = '';
  cart.forEach((line, idx) => {
    const el = document.createElement('div');
    el.className = 'cart-line';
    el.innerHTML = `
      <div class="item-art">${line.emoji}</div>
      <div class="meta">
        <h4>${line.name}</h4>
        ${line.detail ? `<p>${line.detail}</p>` : ''}
      </div>
      <div class="qty-stepper">
        <button data-act="minus">−</button><span>${line.qty}</span><button data-act="plus">+</button>
      </div>
      <div class="line-price">${fmt(line.unitPrice * line.qty)}</div>
    `;
    el.querySelector('[data-act="minus"]').addEventListener('click', () => {
      line.qty--;
      if (line.qty <= 0) cart.splice(idx, 1);
      saveCart(); updateCartBadge(); renderCart();
    });
    el.querySelector('[data-act="plus"]').addEventListener('click', () => {
      line.qty++;
      saveCart(); updateCartBadge(); renderCart();
    });
    items.appendChild(el);
  });

  const sub = cartSubtotal();
  const fee = sub >= freeDeliveryOver ? 0 : deliveryFee;
  $('#sumSubtotal').textContent = fmt(sub);
  $('#sumDelivery').textContent = fee === 0 ? 'FREE' : fmt(fee);
  $('#sumTotal').textContent = fmt(sub + fee);
  const hint = $('#freeDeliveryHint');
  if (fee > 0) {
    hint.hidden = false;
    hint.textContent = `Add ${fmt(freeDeliveryOver - sub)} more for free delivery!`;
  } else {
    hint.hidden = true;
  }
  summary.hidden = false;
  form.hidden = false;
}

/* ---------- checkout ---------- */

$('#checkoutForm').addEventListener('submit', async e => {
  e.preventDefault();
  const btn = $('#placeOrderBtn');
  btn.disabled = true;
  const form = new FormData(e.target);
  const delivery = {};
  form.forEach((v, k) => delivery[k] = v);

  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ cart, delivery })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to place order');

    cart = [];
    saveCart();
    updateCartBadge();
    e.target.reset();
    $('#cartItems').innerHTML = '';
    $('#cartSummary').hidden = true;
    $('#checkoutForm').hidden = true;
    const result = $('#orderResult');
    result.hidden = false;
    result.innerHTML = `
      <div class="confirmation">
        <div class="big">🛵</div>
        <h3>Order confirmed!</h3>
        <p>Order <strong>${data.orderId}</strong></p>
        <p class="eta">Arriving in ~${data.etaMinutes} min</p>
        <p>Total charged: <strong>${fmt(data.total)}</strong></p>
      </div>
    `;
  } catch (err) {
    toast(err.message);
  } finally {
    btn.disabled = false;
  }
});

/* ---------- orders view ---------- */

async function renderOrders() {
  const list = $('#ordersList');
  list.innerHTML = '<div class="empty">Loading…</div>';
  const res = await fetch('/api/orders');
  const orders = await res.json();
  if (!orders.length) {
    list.innerHTML = '<div class="empty">No orders yet 📭</div>';
    return;
  }
  list.innerHTML = orders.slice().reverse().map(o => `
    <div class="order-card">
      <div class="top">
        <span class="oid">${o.id}</span>
        <span class="status">${o.status}</span>
      </div>
      <div class="items">${o.cart.map(i => `${i.qty}× ${i.name}`).join(', ')}</div>
      <div class="bottom">
        <span>${new Date(o.createdAt).toLocaleString()}</span>
        <span class="total">${fmt(o.total)}</span>
      </div>
    </div>
  `).join('');
}

/* ---------- navigation ---------- */

function showView(name) {
  ['menu', 'cart', 'orders'].forEach(v => {
    $('#view-' + v).hidden = v !== name;
  });
  document.querySelectorAll('.bottom-nav button').forEach(b =>
    b.classList.toggle('active', b.dataset.view === name));
  if (name === 'cart') renderCart();
  if (name === 'orders') renderOrders();
  window.scrollTo(0, 0);
}

document.querySelectorAll('.bottom-nav button').forEach(b =>
  b.addEventListener('click', () => showView(b.dataset.view)));
$('#cartBadge').addEventListener('click', () => showView('cart'));

/* ---------- misc ---------- */

let searchTimer;
$('#q').addEventListener('input', e => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => loadMenu(e.target.value.trim()), 250);
});

$('#sheetOverlay').addEventListener('click', e => {
  if (e.target === $('#sheetOverlay')) closeSheet();
});

let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.hidden = true; }, 2200);
}

/* ---------- init ---------- */

renderCategories();
updateCartBadge();
loadMenu();
