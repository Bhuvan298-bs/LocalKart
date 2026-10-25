# LocalKart — Phase 1: Complete React Frontend

> **Temporary Tagline**: *Your neighbourhood, delivered.*
>
> **Product Promise**: Discover local shops, shop conveniently, and help neighbourhood businesses participate in digital commerce.

LocalKart is a local commerce marketplace designed for Indian retail that empowers neighbourhood kirana stores, fresh vegetable mandis, dairies, and bakeries to create their own digital storefronts, manage inventory, receive orders, and deliver to nearby residents.

---

## 🛠️ Mandatory Technology Stack

- **React.js 19**
- **Vite 8**
- **JavaScript & JSX** (Strictly zero TypeScript, zero `.ts`/`.tsx` files)
- **React Router DOM 7**
- **Plain CSS Design System** with CSS Custom Properties / Tokens (`tokens.css`, `global.css`, `components.css`, `customer.css`, `dashboard.css`, `responsive.css`)
- **Lucide React** for interface iconography
- **React Context API** (`CartContext`, `AuthContext`)
- **localStorage** for non-sensitive demo cart persistence

---

## 🚀 Getting Started

### 1. Installation
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

### 3. Build for Production
```bash
npm run build
```

---

## 🗺️ Application Architecture & Routes

### Customer Portal
| Route | Description |
|---|---|
| `/` | Marketplace Homepage: Hero, categories, verified local shops, popular items, how it works |
| `/shops` | Shop Discovery: Search, category filtering, open/closed status filter, sorting |
| `/shops/:slug` | Shop Storefront: Store header, locality, in-shop search, categories, product grid |
| `/products/:id` | Product Details: High-res images, pricing in ₹ (INR), stock status, add-to-cart |
| `/cart` | Basket: Multi-item line totals, unit breakdown, one-shop-per-order banner |
| `/checkout` | Demo Checkout: Address, landmark, delivery vs pickup, simulated cash/UPI on delivery |
| `/orders` | Order History: Status filter tabs (Active, Delivered, Cancelled) |
| `/orders/:id` | Order Tracking: Visual milestone timeline, itemized pricing, delivery courier |

### Authentication (Simulated Demo Mode)
| Route | Description |
|---|---|
| `/login` | Customer Sign In with one-click demo login as Priya Sharma |
| `/register` | Customer Registration |
| `/seller/login` | Shopkeeper Sign In with one-click demo login as Ramesh Patel (Shri Krishna Kirana) |
| `/seller/register` | Merchant Onboarding: Register store name, owner, locality, timings |

### Shopkeeper Dashboard (Seller Center)
| Route | Description |
|---|---|
| `/seller/dashboard` | Overview: Real-time inventory metrics, low-stock warnings, recent order feed |
| `/seller/products` | Catalog CRUD: Search, category/stock filters, activate/pause, delete |
| `/seller/products/new` | Add Product: Form with local image preview + **Mock AI Suggestion Assistant** |
| `/seller/products/:id/edit` | Edit Product: Update pricing, units, stock quantities, and warning threshold |
| `/seller/orders` | Orders Board: Filter by New, Accepted, Preparing, Ready, Delivered, Decline |
| `/seller/orders/:id` | Order Processing: Item checklist, customer destination, status transitions |
| `/seller/store` | Store Profile: Operating hours, street address, and store Open/Closed toggle |

### Administrator Operations Center
| Route | Description |
|---|---|
| `/admin/dashboard` | Operations Overview: Approved merchants, pending applications, delivery queue |
| `/admin/shops` | Merchant Moderation: Review pending applications, approve or decline stores |
| `/admin/orders` | Network Audit: Complete visibility over all neighbourhood orders |
| `/admin/deliveries` | Fleet Dispatch: Assign and reassign local couriers to preparing orders |

---

## 🌟 Distinctive Feature: "Find an Alternative Shop" (Backup Shop Workflow)

When an essential grocery or produce item is out of stock at a customer's primary store (e.g. *Toor Dal 1kg* at *Shri Krishna Kirana*), LocalKart displays:
1. Clear **Out of Stock** indicator with explanation.
2. The **Availability Resolver** identifying other nearby verified merchants that have current inventory.
3. Comparative price, distance, and unit specification for each alternative store.
4. One-click navigation to explore the alternative storefront.
5. Strict enforcement of the **One-Shop-Per-Order Rule**: adding items from a different merchant prompts a confirmation dialog to start a new order, ensuring complete merchant accountability.

---

## 🔒 Known Limitations & Phase 2 Roadmap

- **Mock Authentication**: Auth sessions are simulated client-side. No passwords or tokens are stored in plain text. Phase 2 will link directly to Supabase Auth with Row Level Security (RLS).
- **In-Memory Mock Services**: Inventory mutations, status progressions, and newly added products persist during the browser session via our isolated mock service layer (`src/services/mock/`).
- **Payment Processing**: Orders use simulated Cash/UPI on Delivery and Counter Pickup. No actual banking cards or payments are accepted.
- **Local Images**: Uploaded product images generate browser object URLs (`blob:`) with automatic cleanup rather than calling permanent cloud bucket storage.
