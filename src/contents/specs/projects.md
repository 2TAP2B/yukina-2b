# My Projects

<div class="projects-showcase">
  
  <div class="project-card">
    <div class="project-image-container">
      <img src="https://pustekuchen-xanten.de/images/puku-bk.webp" alt="Pustekuchen Xanten Website" class="project-image" />
      <div class="project-overlay">
        <span class="project-tech">Astro • TypeScript</span>
      </div>
    </div>
    <div class="project-content">
      <div class="project-title">Pustekuchen Xanten</div>
      <p class="project-description">
        Modern, responsive website for Pustekuchen Kindergarten in Xanten. Built with Astro for optimal performance and SEO, featuring a clean design and intuitive navigation for parents and staff.
      </p>
      <div class="project-links">
        <a href="https://codeberg.org/Pustekuchen-Xanten/pustekuchen-web" target="_blank" rel="noopener noreferrer" class="project-link project-link-secondary">
          <svg class="link-icon" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          Repository
        </a>
        <a href="https://pustekuchen-xanten.de/" target="_blank" rel="noopener noreferrer" class="project-link project-link-primary">
          <svg class="link-icon" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
          Live Site
        </a>
      </div>
    </div>
  </div>

  <div class="project-card">
    <div class="project-image-container">
      <img src="https://placehold.co/400x250/672178/FFFFFF?text=Minny.ink" alt="Minny.ink Portfolio" class="project-image" />
      <div class="project-overlay">
        <span class="project-tech">Ghost CMS • JavaScript</span>
      </div>
    </div>
    <div class="project-content">
      <div class="project-title">Minny.ink</div>
      <p class="project-description">
        Elegant portfolio website for a tattoo artist, showcasing artwork and booking information. Built with Ghost CMS for easy content management, featuring a dark aesthetic that highlights the artistic work.
      </p>
      <div class="project-links">
        <a href="https://github.com/TryGhost/Ghosta" target="_blank" rel="noopener noreferrer" class="project-link project-link-secondary">
          <svg class="link-icon" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          Repository
        </a>
        <a href="https://minny.ink" target="_blank" rel="noopener noreferrer" class="project-link project-link-primary">
          <svg class="link-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
          Live Site
        </a>
      </div>
    </div>
  </div>

</div>

<style>
.projects-showcase {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
  padding: 0 1rem;
}

.project-card {
  background: var(--card-color);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.project-card:hover {
  transform: translateY(-8px);
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.project-image-container {
  position: relative;
  overflow: hidden;
  height: 200px;
}

.project-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.project-card:hover .project-image {
  transform: scale(1.05);
}

.project-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.1) 50%,
    rgba(0, 0, 0, 0.7) 100%
  );
  display: flex;
  align-items: flex-end;
  padding: 1rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.project-card:hover .project-overlay {
  opacity: 1;
}

.project-tech {
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.project-content {
  padding: 1.5rem;
}

.project-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 0.75rem;
  font-family: var(--brand-font);
}

.project-description {
  color: var(--text-color-lighten);
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.project-links {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.project-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.875rem;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid var(--primary-color);
  position: relative;
  overflow: hidden;
  background: transparent;
  color: var(--primary-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.project-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: var(--primary-color-hover);
  transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: -1;
}

.project-link:hover::before {
  left: 0;
}

.project-link:hover {
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.project-link-primary {
  /* Inherits all styles from .project-link */
}

.project-link-secondary {
  /* Inherits all styles from .project-link */
}

.link-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .projects-showcase {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin: 1rem 0;
  }
  
  .project-card {
    margin: 0 0.5rem;
  }
  
  .project-content {
    padding: 1rem;
  }
  
  .project-links {
    flex-direction: column;
  }
  
  .project-link {
    justify-content: center;
  }
}

/* Dark mode adjustments */
:root.dark .project-card {
  border-color: rgba(255, 255, 255, 0.05);
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.3),
    0 2px 4px -1px rgba(0, 0, 0, 0.2);
}

:root.dark .project-card:hover {
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.4),
    0 10px 10px -5px rgba(0, 0, 0, 0.3);
}

:root.dark .project-link {
  border-color: var(--primary-color);
  color: var(--primary-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

:root.dark .project-link:hover {
  color: white;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
}

:root.dark .project-link::before {
  background: var(--primary-color-hover);
}
</style>
