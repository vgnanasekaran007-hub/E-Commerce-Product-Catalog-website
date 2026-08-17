# AURA — Premium E-Commerce Product Catalog

A production-ready, portfolio-quality Single Page Application (SPA) E-Commerce catalog built using **Vanilla HTML5, CSS3, and JavaScript (ES6+)** with a fully modular architecture. Built as a Capstone project.

Live Demo: [https://e-commerce-product-catalog-website.vercel.app/](https://e-commerce-product-catalog-website.vercel.app/)

---

## Key Features

1. **Client-Side Routing**: Custom hash-based router (`#/`, `#/products`, `#/product/:id`, `#/cart`, `#/wishlist`, `#/about`, `#/contact`) supporting parameterized paths and dynamic parameter extraction.
2. **Global State Management**: Pure JavaScript subscription-based state management that synchronizes the Shopping Cart and Wishlist to `localStorage`, with live header badge counters updating reactively.
3. **Advanced Product List Controls**:
   - Live Search: Debounced search queries matching inputs in real time.
   - Category Filters: Dynamic categories fetched directly from DummyJSON.
   - Client-side sorting (Featured, Price Low-to-High, Price High-to-Low, Top Rated, and alphabetical Name A-Z).
   - Incremental pagination ("Load More" button offset pagination).
4. **Rich Aesthetics**: Premium modern dark-theme design utilizing harmonious HSL palettes, glassmorphism cards, skeleton shim loaders, custom scrollbars, and micro-interactions.
5. **Interactive Form Validation**: Client-side validation for the contact page checking format, text length, and email regex patterns with dynamic visual feedback.
6. **Robust Error Handling**: Handle network offline events, slow responses, and missing product APIs with beautiful recovery prompts.

---

## Technology Stack

- **Core Structure**: HTML5 Semantic Elements
- **Styling**: Vanilla CSS3 Custom Variables, Grids, and Flexbox layouts
- **Logic**: Vanilla ES6+ JavaScript modules
- **Build Tool**: Vite (Minified production bundles, asset compilation)
- **Data Source**: DummyJSON Products API (`https://dummyjson.com/products`)

---

## File Structure

```text
ecommerce-catalog/
├── public/                 # Static assets (Favicons, branding SVGs)
├── src/
│   ├── core/
│   │   ├── router.js       # Client-side hash router
│   │   └── state.js        # Cart & Wishlist reactive state
│   ├── services/
│   │   └── api.js          # Fetch wrapper & API endpoints
│   ├── components/
│   │   ├── icons.js        # Reusable inline SVGs
│   │   ├── Header.js       # Sticky top navigation & mobile menu
│   │   ├── Footer.js       # Bottom footer layout & newsletter mockup
│   │   ├── ProductCard.js  # Dynamic card creation with action listeners
│   │   ├── Loader.js       # Shimmer skeleton loader & page spinner
│   │   └── Toast.js        # Custom event-driven notification toaster
│   ├── pages/
│   │   ├── Home.js         # Hero block & featured lists
│   │   ├── Products.js     # Toolbar, filters, sorting & catalog grid
│   │   ├── ProductDetail.js# Carousel gallery, ratings, reviews & related items
│   │   ├── Cart.js         # Cart item list & totals calculation panel
│   │   ├── Wishlist.js     # Saved products grid
│   │   ├── About.js        # Founders info, animated counters
│   │   ├── Contact.js      # Contact details & validated messaging form
│   │   └── NotFound.js     # 404 Fallback page
│   ├── css/
│   │   ├── variables.css   # Color palette & tokens
│   │   ├── base.css        # Resets & typography
│   │   ├── layout.css      # Grid utilities, App Shell
│   │   ├── components.css  # Buttons, inputs, loader classes
│   │   ├── pages.css       # Page-specific layouts
│   │   └── responsive.css  # Breakpoints & media queries
│   └── main.js             # Main entry point bootstrapping the application
├── index.html              # HTML core shell
├── package.json            # Scripts & Vite configuration
└── README.md               # Documentation
```

---

## Setup & Running Locally

Ensure you have [Node.js](https://nodejs.org/) (v18+) installed.

1. **Navigate to project folder**:
   ```bash
   cd ecommerce-catalog
   ```

2. **Install development dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open the displayed localhost URL (usually `http://localhost:5173`) in your browser.

4. **Verify production build**:
   ```bash
   npm run build
   ```
   This compiles and optimizes all assets into the `dist/` directory.

---

## Architecture Design Decisions

### Event-Driven Toast Messaging
Rather than tightly coupling every page to the notification widget, a Custom Event system was utilized. Pages simply dispatch a `show-toast` window event which is handled globally by a single listener. This keeps individual page files clean.



### Reactive State Sync
The global state uses a Pub/Sub design. When cart items are modified or wishlists updated, subscribers are immediately triggered. The Cart and Wishlist pages listen to this stream, allowing pages to instantly redraw when values change.
---

## Author

- **Name**: Gnanasekaran V
- **Email**: [v.gnanasekaran007@gmail.com](mailto:v.gnanasekaran007@gmail.com)
- **GitHub**: [@vgnanasekaran007-hub(https://github.com/vgnanasekaran007-hub)

