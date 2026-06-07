const $ = sel => document.querySelector(sel);
let products = [];
let cart = [];

function formatPrice(n){ return '$' + Number(n).toFixed(2); }

async function load(q=''){
  const res = await fetch('/api/products' + (q?('?q='+encodeURIComponent(q)):''));
  products = await res.json();
  renderProducts();
}

function renderProducts(){
  const container = $('#products');
  container.innerHTML = '';
  products.forEach(p=>{
    const el = document.createElement('div');
    el.className = 'card';
    el.innerHTML = `
      <img src="${p.image}" alt="${p.name}" />
      <h3>${p.name}</h3>
      <p>${p.description}</p>
      <div class="price">${formatPrice(p.price)}</div>
      <button data-id="${p.id}">Add to cart</button>
    `;
    el.querySelector('button').addEventListener('click', ()=> addToCart(p));
    container.appendChild(el);
  });
}

function addToCart(p){
  const existing = cart.find(c=>c.id===p.id);
  if(existing) existing.qty++;
  else cart.push({id:p.id, name:p.name, price:p.price, qty:1});
  updateCartUI();
}

function updateCartUI(){
  $('#cartCount').textContent = cart.reduce((s,i)=>s+i.qty,0);
  const items = $('#cartItems');
  items.innerHTML = cart.map(i=>`<div>${i.name} x ${i.qty} — ${formatPrice(i.price*i.qty)}</div>`).join('') || '<div>(empty)</div>';
  const total = cart.reduce((s,i)=>s+i.price*i.qty,0);
  $('#cartTotal').textContent = 'Total: ' + formatPrice(total);
}

document.getElementById('searchBtn').addEventListener('click', ()=>{
  const q = $('#q').value.trim();
  load(q);
});

document.getElementById('checkoutForm').addEventListener('submit', async (e)=>{
  e.preventDefault();
  if(cart.length===0){ alert('Cart is empty'); return; }
  const form = new FormData(e.target);
  const shipping = {};
  form.forEach((v,k)=> shipping[k]=v);
  const res = await fetch('/api/orders', {method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({cart, shipping})});
  const data = await res.json();
  if(res.ok){
    $('#orderResult').textContent = `Order placed: ${data.orderId}. ETA: ${data.etaDays} days`;
    cart = [];
    updateCartUI();
    e.target.reset();
  } else {
    $('#orderResult').textContent = data.error || 'Failed to place order';
  }
});

document.getElementById('cartToggle').addEventListener('click', ()=>{
  const cartEl = document.getElementById('cart');
  cartEl.style.display = cartEl.style.display === 'block' ? 'none' : 'block';
});

load();
