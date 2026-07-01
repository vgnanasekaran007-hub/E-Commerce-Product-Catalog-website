import icons from './icons.js';

class ToastManager {
  constructor() {
    this.container = null;
  }

  /**
   * Initialize the toast listener
   */
  init() {
    this.container = document.getElementById('toast-container');
    if (!this.container) {
      console.warn('Toast container not found in DOM.');
      return;
    }

    // Register global event listener
    window.removeEventListener('show-toast', this.handleToastEvent);
    window.addEventListener('show-toast', (e) => this.handleToastEvent(e));
  }

  /**
   * Handle the custom show-toast event
   */
  handleToastEvent(event) {
    const { message, type } = event.detail;
    this.show(message, type);
  }

  /**
   * Programmatically display a toast notification
   * @param {string} message Text message.
   * @param {string} type 'success' | 'error' | 'info'
   */
  show(message, type = 'info') {
    if (!this.container) {
      this.container = document.getElementById('toast-container');
    }
    if (!this.container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    
    let iconHtml = icons.info('toast-icon');
    if (type === 'success') {
      iconHtml = icons.check('toast-icon');
    } else if (type === 'error') {
      iconHtml = icons.info('toast-icon'); // Error icon could be similar or warning
    }

    toast.innerHTML = `
      ${iconHtml}
      <span class="toast-message">${message}</span>
    `;

    this.container.appendChild(toast);

    // Auto remove toast after 3 seconds
    setTimeout(() => {
      toast.classList.add('removing');
      toast.addEventListener('animationend', () => {
        toast.remove();
      });
    }, 3000);
  }
}

export const toast = new ToastManager();
export default toast;
