import state from '../core/state.js';
import icons from '../components/icons.js';
import router from '../core/router.js';

export const Cart = {
  container: null,
  unsubscribe: null,

  async render(container, params) {
    this.container = container;
    
    // Unsubscribe from previous page instances to avoid memory leaks
    if (this.unsubscribe) {
      this.unsubscribe();
    }

    // Subscribe to state updates to render the Cart page reactively
    this.unsubscribe = state.subscribe((stateCopy) => {
      this.renderCartView(stateCopy);
    });
  },

  /**
   * Render cart items and totals. Called reactively when cart changes.
   */
  renderCartView(stateCopy) {
    const { cart, cartTotals } = stateCopy;

    if (cart.length === 0) {
      this.container.innerHTML = `
        <div class="container section">
          <div class="breadcrumb">
            <a href="#/">Home</a>
            <span class="separator">/</span>
            <span class="current">Shopping Cart</span>
          </div>
          
          <div class="empty-state" style="margin-top: var(--space-8);">
            <div class="empty-state__icon">🛒</div>
            <h2 class="empty-state__title">Your Cart is Empty</h2>
            <p class="empty-state__text">Looks like you haven't added any luxury items to your cart yet. Discover our catalog to get started!</p>
            <a href="#/products" class="btn btn-primary btn-pill btn-lg">Explore Shop</a>
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
          <span class="current">Shopping Cart</span>
        </div>

        <h1 style="margin-top: var(--space-4); margin-bottom: var(--space-8);">Shopping Cart</h1>

        <div class="cart-layout">
          <!-- Cart List -->
          <div class="cart-items">
            ${cart.map(item => {
              const discount = item.discountPercentage || 0;
              const discountedPrice = discount > 0 ? (item.price * (1 - discount / 100)) : item.price;
              const itemTotal = discountedPrice * item.quantity;
              
              return `
                <div class="cart-item" data-id="${item.id}">
                  <div class="cart-item__image">
                    <img src="${item.thumbnail}" alt="${item.title}" loading="lazy">
                  </div>
                  <div class="cart-item__info">
                    <h3 class="cart-item__title" onclick="window.location.hash='#/product/${item.id}'">${item.title}</h3>
                    <span class="cart-item__brand">Brand: ${item.brand}</span>
                    
                    <div class="cart-item__bottom">
                      <div class="qty-selector">
                        <button class="qty-btn-minus" data-id="${item.id}" data-qty="${item.quantity}">${icons.minus()}</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn-plus" data-id="${item.id}" data-qty="${item.quantity}" data-stock="${item.stock}">${icons.plus()}</button>
                      </div>
                      
                      <div class="flex-col text-right gap-1">
                        <span class="cart-item__price">$${discountedPrice.toFixed(2)}</span>
                        ${discount > 0 ? `
                          <span style="font-size: var(--font-size-xs); color: var(--color-text-muted); text-decoration: line-through;">$${item.price.toFixed(2)}</span>
                        ` : ''}
                        <span style="font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); color: var(--color-primary-light); margin-top: 4px;">
                          Total: $${itemTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button class="cart-item__remove" data-id="${item.id}" aria-label="Remove item">
                    ${icons.trash()}
                  </button>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Order Summary Side Panel -->
          <aside class="cart-summary">
            <h2 class="cart-summary__title">Order Summary</h2>
            <div class="flex-col gap-4">
              <div class="cart-summary__row">
                <span class="label">Subtotal</span>
                <span class="value">$${cartTotals.subtotal.toFixed(2)}</span>
              </div>
              <div class="cart-summary__row">
                <span class="label">Discount Savings</span>
                <span class="value" style="color: var(--color-success);">- $${cartTotals.discount.toFixed(2)}</span>
              </div>
              <div class="cart-summary__row">
                <span class="label">Shipping Cost</span>
                <span class="value">${cartTotals.shipping > 0 ? `$${cartTotals.shipping.toFixed(2)}` : 'FREE'}</span>
              </div>
              
              <div class="cart-summary__total">
                <span>Grand Total</span>
                <span>$${cartTotals.total.toFixed(2)}</span>
              </div>

              <button id="checkout-btn" class="btn btn-primary btn-lg flex-center">
                Proceed to Checkout
              </button>
              
              <a href="#/products" class="btn btn-secondary flex-center">
                Continue Shopping
              </a>
            </div>
          </aside>
        </div>
      </div>
    `;

    this.initEvents();
  },

  /**
   * Bind events on list actions via delegation to avoid listener leakage.
   */
  initEvents() {
    // 1. Quantity Adjustments & Removals via delegation
    const cartItemsWrapper = this.container.querySelector('.cart-items');
    if (cartItemsWrapper) {
      cartItemsWrapper.addEventListener('click', (e) => {
        // Decrease quantity
        const minusBtn = e.target.closest('.qty-btn-minus');
        if (minusBtn) {
          const id = parseInt(minusBtn.getAttribute('data-id'));
          const currentQty = parseInt(minusBtn.getAttribute('data-qty'));
          state.updateCartQuantity(id, currentQty - 1);
          return;
        }

        // Increase quantity
        const plusBtn = e.target.closest('.qty-btn-plus');
        if (plusBtn) {
          const id = parseInt(plusBtn.getAttribute('data-id'));
          const currentQty = parseInt(plusBtn.getAttribute('data-qty'));
          const stock = parseInt(plusBtn.getAttribute('data-stock')) || 99;
          state.updateCartQuantity(id, currentQty + 1);
          return;
        }

        // Remove item
        const removeBtn = e.target.closest('.cart-item__remove');
        if (removeBtn) {
          const id = parseInt(removeBtn.getAttribute('data-id'));
          state.removeFromCart(id);
          return;
        }
      });
    }

    // 2. Checkout click handler
    const checkoutBtn = this.container.querySelector('#checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        // Mock Checkout order submission
        state.dispatchToast('Order submitted successfully! Thank you for shopping with AURA.', 'success');
        state.clearCart();
        router.navigate('/');
      });
    }
  }
};

export default Cart;
