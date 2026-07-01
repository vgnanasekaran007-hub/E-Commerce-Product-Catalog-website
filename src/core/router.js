/**
 * Hash-based client-side router for Single Page Application.
 */
class Router {
  constructor() {
    this.routes = [];
    this.currentRoute = null;
    this.rootContainer = null;
    
    // Bind event handlers
    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('load', () => this.handleRoute());
  }

  /**
   * Initialize the router with a container element.
   * @param {HTMLElement} container The main container to render pages.
   */
  init(container) {
    this.rootContainer = container;
    this.handleRoute();
  }

  /**
   * Register a route with its associated page handler.
   * @param {string} path Route path (e.g., '/', '/products', '/product/:id')
   * @param {object} page Page component exposing an async render(container, params) method.
   */
  add(path, page) {
    // Convert path pattern to regular expression
    // e.g., '/product/:id' -> /^\/product\/([^/]+)$/
    const paramNames = [];
    const regexPath = path
      .replace(/([:*])(\w+)/g, (full, type, name) => {
        paramNames.push(name);
        return '([^/]+)';
      })
      .replace(/\//g, '\\/');

    const regex = new RegExp(`^${regexPath}$`);
    
    this.routes.push({
      path,
      regex,
      paramNames,
      page
    });
  }

  /**
   * Get current hash path (stripping the leading '#' and default-routing empty hashes)
   */
  getHashPath() {
    const hash = window.location.hash || '#/';
    // Strip hash character and dynamic query params if any
    let path = hash.substring(1) || '/';
    // Remove query string if any for route matching
    const queryIndex = path.indexOf('?');
    if (queryIndex !== -1) {
      path = path.substring(0, queryIndex);
    }
    return path;
  }

  /**
   * Get query parameters from the current URL hash
   */
  getQueryParams() {
    const hash = window.location.hash;
    const queryIndex = hash.indexOf('?');
    if (queryIndex === -1) return {};

    const queryString = hash.substring(queryIndex + 1);
    const params = {};
    const pairs = queryString.split('&');
    
    for (const pair of pairs) {
      const [key, value] = pair.split('=');
      if (key) {
        params[decodeURIComponent(key)] = decodeURIComponent(value || '');
      }
    }
    return params;
  }

  /**
   * Match the path against registered routes.
   * @param {string} path The hash path.
   */
  match(path) {
    for (const route of this.routes) {
      const match = path.match(route.regex);
      if (match) {
        const params = {};
        // Extract parameter values
        route.paramNames.forEach((name, index) => {
          params[name] = match[index + 1];
        });
        return { route, params };
      }
    }
    return null;
  }

  /**
   * Handle route change, match route, and render page.
   */
  async handleRoute() {
    if (!this.rootContainer) return;

    const path = this.getHashPath();
    const matchResult = this.match(path);

    // Scroll to top on route change
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Close any open mobile menus/overlays automatically
    const navLinks = document.querySelector('.nav-links');
    const overlay = document.getElementById('mobile-overlay');
    if (navLinks && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
    }
    if (overlay && overlay.classList.contains('active')) {
      overlay.classList.remove('active');
    }

    if (matchResult) {
      const { route, params } = matchResult;
      
      // Combine URL params with query params
      const queryParams = this.getQueryParams();
      const allParams = { ...params, ...queryParams };
      
      this.currentRoute = route.path;
      
      // Update active state on nav links
      this.updateActiveNavLinks(route.path);
      
      try {
        // Add enter transition animation
        this.rootContainer.classList.remove('page-enter');
        void this.rootContainer.offsetWidth; // Force reflow
        this.rootContainer.classList.add('page-enter');

        // Render page
        await route.page.render(this.rootContainer, allParams);
      } catch (error) {
        console.error(`Error rendering route ${route.path}:`, error);
        this.renderError(error);
      }
    } else {
      // 404 Route Not Found
      const notFoundRoute = this.routes.find(r => r.path === '/404');
      if (notFoundRoute) {
        this.currentRoute = '/404';
        this.updateActiveNavLinks('/404');
        await notFoundRoute.page.render(this.rootContainer, {});
      } else {
        this.rootContainer.innerHTML = `
          <div class="container not-found">
            <h1 class="not-found__code">404</h1>
            <h2 class="not-found__title">Page Not Found</h2>
            <p class="not-found__text">The page you are looking for does not exist or has been moved.</p>
            <a href="#/" class="btn btn-primary">Go Back Home</a>
          </div>
        `;
      }
    }
  }

  /**
   * Programmatically navigate to path.
   * @param {string} path The hash path (e.g., '/products', '/product/12')
   */
  navigate(path) {
    window.location.hash = path;
  }

  /**
   * Update active class on nav links.
   * @param {string} currentPath Path pattern that matched.
   */
  updateActiveNavLinks(currentPath) {
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      
      const linkPath = href.substring(1).split('?')[0]; // Strip '#' and query params
      const mappedCurrentPath = currentPath.split('?')[0];
      
      // Highlight home if matching, or matching the path prefix
      if (linkPath === '/' && mappedCurrentPath === '/') {
        link.classList.add('active');
      } else if (linkPath !== '/' && mappedCurrentPath.startsWith(linkPath)) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  /**
   * Render an error fallback screen if a page fails to load.
   */
  renderError(error) {
    this.rootContainer.innerHTML = `
      <div class="container text-center section">
        <div style="font-size: 64px; color: var(--color-error); margin-bottom: 24px;">⚠️</div>
        <h2>Something went wrong</h2>
        <p style="margin: 16px 0 32px; color: var(--color-text-secondary);">${error.message || 'An error occurred while loading this page.'}</p>
        <button onclick="window.location.reload()" class="btn btn-primary">Retry</button>
      </div>
    `;
  }
}

// Export singleton router instance
export const router = new Router();
export default router;
