export const NotFound = {
  async render(container, params) {
    container.innerHTML = `
      <div class="container not-found">
        <h1 class="not-found__code">404</h1>
        <h2 class="not-found__title">Page Not Found</h2>
        <p class="not-found__text">The luxury collection path you are trying to visit does not exist or has been removed from our designer catalog.</p>
        <div class="flex gap-4">
          <a href="#/" class="btn btn-primary btn-pill">Go Back Home</a>
          <a href="#/products" class="btn btn-secondary btn-pill">Browse Shop</a>
        </div>
      </div>
    `;
  }
};

export default NotFound;
