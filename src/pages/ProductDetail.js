import apiService from '../services/api.js';
import state from '../core/state.js';
import icons from '../components/icons.js';
import ProductCard from '../components/ProductCard.js';
import Loader from '../components/Loader.js';

export const ProductDetail = {
  async render(container, params) {
    const productId = params.id;
    if (!productId) {
      container.innerHTML = `<div class="container section text-center"><h2>Invalid Product ID</h2></div>`;
      return;
    }

    // Render loading indicator first
    container.innerHTML = `
      <div class="container section">
        ${Loader.spinnerHtml()}
      </div>
    `;

    try {
      // 1. Fetch main product details
      const product = await apiService.getProduct(productId);
      
      // Calculate prices
      const discount = product.discountPercentage || 0;
      const originalPrice = product.price;
      const currentPrice = discount > 0 ? (originalPrice * (1 - discount / 100)) : originalPrice;
      const isWishlisted = state.isInWishlist(product.id);

      // Star ratings calculation
      let starsHtml = '';
      const fullStars = Math.floor(product.rating || 0);
      const hasHalfStar = (product.rating || 0) % 1 >= 0.5;
      for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
          starsHtml += icons.star('star');
        } else if (i === fullStars + 1 && hasHalfStar) {
          starsHtml += icons.starHalf('star');
        } else {
          starsHtml += icons.star('star star-empty', 'none');
        }
      }

      // Generate HTML structure
      container.innerHTML = `
        <div class="container section">
          <!-- Breadcrumb navigation -->
          <div class="breadcrumb">
            <a href="#/">Home</a>
            <span class="separator">/</span>
            <a href="#/products">Shop</a>
            <span class="separator">/</span>
            <a href="#/products?category=${product.category}">${product.category}</a>
            <span class="separator">/</span>
            <span class="current">${product.title}</span>
          </div>

          <!-- Product Main Details Grid -->
          <div class="product-detail" style="margin-top: var(--space-6);">
            <!-- Left Side: Product Gallery -->
            <div class="product-gallery">
              <div class="product-gallery__main">
                <img id="main-product-image" src="${product.images[0]}" alt="${product.title}">
              </div>
              <div class="product-gallery__thumbs">
                ${product.images.map((img, idx) => `
                  <button class="product-gallery__thumb ${idx === 0 ? 'active' : ''}" data-index="${idx}">
                    <img src="${img}" alt="${product.title} view ${idx + 1}">
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Right Side: Info Panel -->
            <div class="product-info flex-col">
              <span class="product-info__brand">${product.brand || 'Designer Brand'}</span>
              <h1 class="product-info__title">${product.title}</h1>
              
              <div class="product-info__rating">
                <div class="stars">${starsHtml}</div>
                <span class="product-info__rating-count">
                  ${product.rating?.toFixed(2) || '0.0'} rating (${product.reviews?.length || 0} customer reviews)
                </span>
              </div>

              <!-- Price Box -->
              <div class="product-info__price-block">
                <span class="product-info__price">$${currentPrice.toFixed(2)}</span>
                ${discount > 0 ? `
                  <span class="product-info__original-price">$${originalPrice.toFixed(2)}</span>
                  <span class="product-info__discount">Save ${Math.round(discount)}%</span>
                ` : ''}
              </div>

              <p class="product-info__desc">${product.description}</p>

              <!-- Technical / Shipping Specifications -->
              <div class="product-info__meta">
                <div class="product-info__meta-item">
                  <span class="label">Availability:</span>
                  <span class="value" style="color: ${product.stock > 0 ? 'var(--color-success)' : 'var(--color-error)'};">
                    ${product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                  </span>
                </div>
                <div class="product-info__meta-item">
                  <span class="label">SKU:</span>
                  <span class="value">${product.sku || 'N/A'}</span>
                </div>
                <div class="product-info__meta-item">
                  <span class="label">Warranty:</span>
                  <span class="value">${product.warrantyInformation || 'Not Specified'}</span>
                </div>
                <div class="product-info__meta-item">
                  <span class="label">Shipping:</span>
                  <span class="value">${product.shippingInformation || 'Standard Shipping'}</span>
                </div>
              </div>

              <!-- Quantity Selection & Actions -->
              <div class="flex-col gap-4">
                <div class="flex-center gap-4" style="justify-content: flex-start;">
                  <span style="font-weight: var(--font-weight-semibold); font-size: var(--font-size-sm); color: var(--color-text-secondary);">Quantity:</span>
                  <div class="qty-selector">
                    <button id="qty-minus">${icons.minus()}</button>
                    <span id="qty-value">1</span>
                    <button id="qty-plus">${icons.plus()}</button>
                  </div>
                </div>

                <div class="product-info__actions">
                  <button id="add-to-cart-detail" class="btn btn-primary btn-lg flex-center" ${product.stock === 0 ? 'disabled' : ''}>
                    ${icons.cart()} Add to Shopping Cart
                  </button>
                  <button id="wishlist-toggle-detail" class="btn btn-secondary btn-lg flex-center gap-2">
                    ${icons.heart('', isWishlisted ? 'currentColor' : 'none')}
                    <span id="wishlist-btn-text">${isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Reviews Grid Section -->
          <div class="reviews-section">
            <h2 style="margin-bottom: var(--space-6);">Customer Reviews</h2>
            <div id="reviews-list-container">
              ${product.reviews && product.reviews.length > 0 ? product.reviews.map(review => {
                let reviewStars = '';
                for (let r = 1; r <= 5; r++) {
                  reviewStars += icons.star('star', r <= review.rating ? 'currentColor' : 'none');
                }
                const reviewerInitials = review.reviewerName ? review.reviewerName.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';

                return `
                  <div class="review-card">
                    <div class="review-card__header">
                      <div class="review-card__author">
                        <div class="review-card__avatar">${reviewerInitials}</div>
                        <div>
                          <div class="review-card__name">${review.reviewerName}</div>
                          <div class="stars" style="margin-top: 2px;">${reviewStars}</div>
                        </div>
                      </div>
                      <div class="review-card__date">${new Date(review.date).toLocaleDateString()}</div>
                    </div>
                    <p class="review-card__comment">${review.comment}</p>
                  </div>
                `;
              }).join('') : `
                <p style="color: var(--color-text-muted); text-align: center; padding: var(--space-6) 0;">No reviews available for this product yet.</p>
              `}
            </div>
          </div>

          <!-- Related Products Section -->
          <div class="section" style="border-top: 1px solid var(--color-border); margin-top: var(--space-12);">
            <h2 style="margin-bottom: var(--space-6);">You May Also Like</h2>
            <div id="related-products-grid">
              ${Loader.gridSkeletonHtml(4)}
            </div>
          </div>
        </div>
      `;

      // 2. Initialize interactive events
      this.initEvents(container, product);
      
      // 3. Fetch and render related products (same category)
      this.fetchRelatedProducts(container, product);

    } catch (error) {
      console.error('Failed to load product details page:', error);
      container.innerHTML = `
        <div class="container text-center section">
          <div style="font-size: 64px;">⚠️</div>
          <h2>Product Not Found</h2>
          <p style="margin: 16px 0 32px; color: var(--color-text-secondary);">${error.message}</p>
          <a href="#/products" class="btn btn-primary">Return to Shop</a>
        </div>
      `;
    }
  },

  /**
   * Bind event listeners for detail interactive behaviors.
   */
  initEvents(container, product) {
    const mainImg = container.querySelector('#main-product-image');
    const thumbs = container.querySelectorAll('.product-gallery__thumb');
    const qtyMinus = container.querySelector('#qty-minus');
    const qtyPlus = container.querySelector('#qty-plus');
    const qtyValue = container.querySelector('#qty-value');
    const addBtn = container.querySelector('#add-to-cart-detail');
    const wishlistBtn = container.querySelector('#wishlist-toggle-detail');
    const wishlistText = container.querySelector('#wishlist-btn-text');

    let currentQty = 1;

    // Gallery switching
    thumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        // Toggle active states
        thumbs.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');

        // Swap image URL
        const index = parseInt(thumb.getAttribute('data-index'));
        mainImg.src = product.images[index];
      });
    });

    // Quantity selectors
    qtyMinus.addEventListener('click', () => {
      if (currentQty > 1) {
        currentQty--;
        qtyValue.innerText = currentQty;
      }
    });

    qtyPlus.addEventListener('click', () => {
      if (currentQty < product.stock) {
        currentQty++;
        qtyValue.innerText = currentQty;
      }
    });

    // Add to cart click
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        state.addToCart(product, currentQty);
        
        // Success animation
        addBtn.classList.add('btn-success');
        addBtn.innerHTML = `${icons.check()} Added to Cart!`;
        setTimeout(() => {
          addBtn.classList.remove('btn-success');
          addBtn.innerHTML = `${icons.cart()} Add to Shopping Cart`;
        }, 1500);
      });
    }

    // Wishlist toggle click
    if (wishlistBtn) {
      wishlistBtn.addEventListener('click', () => {
        state.toggleWishlist(product);
        const active = state.isInWishlist(product.id);
        wishlistBtn.querySelector('svg').outerHTML = icons.heart('', active ? 'currentColor' : 'none');
        wishlistText.innerText = active ? 'Wishlisted' : 'Add to Wishlist';
      });
    }
  },

  /**
   * Fetch products of same category and render related cards.
   */
  async fetchRelatedProducts(container, currentProduct) {
    const relatedContainer = container.querySelector('#related-products-grid');
    if (!relatedContainer) return;

    try {
      const data = await apiService.getProductsByCategory(currentProduct.category, { limit: 5 });
      // Filter out the current product itself
      const related = data.products.filter(p => p.id !== currentProduct.id).slice(0, 4);

      if (related.length === 0) {
        relatedContainer.innerHTML = `<p style="color: var(--color-text-muted); font-size: var(--font-size-sm);">No similar items found.</p>`;
        return;
      }

      relatedContainer.innerHTML = '';
      const grid = document.createElement('div');
      grid.className = 'grid grid--4';
      grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(240px, 1fr))';

      related.forEach(item => {
        const card = ProductCard.create(item);
        grid.appendChild(card);
      });

      relatedContainer.appendChild(grid);
    } catch (error) {
      console.error('Failed to load related products:', error);
      relatedContainer.innerHTML = `<p style="color: var(--color-text-muted); font-size: var(--font-size-xs);">Failed to load recommendations.</p>`;
    }
  }
};

export default ProductDetail;
