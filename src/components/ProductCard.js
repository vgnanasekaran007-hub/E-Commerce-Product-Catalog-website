import state from '../core/state.js';
import icons from './icons.js';
import router from '../core/router.js';

export const ProductCard = {
  /**
   * Create a product card DOM Element with embedded event listeners.
   * @param {object} product Product data object.
   * @returns {HTMLElement} The card element.
   */
  create(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-id', product.id);

    // Calculations
    const isWishlisted = state.isInWishlist(product.id);
    const rating = Math.min(5, Math.max(0, product.rating || 0));
    const discount = product.discountPercentage || 0;
    
    // In DummyJSON API: "price" is the base price.
    // The discountPercentage needs to be applied to calculate final price.
    const originalPrice = product.price;
    const currentPrice = discount > 0 ? (originalPrice * (1 - discount / 100)) : originalPrice;

    // Star ratings markup
    let starsHtml = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        starsHtml += icons.star('star');
      } else if (i === fullStars + 1 && hasHalfStar) {
        starsHtml += icons.starHalf('star');
      } else {
        starsHtml += icons.star('star star-empty', 'none');
      }
    }

    card.innerHTML = `
      <!-- Discount Badge -->
      ${discount > 0 ? `<span class="badge badge--discount">-${Math.round(discount)}%</span>` : ''}

      <!-- Image -->
      <div class="product-card__image-wrap">
        <img src="${product.thumbnail}" alt="${product.title}" class="product-card__image" loading="lazy">
      </div>

      <!-- Wishlist Action -->
      <button class="product-card__wishlist ${isWishlisted ? 'active' : ''}" aria-label="Add to wishlist">
        ${icons.heart('', isWishlisted ? 'currentColor' : 'none')}
      </button>

      <!-- Card Body -->
      <div class="product-card__body">
        <div class="product-card__category">${product.category || 'general'}</div>
        <h3 class="product-card__title" title="${product.title}">${product.title}</h3>
        <div class="product-card__rating">
          <div class="stars">${starsHtml}</div>
          <span>(${product.rating?.toFixed(1) || '0.0'})</span>
        </div>
      </div>

      <!-- Card Footer -->
      <div class="product-card__footer">
        <div class="product-card__price">
          <span class="current">$${currentPrice.toFixed(2)}</span>
          ${discount > 0 ? `<span class="original">$${originalPrice.toFixed(2)}</span>` : ''}
        </div>
        <button class="product-card__add-btn" aria-label="Add to cart">
          ${icons.plus()}
        </button>
      </div>
    `;

    // ── EVENT LISTENERS ──

    // Navigation on click
    card.addEventListener('click', (e) => {
      // Don't navigate if clicking actions
      if (e.target.closest('.product-card__wishlist') || e.target.closest('.product-card__add-btn')) {
        return;
      }
      router.navigate(`/product/${product.id}`);
    });

    // Wishlist toggle listener
    const wishlistBtn = card.querySelector('.product-card__wishlist');
    wishlistBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      state.toggleWishlist(product);
      const active = state.isInWishlist(product.id);
      wishlistBtn.classList.toggle('active', active);
      wishlistBtn.innerHTML = icons.heart('', active ? 'currentColor' : 'none');
    });

    // Add to cart listener
    const addBtn = card.querySelector('.product-card__add-btn');
    addBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      state.addToCart(product, 1);
      
      // Visual feedback animation
      addBtn.classList.add('added');
      addBtn.innerHTML = icons.check();
      setTimeout(() => {
        addBtn.classList.remove('added');
        addBtn.innerHTML = icons.plus();
      }, 1000);
    });

    return card;
  }
};

export default ProductCard;
