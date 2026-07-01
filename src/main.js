// ── STYLES ──
import './css/variables.css';
import './css/base.css';
import './css/layout.css';
import './css/components.css';
import './css/pages.css';
import './css/responsive.css';

// ── CORE MODULES ──
import router from './core/router.js';
import toast from './components/Toast.js';

// ── COMPONENTS ──
import header from './components/Header.js';
import footer from './components/Footer.js';

// ── PAGES ──
import Home from './pages/Home.js';
import Products from './pages/Products.js';
import ProductDetail from './pages/ProductDetail.js';
import Cart from './pages/Cart.js';
import Wishlist from './pages/Wishlist.js';
import About from './pages/About.js';
import Contact from './pages/Contact.js';
import NotFound from './pages/NotFound.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize global UI modules
  toast.init();

  // 2. Render static layout containers
  const headerContainer = document.getElementById('header-container');
  const footerContainer = document.getElementById('footer-container');
  
  if (headerContainer) header.render(headerContainer);
  if (footerContainer) footer.render(footerContainer);

  // 3. Register route configurations
  router.add('/', Home);
  router.add('/products', Products);
  router.add('/product/:id', ProductDetail);
  router.add('/cart', Cart);
  router.add('/wishlist', Wishlist);
  router.add('/about', About);
  router.add('/contact', Contact);
  router.add('/404', NotFound);

  // 4. Initialize routing in the main container
  const mainContainer = document.getElementById('main-container');
  if (mainContainer) {
    router.init(mainContainer);
  }
});
