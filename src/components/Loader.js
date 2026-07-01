/**
 * Loader components for page transitions and data fetching.
 */
export const Loader = {
  /**
   * Return HTML string for a full-page loading spinner.
   */
  spinnerHtml() {
    return `
      <div class="page-loader">
        <div class="spinner"></div>
        <p style="color: var(--color-text-muted); font-size: var(--font-size-sm);">Loading AURA...</p>
      </div>
    `;
  },

  /**
   * Return HTML string for a product card skeleton loading grid.
   * @param {number} count Number of skeleton cards to render.
   */
  gridSkeletonHtml(count = 8) {
    let skeletonsHtml = '';
    for (let i = 0; i < count; i++) {
      skeletonsHtml += `
        <div class="skeleton-card">
          <div class="skeleton-image"></div>
          <div class="skeleton skeleton-text" style="width: 30%;"></div>
          <div class="skeleton skeleton-text" style="width: 80%; height: 16px;"></div>
          <div class="skeleton skeleton-text skeleton-text--short"></div>
          <div class="skeleton-price">
            <div class="skeleton-price-text"></div>
            <div class="skeleton-btn"></div>
          </div>
        </div>
      `;
    }

    return `
      <div class="grid grid--products">
        ${skeletonsHtml}
      </div>
    `;
  }
};

export default Loader;
