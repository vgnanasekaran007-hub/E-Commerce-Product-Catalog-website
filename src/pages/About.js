export const About = {
  async render(container, params) {
    container.innerHTML = `
      <div class="container section">
        <!-- Breadcrumbs -->
        <div class="breadcrumb">
          <a href="#/">Home</a>
          <span class="separator">/</span>
          <span class="current">About Us</span>
        </div>

        <!-- Page Header -->
        <div class="about-hero">
          <h1 class="about-hero__title">Our Story — <span class="highlight">AURA</span></h1>
          <p class="about-hero__desc">
            Aura is a digital-first catalog built for curators, designers, and enthusiasts of high-fidelity gadgets, aesthetics, and minimalist lifestyle elements. We bridge the gap between premium design and functional product experiences.
          </p>
        </div>

        <!-- Stats Counters -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-card__value" data-target="5">5+</div>
            <div class="stat-card__label">Years in Business</div>
          </div>
          <div class="stat-card">
            <div class="stat-card__value" data-target="50">50K+</div>
            <div class="stat-card__label">Happy Customers</div>
          </div>
          <div class="stat-card">
            <div class="stat-card__value" data-target="150">150+</div>
            <div class="stat-card__label">Luxury Brands</div>
          </div>
          <div class="stat-card">
            <div class="stat-card__value" data-target="24">24/7</div>
            <div class="stat-card__label">Customer Support</div>
          </div>
        </div>

        <!-- Values Section -->
        <div class="section" style="border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border); margin: var(--space-8) 0;">
          <h2 style="text-align: center; margin-bottom: var(--space-8);">Our Core Values</h2>
          
          <div class="values-grid">
            <div class="value-card">
              <div class="value-card__icon">🎨</div>
              <h3 class="value-card__title">Aesthetic Design</h3>
              <p class="value-card__text">We believe the tools you use and the spaces you inhabit should inspire. Every listed item undergoes strict visual cataloging.</p>
            </div>
            <div class="value-card">
              <div class="value-card__icon">⚡</div>
              <h3 class="value-card__title">Technical Speed</h3>
              <p class="value-card__text">Efficiency is everything. We value your time by offering a lag-free catalog experience with persistent state synchronizations.</p>
            </div>
            <div class="value-card">
              <div class="value-card__icon">🌱</div>
              <h3 class="value-card__title">Sustainable Choices</h3>
              <p class="value-card__text">We partner with ethical brands offering solid warranties and long lifecycle returns, reducing electronics and cosmetic waste.</p>
            </div>
          </div>
        </div>

        <!-- Team Section -->
        <div>
          <h2 style="text-align: center; margin-bottom: var(--space-8);">Meet the Founders</h2>
          <div class="team-grid">
            <div class="team-card">
              <div class="team-card__avatar">GV</div>
              <h3 class="team-card__name">Gnanasekaran V</h3>
              <div class="team-card__role">Founder & CEO</div>
            </div>
            <div class="team-card">
              <div class="team-card__avatar">SL</div>
              <h3 class="team-card__name">Sarah Lin</h3>
              <div class="team-card__role">Creative Director</div>
            </div>
            <div class="team-card">
              <div class="team-card__avatar">MK</div>
              <h3 class="team-card__name">Marcus K.</h3>
              <div class="team-card__role">Lead Tech Engineer</div>
            </div>
            <div class="team-card">
              <div class="team-card__avatar">AD</div>
              <h3 class="team-card__name">Aria Dev</h3>
              <div class="team-card__role">Head of UX Architecture</div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.animateStats(container);
  },

  /**
   * Sub-micro interactive animation that counts up the stats numbers on load.
   */
  animateStats(container) {
    const stats = container.querySelectorAll('.stat-card__value');
    stats.forEach(stat => {
      const targetText = stat.getAttribute('data-target');
      const targetVal = parseInt(targetText);
      if (isNaN(targetVal)) return;

      let current = 0;
      const step = Math.ceil(targetVal / 30);
      const timer = setInterval(() => {
        current += step;
        if (current >= targetVal) {
          stat.innerText = targetText.endsWith('+') || targetText.endsWith('/7') ? targetText : `${targetVal}+`;
          clearInterval(timer);
        } else {
          stat.innerText = targetText.includes('/') ? `${current}/7` : `${current}+`;
        }
      }, 30);
    });
  }
};

export default About;
