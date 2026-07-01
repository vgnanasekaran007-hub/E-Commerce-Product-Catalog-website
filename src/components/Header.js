import state from '../core/state.js';
import icons from './icons.js';
import router from '../core/router.js';

class Header {
  constructor() {
    this.container = null;
    this.isSubscribed = false;
  }

  /**
   * Render the Header markup into the target container.
   * @param {HTMLElement} container The header-container element.
   */
  render(container) {
    this.container = container;
    
    this.container.innerHTML = `
      <header class="header">
        <div class="container">
          <!-- Logo -->
          <a href="#/" class="logo flex-center gap-2">
            <span style="font-weight: 800; font-size: var(--font-size-xl); letter-spacing: 2px; background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">AURA</span>
          </a>

          <!-- Nav Links (Desktop & Mobile drawer) -->
          <nav class="nav-links flex gap-6">
            <!-- Mobile Close Button -->
            <button class="mobile-close btn btn-ghost btn-icon flex-center" style="display: none; position: absolute; top: var(--space-4); right: var(--space-4);">
              ${icons.close()}
            </button>
            <a href="#/">Home</a>
            <a href="#/products">Shop</a>
            <a href="#/about">About</a>
            <a href="#/contact">Contact</a>
          </nav>

          <!-- Search & Badges -->
          <div class="header-actions flex-center gap-4">
            <!-- Search bar -->
            <form id="global-search-form" class="input-group search-bar-desktop" style="max-width: 240px;">
              <span class="input-icon">${icons.search()}</span>
              <input type="text" class="input input--search" placeholder="Search products..." id="global-search-input">
            </form>

            <!-- Wishlist -->
            <a href="#/wishlist" class="btn btn-ghost btn-icon flex-center" aria-label="Wishlist">
              ${icons.heart()}
              <span class="badge badge--primary" id="wishlist-badge" style="position: absolute; top: 0; right: 0; display: none;">0</span>
            </a>

            <!-- Cart -->
            <a href="#/cart" class="btn btn-ghost btn-icon flex-center" aria-label="Cart">
              ${icons.cart()}
              <span class="badge" id="cart-badge" style="position: absolute; top: 0; right: 0; display: none;">0</span>
            </a>

            <!-- Mobile Menu Toggle -->
            <button class="menu-toggle btn btn-ghost btn-icon flex-center" style="display: none;" aria-label="Open menu">
              ${icons.menu()}
            </button>
          </div>
        </div>
      </header>
    `;

    this.initEvents();
    
    // Subscribe to state changes if not already
    if (!this.isSubscribed) {
      state.subscribe(currentState => this.updateBadges(currentState));
      this.isSubscribed = true;
    }
  }

  /**
   * Bind event listeners for menu toggles, scrolling and search.
   */
  initEvents() {
    const menuToggle = this.container.querySelector('.menu-toggle');
    const closeBtn = this.container.querySelector('.mobile-close');
    const navLinks = this.container.querySelector('.nav-links');
    const overlay = document.getElementById('mobile-overlay');
    const searchForm = this.container.querySelector('#global-search-form');
    const searchInput = this.container.querySelector('#global-search-input');
    const header = this.container.querySelector('.header');

    // Sticky Scroll Effect
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });

    // Mobile Hamburger Toggle
    const openMenu = () => {
      navLinks.classList.add('open');
      overlay.classList.add('active');
    };

    const closeMenu = () => {
      navLinks.classList.remove('open');
      overlay.classList.remove('active');
    };

    if (menuToggle) menuToggle.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (overlay) overlay.addEventListener('click', closeMenu);

    // Global Search submit handler
    if (searchForm) {
      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
          router.navigate(`/products?search=${encodeURIComponent(query)}`);
          searchInput.value = ''; // Reset after submit
          closeMenu();
        }
      });
    }
  }

  /**
   * Update badge counts in real time based on state updates.
   */
  updateBadges(currentState) {
    const cartBadge = this.container.querySelector('#cart-badge');
    const wishlistBadge = this.container.querySelector('#wishlist-badge');

    if (cartBadge) {
      if (currentState.cartCount > 0) {
        cartBadge.innerText = currentState.cartCount;
        cartBadge.style.display = 'flex';
      } else {
        cartBadge.style.display = 'none';
      }
    }

    if (wishlistBadge) {
      if (currentState.wishlistCount > 0) {
        wishlistBadge.innerText = currentState.wishlistCount;
        wishlistBadge.style.display = 'flex';
      } else {
        wishlistBadge.style.display = 'none';
      }
    }
  }
}

export const header = new Header();
export default header;
