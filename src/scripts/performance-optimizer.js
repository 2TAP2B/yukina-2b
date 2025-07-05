// Intersection Observer for lazy loading and performance optimization
class PerformanceOptimizer {
  constructor() {
    this.imageObserver = null;
    this.animationObserver = null;
    this.init();
  }

  init() {
    // Initialize lazy loading for images
    this.initLazyLoading();
    
    // Initialize animation observer for better performance
    this.initAnimationObserver();
    
    // Optimize font loading
    this.optimizeFonts();
    
    // Preload critical resources
    this.preloadCriticalResources();
  }

  initLazyLoading() {
    if ('IntersectionObserver' in window) {
      this.imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            
            // Load the actual image
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            
            // Load srcset if available
            if (img.dataset.srcset) {
              img.srcset = img.dataset.srcset;
              img.removeAttribute('data-srcset');
            }
            
            // Remove loading class
            img.classList.remove('lazy-loading');
            img.classList.add('lazy-loaded');
            
            this.imageObserver.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });

      // Observe all lazy images
      document.querySelectorAll('img[data-src], img[loading="lazy"]').forEach(img => {
        this.imageObserver.observe(img);
      });
    }
  }

  initAnimationObserver() {
    if ('IntersectionObserver' in window) {
      this.animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            this.animationObserver.unobserve(entry.target);
          }
        });
      }, {
        rootMargin: '20px 0px',
        threshold: 0.1
      });

      // Observe elements with animation classes
      document.querySelectorAll('.onload-animation').forEach(el => {
        this.animationObserver.observe(el);
      });
    }
  }

  optimizeFonts() {
    // Font display optimization
    if ('fonts' in document) {
      document.fonts.ready.then(() => {
        document.body.classList.add('fonts-loaded');
      });
    } else {
      // Fallback for older browsers
      setTimeout(() => {
        document.body.classList.add('fonts-loaded');
      }, 3000);
    }
  }

  preloadCriticalResources() {
    // Preload critical images that might be above the fold
    const criticalImages = document.querySelectorAll('img[data-priority]');
    criticalImages.forEach(img => {
      if (img.dataset.src) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = img.dataset.src;
        document.head.appendChild(link);
      }
    });
  }

  // Method to reduce layout shifts
  preventLayoutShift() {
    // Add aspect ratio containers for images without dimensions
    document.querySelectorAll('img:not([width]):not([height])').forEach(img => {
      const wrapper = document.createElement('div');
      wrapper.style.aspectRatio = '16/9'; // Default aspect ratio
      wrapper.style.overflow = 'hidden';
      wrapper.style.position = 'relative';
      
      img.parentNode.insertBefore(wrapper, img);
      wrapper.appendChild(img);
      
      img.style.position = 'absolute';
      img.style.top = '0';
      img.style.left = '0';
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
    });
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new PerformanceOptimizer();
  });
} else {
  new PerformanceOptimizer();
}

// Re-initialize for SPA navigation (Swup compatibility)
if (window.swup) {
  window.swup.hooks.on('page:view', () => {
    new PerformanceOptimizer();
  });
}
