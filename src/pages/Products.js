import apiService from '../services/api.js';
import ProductCard from '../components/ProductCard.js';
import Loader from '../components/Loader.js';
import router from '../core/router.js';
import icons from '../components/icons.js';

export const Products = {
  // Page state
  state: {
    category: '',
    search: '',
    sort: 'featured',
    limit: 12,
    skip: 0,
    products: [],
    total: 0,
    loading: false
  },

  async render(container, params) {
    // 1. Sync parameters from the URL route
    this.state.category = params.category || '';
    this.state.search = params.search || '';
    this.state.sort = params.sort || 'featured';
    
    // Reset loaded list on filter changes (if skip is 0)
    this.state.skip = 0;
    this.state.products = [];
    
    // Render base layout container
    container.innerHTML = `
      <div class="container section">
        <!-- Breadcrumbs -->
        <div class="breadcrumb">
          <a href="#/">Home</a>
          <span class="separator">/</span>
          <span class="current">Shop</span>
        </div>

        <div class="layout-sidebar" style="margin-top: var(--space-6);">
          <!-- Sidebar Filters -->
          <aside class="sidebar card flex-col gap-6" style="background: var(--color-surface); padding: var(--space-6); border-radius: var(--radius-xl); border: 1px solid var(--color-border);">
            <!-- Search Widget -->
            <div class="flex-col gap-2">
              <h3 style="font-size: var(--font-size-base); font-weight: var(--font-weight-semibold);">Search</h3>
              <div class="input-group">
                <span class="input-icon">${icons.search()}</span>
                <input type="text" id="sidebar-search-input" class="input input--search" style="padding-left: var(--space-10);" placeholder="Keyword search..." value="${this.state.search}">
              </div>
            </div>

            <!-- Categories Widget -->
            <div class="flex-col gap-2">
              <h3 style="font-size: var(--font-size-base); font-weight: var(--font-weight-semibold);">Categories</h3>
              <div id="sidebar-categories" class="flex-col gap-1" style="max-height: 250px; overflow-y: auto; padding-right: 4px;">
                <div class="skeleton" style="height: 20px; margin-bottom: 8px;"></div>
                <div class="skeleton" style="height: 20px; margin-bottom: 8px;"></div>
                <div class="skeleton" style="height: 20px; margin-bottom: 8px;"></div>
              </div>
            </div>

            <!-- Sort Widget (Mobile is toolbar, desktop sidebar fallback) -->
            <div class="flex-col gap-2">
              <h3 style="font-size: var(--font-size-base); font-weight: var(--font-weight-semibold);">Sort By</h3>
              <select id="sidebar-sort-select" class="select" style="width: 100%;">
                <option value="featured" ${this.state.sort === 'featured' ? 'selected' : ''}>Featured</option>
                <option value="price-asc" ${this.state.sort === 'price-asc' ? 'selected' : ''}>Price: Low to High</option>
                <option value="price-desc" ${this.state.sort === 'price-desc' ? 'selected' : ''}>Price: High to Low</option>
                <option value="rating" ${this.state.sort === 'rating' ? 'selected' : ''}>Top Rated</option>
                <option value="title" ${this.state.sort === 'title' ? 'selected' : ''}>Name A-Z</option>
              </select>
            </div>

            <!-- Reset Filters -->
            <button id="clear-filters-btn" class="btn btn-secondary btn-sm flex-center gap-2" style="width: 100%;">
              Clear All Filters
            </button>
          </aside>

          <!-- Main Product Area -->
          <div>
            <!-- Toolbar -->
            <div class="products-toolbar">
              <div class="products-toolbar__left">
                <span class="products-count" id="products-count-text">Loading catalog items...</span>
              </div>
            </div>

            <!-- Active tags indicator -->
            <div class="filter-tags" id="active-filter-tags"></div>

            <!-- Products Grid Container -->
            <div id="products-grid-wrapper">
              ${Loader.gridSkeletonHtml(this.state.limit)}
            </div>

            <!-- Pagination Load More -->
            <div class="load-more-wrap" id="load-more-container" style="display: none;">
              <button id="load-more-btn" class="btn btn-primary">Load More Products</button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.initElements(container);
    this.initEvents(container);

    // Initial API fetches
    await Promise.all([
      this.fetchCategories(container),
      this.fetchAndRenderProducts(container, false) // False means overwrite
    ]);
  },

  /**
   * Cache DOM nodes to reference inside event handlers.
   */
  initElements(container) {
    this.elements = {
      search: container.querySelector('#sidebar-search-input'),
      categoriesList: container.querySelector('#sidebar-categories'),
      sortSelect: container.querySelector('#sidebar-sort-select'),
      clearBtn: container.querySelector('#clear-filters-btn'),
      countText: container.querySelector('#products-count-text'),
      gridWrapper: container.querySelector('#products-grid-wrapper'),
      loadMoreContainer: container.querySelector('#load-more-container'),
      loadMoreBtn: container.querySelector('#load-more-btn'),
      activeTags: container.querySelector('#active-filter-tags')
    };
  },

  /**
   * Bind event handlers for filter controls
   */
  initEvents(container) {
    // 1. Debounced Search Event Listener
    let searchDebounceTimer;
    this.elements.search.addEventListener('input', (e) => {
      clearTimeout(searchDebounceTimer);
      searchDebounceTimer = setTimeout(() => {
        const value = e.target.value.trim();
        this.updateQueryParams({ search: value });
      }, 500); // 500ms debounce
    });

    // 2. Sorting select listener
    this.elements.sortSelect.addEventListener('change', (e) => {
      this.updateQueryParams({ sort: e.target.value });
    });

    // 3. Clear all filters listener
    this.elements.clearBtn.addEventListener('click', () => {
      this.state.category = '';
      this.state.search = '';
      this.state.sort = 'featured';
      
      this.elements.search.value = '';
      this.elements.sortSelect.value = 'featured';
      
      this.updateQueryParams({ category: '', search: '', sort: 'featured' });
    });

    // 4. Load more button listener
    this.elements.loadMoreBtn.addEventListener('click', async () => {
      if (this.state.loading) return;
      this.state.skip += this.state.limit;
      await this.fetchAndRenderProducts(container, true); // true = append
    });
  },

  /**
   * Update query parameter URL and navigate to route
   */
  updateQueryParams(updatedParams) {
    const activeParams = {
      category: this.state.category,
      search: this.state.search,
      sort: this.state.sort,
      ...updatedParams
    };

    // Filter empty values
    const queryParts = [];
    if (activeParams.category) queryParts.push(`category=${encodeURIComponent(activeParams.category)}`);
    if (activeParams.search) queryParts.push(`search=${encodeURIComponent(activeParams.search)}`);
    if (activeParams.sort && activeParams.sort !== 'featured') queryParts.push(`sort=${encodeURIComponent(activeParams.sort)}`);

    const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
    router.navigate(`/products${queryString}`);
  },

  /**
   * Fetch categories from the api and populate list
   */
  async fetchCategories(container) {
    try {
      const categories = await apiService.getCategories();
      if (!this.elements.categoriesList) return;

      this.elements.categoriesList.innerHTML = `
        <button class="tag ${!this.state.category ? 'active' : ''}" data-slug="" style="text-align: left; width: 100%; border: none; padding: var(--space-2) var(--space-3); border-radius: var(--radius-sm);">
          All Categories
        </button>
        ${categories.map(cat => `
          <button class="tag ${this.state.category === cat.slug ? 'active' : ''}" data-slug="${cat.slug}" style="text-align: left; width: 100%; border: none; padding: var(--space-2) var(--space-3); border-radius: var(--radius-sm); margin-top: 4px;">
            ${cat.name}
          </button>
        `).join('')}
      `;

      // Category click listener
      this.elements.categoriesList.querySelectorAll('.tag').forEach(tagBtn => {
        tagBtn.addEventListener('click', () => {
          const slug = tagBtn.getAttribute('data-slug');
          this.updateQueryParams({ category: slug });
        });
      });
    } catch (error) {
      console.error('Failed to load categories list:', error);
      if (this.elements.categoriesList) {
        this.elements.categoriesList.innerHTML = '<span style="color: var(--color-error); font-size: var(--font-size-xs);">Failed to load categories.</span>';
      }
    }
  },

  /**
   * Query API, sort, and render cards.
   * @param {HTMLElement} container The main container.
   * @param {boolean} append Whether to append or overwrite.
   */
  async fetchAndRenderProducts(container, append = false) {
    if (this.state.loading) return;
    this.state.loading = true;

    // Show shimmer skeleton at the bottom if appending
    if (append) {
      const loadingSkeleton = document.createElement('div');
      loadingSkeleton.id = 'pagination-shimmer-node';
      loadingSkeleton.innerHTML = Loader.gridSkeletonHtml(this.state.limit);
      this.elements.gridWrapper.appendChild(loadingSkeleton);
    } else {
      this.elements.gridWrapper.innerHTML = Loader.gridSkeletonHtml(this.state.limit);
      this.elements.loadMoreContainer.style.display = 'none';
    }

    try {
      let data;
      const paginationParams = {
        limit: this.state.limit,
        skip: this.state.skip
      };

      // Select proper endpoint based on filters
      if (this.state.search) {
        data = await apiService.searchProducts(this.state.search, paginationParams);
      } else if (this.state.category) {
        data = await apiService.getProductsByCategory(this.state.category, paginationParams);
      } else {
        data = await apiService.getProducts(paginationParams);
      }

      // Remove pagination loading nodes if appending
      const existingShimmer = document.getElementById('pagination-shimmer-node');
      if (existingShimmer) existingShimmer.remove();

      this.state.total = data.total || 0;
      
      // Merge products if appending
      if (append) {
        this.state.products = [...this.state.products, ...data.products];
      } else {
        this.state.products = data.products || [];
      }

      this.renderProductGrid();
      this.updateUIState();

    } catch (error) {
      console.error('Failed to load products list:', error);
      if (!append) {
        this.elements.gridWrapper.innerHTML = `
          <div class="text-center flex-col flex-center" style="padding: var(--space-12) 0; gap: var(--space-4);">
            <div style="font-size: 48px;">⚠️</div>
            <h2>Unable to load products</h2>
            <p style="color: var(--color-text-secondary); max-width: 400px;">${error.message}</p>
            <button id="retry-btn" class="btn btn-primary">Try Again</button>
          </div>
        `;
        const retryBtn = this.elements.gridWrapper.querySelector('#retry-btn');
        if (retryBtn) {
          retryBtn.addEventListener('click', () => {
            this.fetchAndRenderProducts(container, false);
          });
        }
      }
    } finally {
      this.state.loading = false;
    }
  },

  /**
   * Perform client-side sorting and render the products grid.
   */
  renderProductGrid() {
    let sortedList = [...this.state.products];
    const sortVal = this.state.sort;

    if (sortVal === 'price-asc') {
      sortedList.sort((a, b) => {
        const pA = a.price * (1 - (a.discountPercentage || 0) / 100);
        const pB = b.price * (1 - (b.discountPercentage || 0) / 100);
        return pA - pB;
      });
    } else if (sortVal === 'price-desc') {
      sortedList.sort((a, b) => {
        const pA = a.price * (1 - (a.discountPercentage || 0) / 100);
        const pB = b.price * (1 - (b.discountPercentage || 0) / 100);
        return pB - pA;
      });
    } else if (sortVal === 'rating') {
      sortedList.sort((a, b) => b.rating - a.rating);
    } else if (sortVal === 'title') {
      sortedList.sort((a, b) => a.title.localeCompare(b.title));
    }

    if (sortedList.length === 0) {
      this.elements.gridWrapper.innerHTML = `
        <div class="empty-state">
          <div class="empty-state__icon">🔍</div>
          <h3 class="empty-state__title">No products found</h3>
          <p class="empty-state__text">We couldn't find any products matching your current filters. Try resetting them!</p>
          <button id="grid-reset-btn" class="btn btn-primary btn-pill">Clear Filters</button>
        </div>
      `;
      const gridReset = this.elements.gridWrapper.querySelector('#grid-reset-btn');
      if (gridReset) {
        gridReset.addEventListener('click', () => this.elements.clearBtn.click());
      }
      return;
    }

    // Render cards using fragment
    this.elements.gridWrapper.innerHTML = '';
    const grid = document.createElement('div');
    grid.className = 'grid grid--products';
    
    sortedList.forEach(product => {
      const card = ProductCard.create(product);
      grid.appendChild(card);
    });

    this.elements.gridWrapper.appendChild(grid);
  },

  /**
   * Update text tags, totals, and pagination visibility.
   */
  updateUIState() {
    // 1. Text Counter
    const showingCount = this.state.products.length;
    this.elements.countText.innerText = `Showing ${showingCount} of ${this.state.total} products`;

    // 2. Active filter tags
    this.elements.activeTags.innerHTML = '';
    
    if (this.state.category) {
      this.createFilterTag('Category', this.state.category, () => {
        this.updateQueryParams({ category: '' });
      });
    }
    if (this.state.search) {
      this.createFilterTag('Search', `"${this.state.search}"`, () => {
        this.updateQueryParams({ search: '' });
      });
    }

    // 3. Load More visibility
    if (showingCount < this.state.total) {
      this.elements.loadMoreContainer.style.display = 'block';
    } else {
      this.elements.loadMoreContainer.style.display = 'none';
    }
  },

  /**
   * Helper to append an active filter tag pill.
   */
  createFilterTag(label, value, onRemove) {
    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.innerHTML = `
      <span>${label}: <strong>${value}</strong></span>
      <span style="font-size: 14px; font-weight: bold; margin-left: 6px; cursor: pointer;">&times;</span>
    `;
    tag.addEventListener('click', onRemove);
    this.elements.activeTags.appendChild(tag);
  }
};

export default Products;
