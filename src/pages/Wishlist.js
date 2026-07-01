import state from '../core/state.js';
import ProductCard from '../components/ProductCard.js';

export const Wishlist = {
  container: null,
  unsubscribe: null,

  async render(container, params) {
    this.container = container;

    // Clean up previous subscription to prevent memory leaks
    if (this.unsubscribe) {
      this.unsubscribe();
    }

    // Subscribe to state changes reactively
    this.unsubscribe = state.subscribe((stateCopy) => {
      this.renderWishlistView(stateCopy);
    });
  },

  /**
   * Render wishlist view. Called reactively when wishlist state changes.
   */
  renderWishlistView(stateCopy) {
    const { wishlist } = stateCopy;

    if (wishlist.length === 0) {
      this.container.innerHTML = `
        <div class="container section">
          <!-- Breadcrumbs -->
          <div class="breadcrumb">
            <a href="#/">Home</a>
            <span class="separator">/</span>
            <span class="current">My Wishlist</span>
          </div>

          <div class="empty-state" style="margin-top: var(--space-8);">
            <div class="empty-state__icon">❤️</div>
            <h2 class="empty-state__title">Your Wishlist is Empty</h2>
            <p class="empty-state__text">Keep track of your favorite boutique and tech selections by clicking the heart icon on cards.</p>
            <a href="#/products" class="btn btn-primary btn-pill btn-lg">Browse Collection</a>
          </div>
        </div>
      `;
      return;
    }

    this.container.innerHTML = `
      <div class="container section">
        <!-- Breadcrumbs -->
        <div class="breadcrumb">
          <a href="#/">Home</a>
          <span class="separator">/</span>
          <span class="current">My Wishlist</span>
        </div>

        <h1 style="margin-top: var(--space-4); margin-bottom: var(--space-8);">My Wishlist</h1>

        <!-- Product Grid -->
        <div id="wishlist-grid-wrapper"></div>
      </div>
    `;

    // Append ProductCards dynamically to wrap event listeners
    const gridWrapper = this.container.querySelector('#wishlist-grid-wrapper');
    if (gridWrapper) {
      const grid = document.createElement('div');
      grid.className = 'grid grid--products';
      
      wishlist.forEach(product => {
        const card = ProductCard.create(product);
        grid.appendChild(card);
      });

      gridWrapper.appendChild(grid);
    }
  }
};

export default Wishlist;
