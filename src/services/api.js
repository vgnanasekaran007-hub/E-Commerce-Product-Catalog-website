/**
 * API service for communicating with the DummyJSON Products API.
 */
const BASE_URL = 'https://dummyjson.com';

class ApiService {
  /**
   * Helper to perform fetch requests with error handling
   */
  async request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        let errorMsg = `HTTP Error: ${response.status} ${response.statusText}`;
        try {
          const errData = await response.json();
          if (errData && errData.message) {
            errorMsg = errData.message;
          }
        } catch (_) {}
        throw new Error(errorMsg);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for [${url}]:`, error);
      // Throw a user-friendly error message if it's a network/offline error
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        throw new Error('Network error. Please check your internet connection and try again.');
      }
      throw error;
    }
  }

  /**
   * Get a list of products with pagination limits and search/sorting parameters
   * @param {object} params Query parameters { limit, skip }
   */
  async getProducts({ limit = 20, skip = 0 } = {}) {
    return this.request(`/products?limit=${limit}&skip=${skip}`);
  }

  /**
   * Get detail for a single product by ID
   * @param {string|number} id Product ID
   */
  async getProduct(id) {
    return this.request(`/products/${id}`);
  }

  /**
   * Search products by keyword
   * @param {string} query Search keyword
   * @param {object} params Pagination parameters { limit, skip }
   */
  async searchProducts(query, { limit = 20, skip = 0 } = {}) {
    const escapedQuery = encodeURIComponent(query);
    return this.request(`/products/search?q=${escapedQuery}&limit=${limit}&skip=${skip}`);
  }

  /**
   * Get list of all available categories
   */
  async getCategories() {
    return this.request('/products/categories');
  }

  /**
   * Get list of products in a specific category
   * @param {string} categorySlug Category slug
   * @param {object} params Pagination parameters { limit, skip }
   */
  async getProductsByCategory(categorySlug, { limit = 20, skip = 0 } = {}) {
    const escapedSlug = encodeURIComponent(categorySlug);
    return this.request(`/products/category/${escapedSlug}?limit=${limit}&skip=${skip}`);
  }
}

export const apiService = new ApiService();
export default apiService;
