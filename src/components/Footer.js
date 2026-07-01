class Footer {
  render(container) {
    container.innerHTML = `
      <footer class="footer">
        <div class="container">
          <div class="footer-grid">
            <!-- Brand Column -->
            <div class="footer-brand flex-col gap-4">
              <span style="font-weight: 800; font-size: var(--font-size-xl); letter-spacing: 2px; background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">AURA</span>
              <p style="font-size: var(--font-size-sm); line-height: var(--line-height-relaxed);">
                Experience luxury e-commerce with handpicked products, persistent shopping support, and a lightning-fast experience.
              </p>
              <div class="social-links flex gap-3" style="font-size: 18px; margin-top: var(--space-2);">
                <a href="#" aria-label="Facebook">📘</a>
                <a href="#" aria-label="Twitter">🐦</a>
                <a href="#" aria-label="Instagram">📸</a>
                <a href="#" aria-label="LinkedIn">💼</a>
              </div>
            </div>

            <!-- Shop Links Column -->
            <div class="footer-column flex-col gap-3">
              <h4 style="font-size: var(--font-size-sm); text-transform: uppercase; letter-spacing: var(--letter-spacing-wide); color: var(--color-text);">Shop</h4>
              <ul class="flex-col gap-2" style="font-size: var(--font-size-sm);">
                <li><a href="#/products">All Products</a></li>
                <li><a href="#/products?category=beauty">Beauty & Cosmetics</a></li>
                <li><a href="#/products?category=smartphones">Smartphones</a></li>
                <li><a href="#/products?category=groceries">Groceries</a></li>
              </ul>
            </div>

            <!-- Customer Service Column -->
            <div class="footer-column flex-col gap-3">
              <h4 style="font-size: var(--font-size-sm); text-transform: uppercase; letter-spacing: var(--letter-spacing-wide); color: var(--color-text);">Info</h4>
              <ul class="flex-col gap-2" style="font-size: var(--font-size-sm);">
                <li><a href="#/about">About Us</a></li>
                <li><a href="#/contact">Contact Us</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
              </ul>
            </div>

            <!-- Newsletter Column -->
            <div class="footer-column flex-col gap-3">
              <h4 style="font-size: var(--font-size-sm); text-transform: uppercase; letter-spacing: var(--letter-spacing-wide); color: var(--color-text);">Newsletter</h4>
              <p style="font-size: var(--font-size-xs); line-height: var(--line-height-relaxed);">
                Subscribe to receive special offers, product launches, and shopping news.
              </p>
              <form id="newsletter-form" class="flex gap-2" style="margin-top: var(--space-2);">
                <input type="email" class="input" placeholder="Your email..." required style="padding: var(--space-2) var(--space-3); font-size: var(--font-size-xs);">
                <button type="submit" class="btn btn-primary btn-sm" style="padding: var(--space-2) var(--space-4);">Join</button>
              </form>
            </div>
          </div>

          <div class="footer-bottom">
            <p>&copy; ${new Date().getFullYear()} AURA Inc. Built by <a href="https://github.com/vgnanasekaran007-hub" target="_blank" style="color: var(--color-primary-light);">Gnanasekaran V</a>.</p>
            <div class="flex gap-4">
              <span>Secure Payments</span>
              <span>•</span>
              <span>Fast Shipping</span>
            </div>
          </div>
        </div>
      </footer>
    `;

    this.initEvents(container);
  }

  initEvents(container) {
    const newsletterForm = container.querySelector('#newsletter-form');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = newsletterForm.querySelector('input');
        const email = emailInput.value.trim();
        if (email) {
          // Trigger a custom success event or alert
          const event = new CustomEvent('show-toast', {
            detail: { message: `Subscribed successfully with ${email}!`, type: 'success' }
          });
          window.dispatchEvent(event);
          emailInput.value = '';
        }
      });
    }
  }
}

export const footer = new Footer();
export default footer;
