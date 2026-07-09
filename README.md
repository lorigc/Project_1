# 🍕 Slice — Pizza Ordering App

A mobile-first pizza ordering web app: browse the menu, customize pizzas (size + toppings), add to cart, and place delivery orders. Built with an Express backend serving a vanilla-JS frontend.

## Run locally

```
npm install
npm start

# Open http://localhost:3000 (use browser devtools mobile view for the full effect)
```

## Features

- 📱 Mobile-first UI with bottom-tab navigation (Menu / Cart / Orders)
- 🍕 Pizza customization: size and extra toppings via a bottom sheet
- 🛒 Cart persisted in localStorage, quantity steppers
- 🚚 Delivery fee with free-delivery threshold ($30+)
- 📦 Order history with status

## API

| Method | Route | Description |
|---|---|---|
| GET | `/api/menu?q=&category=` | Menu items + toppings + delivery config |
| GET | `/api/menu/:id` | Single item |
| POST | `/api/orders` | Place an order `{cart, delivery}` |
| GET | `/api/orders` | List past orders |

## Files of interest

- [server.js](server.js) — Express API
- [data/products.js](data/products.js) — menu + toppings data
- [public/app.js](public/app.js) — frontend logic
- [public/styles.css](public/styles.css) — mobile theme
