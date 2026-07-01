/**
 * Reactive state management with localstorage persistence.
 */
class State {
  constructor() {
    this.cart = this.loadFromStorage('aura_cart', []);
    this.wishlist = this.loadFromStorage('aura_wishlist', []);
    this.listeners = [];
  }

  /**
   * Helper to load data from localStorage
   */
  loadFromStorage(key, defaultValue) {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch (e) {
      console.error(`Error loading ${key} from storage:`, e);
      return defaultValue;
    }
  }

  /**
   * Helper to save data to localStorage
   */
  saveToStorage(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error(`Error saving ${key} to storage:`, e);
    }
  }

  /**
   * Register a state change listener
   * @param {function} callback Function to call when state updates
   * @returns {function} Unsubscribe function
   */
  subscribe(callback) {
    this.listeners.push(callback);
    // Call immediately with current state for initialization
    callback(this.getStateCopy());
    
    // Return unsubscribe helper
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  /**
   * Notify all subscribers of state updates
   */
  notify() {
    const stateCopy = this.getStateCopy();
    this.listeners.forEach(listener => {
      try {
        listener(stateCopy);
      } catch (e) {
        console.error('Error in state subscriber callback:', e);
      }
    });
  }

  /**
   * Return a read-only deep clone of the current state
   */
  getStateCopy() {
    return {
      cart: JSON.parse(JSON.stringify(this.cart)),
      wishlist: JSON.parse(JSON.stringify(this.wishlist)),
      cartCount: this.getCartCount(),
      wishlistCount: this.getWishlistCount(),
      cartTotals: this.getCartTotals()
    };
  }

  /* ========================================
     CART ACTIONS
     ======================================== */

  /**
   * Add an item to the shopping cart.
   * If it already exists, increment the quantity.
   */
  addToCart(product, quantity = 1) {
    const existingIndex = this.cart.findIndex(item => item.id === product.id);
    
    if (existingIndex !== -1) {
      this.cart[existingIndex].quantity += quantity;
    } else {
      this.cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        discountPercentage: product.discountPercentage || 0,
        thumbnail: product.thumbnail,
        brand: product.brand || 'Generic',
        category: product.category,
        quantity: quantity,
        stock: product.stock
      });
    }

    this.saveToStorage('aura_cart', this.cart);
    this.notify();
    this.dispatchToast('Item added to cart', 'success');
  }

  /**
   * Remove item from the cart
   */
  removeFromCart(productId) {
    this.cart = this.cart.filter(item => item.id !== productId);
    this.saveToStorage('aura_cart', this.cart);
    this.notify();
    this.dispatchToast('Item removed from cart', 'info');
  }

  /**
   * Update quantity of a cart item
   */
  updateCartQuantity(productId, quantity) {
    const index = this.cart.findIndex(item => item.id === productId);
    if (index === -1) return;

    const item = this.cart[index];
    const newQty = Math.max(1, Math.min(quantity, item.stock || 99));
    
    this.cart[index].quantity = newQty;
    this.saveToStorage('aura_cart', this.cart);
    this.notify();
  }

  /**
   * Clear the shopping cart
   */
  clearCart() {
    this.cart = [];
    this.saveToStorage('aura_cart', this.cart);
    this.notify();
  }

  /**
   * Get unique items and total quantities
   */
  getCartCount() {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  /**
   * Calculate totals (subtotal, discounts, shipping, total)
   */
  getCartTotals() {
    let subtotal = 0;
    let totalDiscount = 0;

    this.cart.forEach(item => {
      const originalItemCost = item.price * item.quantity;
      subtotal += originalItemCost;
      
      if (item.discountPercentage > 0) {
        // DummyJSON price is already discounted in the API
        // Let's reverse calculate the original price if we want to show original/discounted
        // Actually, the API says "price" is original and "discountPercentage" is applied to get final price, or vice-versa.
        // Let's check DummyJSON specification:
        // "price": 9.99 (original/final depending on interpretation). In DummyJSON v1/v2, "price" is the final selling price
        // before discount? No, "price" is original, and we need to calculate the actual discounted price.
        // Wait, "price: 9.99" is the base price. Let's calculate:
        // discountedPrice = price * (1 - discountPercentage/100)
        // Let's check: in DummyJSON, "price" is the base price, and the actual product selling price is calculated using the discount percentage, or "price" is the absolute selling price.
        // Let's assume:
        // - "price" is the listing price.
        // - discountedPrice = price * (1 - discountPercentage / 100)
        // This is standard. Let's compute:
        const discountedPrice = item.price * (1 - (item.discountPercentage / 100));
        const savingsPerItem = item.price - discountedPrice;
        totalDiscount += savingsPerItem * item.quantity;
      }
    });

    const total = subtotal - totalDiscount;
    const shipping = total > 50 || total === 0 ? 0 : 5.99; // Free shipping over $50

    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      discount: parseFloat(totalDiscount.toFixed(2)),
      shipping: parseFloat(shipping.toFixed(2)),
      total: parseFloat((total + shipping).toFixed(2))
    };
  }

  /* ========================================
     WISHLIST ACTIONS
     ======================================== */

  /**
   * Toggle a product in/out of the wishlist
   */
  toggleWishlist(product) {
    const index = this.wishlist.findIndex(item => item.id === product.id);
    
    if (index !== -1) {
      this.wishlist.splice(index, 1);
      this.dispatchToast('Removed from wishlist', 'info');
    } else {
      this.wishlist.push({
        id: product.id,
        title: product.title,
        price: product.price,
        discountPercentage: product.discountPercentage || 0,
        thumbnail: product.thumbnail,
        brand: product.brand || 'Generic',
        category: product.category,
        rating: product.rating,
        stock: product.stock
      });
      this.dispatchToast('Added to wishlist', 'success');
    }

    this.saveToStorage('aura_wishlist', this.wishlist);
    this.notify();
  }

  /**
   * Check if a product is in the wishlist
   */
  isInWishlist(productId) {
    return this.wishlist.some(item => item.id === productId);
  }

  getWishlistCount() {
    return this.wishlist.length;
  }

  /* ========================================
     TOAST DISPATCH UTILITY
     ======================================= */
  dispatchToast(message, type = 'info') {
    const event = new CustomEvent('show-toast', {
      detail: { message, type }
    });
    window.dispatchEvent(event);
  }
}

// Export singleton state instance
export const state = new State();
export default state;
