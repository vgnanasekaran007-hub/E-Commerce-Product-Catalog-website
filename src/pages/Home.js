import apiService from '../services/api.js';
import ProductCard from '../components/ProductCard.js';
import Loader from '../components/Loader.js';

export const Home = {
  async render(container, params) {
    // 1. Initial page shell with Hero banner and loading skeletons for products & categories
    container.innerHTML = `
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero__bg"></div>
        <div class="container hero__content">
          <div class="hero__badge">✨ Aura Shop Collection 2026</div>
          <h1 class="hero__title">Discover Modern <br><span class="highlight">Aesthetic Living</span></h1>
          <p class="hero__desc">Explore a curated catalog of high-end consumer technology, boutique beauty essentials, and premium home decor.</p>
          <div class="hero__actions">
            <a href="#/products" class="btn btn-primary btn-lg">Shop Catalog</a>
            <a href="#/about" class="btn btn-secondary btn-lg">Learn More</a>
          </div>
          <div class="hero__stats">
            <div class="hero__stat-item">
              <div class="hero__stat-value">10k+</div>
              <div class="hero__stat-label">Happy customers</div>
            </div>
            <div class="hero__stat-item">
              <div class="hero__stat-value">190+</div>
              <div class="hero__stat-label">Unique items</div>
            </div>
            <div class="hero__stat-item">
              <div class="hero__stat-value">24h</div>
              <div class="hero__stat-label">Worldwide shipping</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Categories Section -->
      <section class="section section--sm">
        <div class="container">
          <div class="section-header">
            <h2>Shop by Category</h2>
            <p>Select a category to filter our designer catalog collections.</p>
          </div>
          <div id="home-categories-container">
            <div class="grid grid--4" style="grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));">
              ${[1, 2, 3, 4].map(() => `<div class="skeleton" style="height: 120px;"></div>`).join('')}
            </div>
          </div>
        </div>
      </section>

      <!-- Featured Products Section -->
      <section class="section">
        <div class="container">
          <div class="section-header">
            <h2>Featured Products</h2>
            <p>Our top-rated products selected by our designers.</p>
          </div>
          <div id="home-products-container">
            ${Loader.gridSkeletonHtml(8)}
          </div>
        </div>
      </section>
    `;

    // 2. Fetch featured products and categories concurrently
    try {
      const [productsData, categoriesData] = await Promise.all([
        apiService.getProducts({ limit: 8 }),
        apiService.getCategories()
      ]);

      // 3. Render Categories
      const categoriesContainer = container.querySelector('#home-categories-container');
      if (categoriesContainer && categoriesData) {
        // Map common categories to decorative emojis
        const categoryEmojis = {
          beauty: '💅',
          fragrances: '✨',
          furniture: '🛋️',
          groceries: '🍎',
          'home-decoration': '🏺',
          'kitchen-accessories': '🍳',
          laptops: '💻',
          'mens-shirts': '👔',
          'mens-shoes': '👟',
          'mens-watches': '⌚',
          'mobile-accessories': '🔌',
          motorcycle: '🏍️',
          'skin-care': '🧴',
          smartphones: '📱',
          'sports-accessories': '⚽',
          sunglasses: '🕶️',
          tablets: '📁',
          tops: '👚',
          vehicle: '🚗',
          'womens-bags': '👜',
          'womens-dresses': '👗',
          'womens-jewellery': '💍',
          'womens-shoes': '👠',
          'womens-watches': '⌚'
        };

        // Take first 8 categories for display
        const displayCategories = categoriesData.slice(0, 8);

        categoriesContainer.innerHTML = `
          <div class="grid grid--4" style="grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));">
            ${displayCategories.map(cat => {
              const emoji = categoryEmojis[cat.slug] || '🛍️';
              return `
                <a href="#/products?category=${cat.slug}" class="category-card">
                  <div class="category-card__icon">${emoji}</div>
                  <div class="category-card__name">${cat.name}</div>
                </a>
              `;
            }).join('')}
          </div>
        `;
      }

      // 4. Render Featured Products
      const productsContainer = container.querySelector('#home-products-container');
      if (productsContainer && productsData && productsData.products) {
        productsContainer.innerHTML = '';
        
        const grid = document.createElement('div');
        grid.className = 'grid grid--products';
        
        productsData.products.forEach(product => {
          const card = ProductCard.create(product);
          grid.appendChild(card);
        });

        productsContainer.appendChild(grid);
      }

    } catch (error) {
      console.error('Home Page rendering failed:', error);
      // Fail gracefully: replace loaders with a helpful error message
      const productsContainer = container.querySelector('#home-products-container');
      if (productsContainer) {
        productsContainer.innerHTML = `
          <div class="text-center" style="padding: var(--space-8) 0;">
            <p style="color: var(--color-error); margin-bottom: var(--space-4);">${error.message}</p>
            <button onclick="window.location.reload()" class="btn btn-secondary">Retry Loading Catalog</button>
          </div>
        `;
      }
    }
  }
};

export default Home;
