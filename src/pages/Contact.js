import state from '../core/state.js';
import icons from '../components/icons.js';

export const Contact = {
  async render(container, params) {
    container.innerHTML = `
      <div class="container section">
        <!-- Breadcrumbs -->
        <div class="breadcrumb">
          <a href="#/">Home</a>
          <span class="separator">/</span>
          <span class="current">Contact Us</span>
        </div>

        <h1 style="margin-top: var(--space-4); margin-bottom: var(--space-8);">Get in Touch</h1>

        <div class="contact-grid">
          <!-- Left side: Validated Form -->
          <form id="contact-form" class="contact-form" novalidate>
            <h2 class="contact-form__title">Send us a Message</h2>
            <p class="contact-form__desc">Have any questions about custom orders, brand listings, or shipments? Fill out the form and our design desk will contact you.</p>
            
            <!-- Full Name -->
            <div class="form-group">
              <label for="contact-name">Full Name</label>
              <input type="text" id="contact-name" class="input" placeholder="e.g. John Doe" required>
              <div id="error-name" class="error" style="display: none;"></div>
            </div>

            <!-- Email Address -->
            <div class="form-group">
              <label for="contact-email">Email Address</label>
              <input type="email" id="contact-email" class="input" placeholder="e.g. john@example.com" required>
              <div id="error-email" class="error" style="display: none;"></div>
            </div>

            <!-- Subject -->
            <div class="form-group">
              <label for="contact-subject">Subject</label>
              <input type="text" id="contact-subject" class="input" placeholder="What is this regarding?" required>
              <div id="error-subject" class="error" style="display: none;"></div>
            </div>

            <!-- Message -->
            <div class="form-group">
              <label for="contact-message">Message</label>
              <textarea id="contact-message" class="input" placeholder="Write your message here..." required></textarea>
              <div id="error-message" class="error" style="display: none;"></div>
            </div>

            <!-- Submit Button -->
            <button type="submit" class="btn btn-primary btn-lg flex-center" style="width: 100%; margin-top: var(--space-4);">
              Send Message
            </button>
          </form>

          <!-- Right side: Contact Details -->
          <div class="contact-info-cards">
            <div class="contact-info-card">
              <div class="contact-info-card__icon">📍</div>
              <div>
                <h3 class="contact-info-card__title">Headquarters</h3>
                <p class="contact-info-card__text">888 Electric Ave, Suite 100<br>San Francisco, CA 94103</p>
              </div>
            </div>

            <div class="contact-info-card">
              <div class="contact-info-card__icon">📞</div>
              <div>
                <h3 class="contact-info-card__title">Phone Enquiries</h3>
                <p class="contact-info-card__text">+1 (800) 555-AURA (General Desk)<br>Mon-Fri, 9:00 AM - 6:00 PM PST</p>
              </div>
            </div>

            <div class="contact-info-card">
              <div class="contact-info-card__icon">✉️</div>
              <div>
                <h3 class="contact-info-card__title">Email Desk</h3>
                <p class="contact-info-card__text">v.gnanasekaran007@gmail.com (Direct)<br>support@aurashop.com (Support)</p>
              </div>
            </div>

            <!-- Mock Map Container for modern premium touch -->
            <div style="height: 200px; border-radius: var(--radius-xl); border: 1px solid var(--color-border); background: var(--color-surface); overflow: hidden; display: flex; align-items: center; justify-content: center; position: relative;">
              <div style="text-align: center; color: var(--color-text-muted); font-size: var(--font-size-sm); z-index: 1;">
                🌐 AURA Satellite Location SF<br>
                <span style="font-size: var(--font-size-xs);">Interactive navigation loaded offline</span>
              </div>
              <!-- Futuristic grid pattern visual helper -->
              <div style="position: absolute; inset: 0; opacity: 0.05; background-image: radial-gradient(var(--color-primary) 1px, transparent 1px); background-size: 20px 20px;"></div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.initEvents(container);
  },

  /**
   * Initialize validation events
   */
  initEvents(container) {
    const form = container.querySelector('#contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Grab inputs
      const nameInput = form.querySelector('#contact-name');
      const emailInput = form.querySelector('#contact-email');
      const subjectInput = form.querySelector('#contact-subject');
      const messageInput = form.querySelector('#contact-message');

      // Grabbing error displays
      const nameErr = form.querySelector('#error-name');
      const emailErr = form.querySelector('#error-email');
      const subjectErr = form.querySelector('#error-subject');
      const messageErr = form.querySelector('#error-message');

      // Reset errors
      let isValid = true;
      [nameErr, emailErr, subjectErr, messageErr].forEach(node => {
        node.style.display = 'none';
        node.innerText = '';
      });

      // Name check
      const name = nameInput.value.trim();
      if (!name) {
        isValid = false;
        nameErr.innerText = 'Full Name is required.';
        nameErr.style.display = 'block';
      } else if (name.length < 3) {
        isValid = false;
        nameErr.innerText = 'Name must be at least 3 characters.';
        nameErr.style.display = 'block';
      }

      // Email check
      const email = emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email) {
        isValid = false;
        emailErr.innerText = 'Email Address is required.';
        emailErr.style.display = 'block';
      } else if (!emailRegex.test(email)) {
        isValid = false;
        emailErr.innerText = 'Please enter a valid email address.';
        emailErr.style.display = 'block';
      }

      // Subject check
      const subject = subjectInput.value.trim();
      if (!subject) {
        isValid = false;
        subjectErr.innerText = 'Subject is required.';
        subjectErr.style.display = 'block';
      }

      // Message check
      const message = messageInput.value.trim();
      if (!message) {
        isValid = false;
        messageErr.innerText = 'Message is required.';
        messageErr.style.display = 'block';
      } else if (message.length < 10) {
        isValid = false;
        messageErr.innerText = 'Message must be at least 10 characters.';
        messageErr.style.display = 'block';
      }

      // Submit if valid
      if (isValid) {
        state.dispatchToast('Message sent successfully! We will get back to you shortly.', 'success');
        form.reset();
      } else {
        state.dispatchToast('Please fix the errors before submitting the message.', 'error');
      }
    });
  }
};

export default Contact;
