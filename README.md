# Effor — Frontend E-commerce Storefront

A modern, responsive, frontend-only e-commerce storefront for women's clothing, built with **React + TypeScript + Vite + Tailwind CSS**. Every page runs entirely on mock JSON data and is structured to plug into a real ASP.NET Core Web API later with minimal changes.

## Getting Started

```bash
npm install
npm run dev
```

Then open the printed local URL (defaults to `http://localhost:5173`).

Other scripts:

```bash
npm run build      # type-check + production build
npm run typecheck  # type-check only
npm run preview    # preview the production build locally
npm run lint        # oxlint
```

## Demo Login

The Login page is pre-filled with demo credentials:

- Email: `demo@effor.com`
- Password: `password123`

Registering creates a new mock session (stored in `localStorage`) — no real account is created anywhere.

## Project Structure

```
src/
  assets/         Static images
  components/
    ui/           Reusable primitives (Button, Input, Rating, Accordion, ...)
    layout/       Header, Footer, page Layout (with Outlet)
    product/      ProductCard, ProductGrid, ProductFilters
    cart/         CartItemRow, CartSummary
  config/
    api.config.ts   Single source of truth for every future backend endpoint
  context/        Cart, Wishlist, Auth, Toast React contexts (global state)
  data/           Mock JSON: products, categories, users, orders, faqs
  hooks/          useLocalStorage
  lib/            Formatting helpers
  pages/          One component per route (see below)
  services/       Functions the pages call — currently backed by mock data,
                  each documented with the real endpoint it will call later
  types/          Shared TypeScript domain models
```

## Pages / Shopping Journey

Home → Shop (filter/sort) → Product Details → Cart → Checkout → Order Confirmation, plus Search, Categories, Login, Register, Account (order history), Wishlist, Contact Us, About Us, and FAQ. Every button and link is wired for real navigation.

## Product Photos

The 52 product photos live flat in `public/images/products/` (e.g. `dress1.jpg`, `skirt7.jpg`, `trouser3.jpg`, `shirt9.jpg`, `accessories4.jpg`), one photo per product. Each product in `src/data/products.json` has its `name`, `description`, `features`, and `colors` written from what's actually in its photo — nothing generic. `src/data/categories.json` holds the 5 real categories: Dresses, Skirts, Trousers & Jeans, Shirts, Accessories.

Category tile photos and the homepage hero photo aren't in yet — those still show a neutral gray placeholder (via `ImageWithFallback`, `src/components/ui/ImageWithFallback.tsx`) until added:
```
public/images/hero/hero.jpg                     (homepage banner, portrait ~1000x1250)
public/images/categories/dresses.jpg
public/images/categories/skirts.jpg
public/images/categories/trousers-jeans.jpg
public/images/categories/shirts.jpg
public/images/categories/accessories.jpg         (~800x900, portrait)
```

All product-facing frames (shop grid, product page, cart, checkout, order confirmation) use `object-contain` on a gray backdrop rather than `object-cover` — a photo is always shown in full, never cropped, whatever its dimensions. That's why a tall gown photo and a wide necklace photo both display completely in the same frame, just letterboxed differently.

To add a second/third photo to any product, add more files (e.g. `dress1-2.jpg`) and add their paths to that product's `images` array in `src/data/products.json` — the gallery thumbnail row appears automatically once a product has more than one image.

## Connecting a Real Backend Later

This app never talks to a network — all "API calls" are mock service functions in `src/services/*` that resolve from local JSON/`localStorage` after a simulated delay.

1. **`src/config/api.config.ts`** documents every endpoint the ASP.NET Core backend needs to expose: HTTP method, route, request payload type, and response type.
2. Each function in `src/services/*` has a `// TODO: Replace with <METHOD> <endpoint>` comment pointing at the matching entry in `api.config.ts`, describing the expected request/response shape.
3. To integrate: implement the ASP.NET Core endpoints per `api.config.ts`, then swap the body of each service function for a `fetch`/`axios` call against `BASE_URL + endpoint`. Components, pages, and contexts call these services and don't need to change.
