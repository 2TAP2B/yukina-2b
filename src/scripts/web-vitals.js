// Performance monitoring and web vitals tracking
class WebVitalsTracker {
  constructor() {
    this.vitals = {};
    this.initialize();
  }

  initialize() {
    // Track Core Web Vitals
    this.trackLCP();
    this.trackFID();
    this.trackCLS();
    this.trackFCP();
    this.trackTTFB();
    
    // Custom performance metrics
    this.trackCustomMetrics();
    
    // Send data on page unload
    this.setupReporting();
  }

  trackLCP() {
    if ('PerformanceObserver' in window) {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.vitals.lcp = Math.round(lastEntry.startTime);
        this.reportVital('LCP', this.vitals.lcp);
      }).observe({ entryTypes: ['largest-contentful-paint'] });
    }
  }

  trackFID() {
    if ('PerformanceObserver' in window) {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-input') {
            this.vitals.fid = Math.round(entry.processingStart - entry.startTime);
            this.reportVital('FID', this.vitals.fid);
            break;
          }
        }
      }).observe({ entryTypes: ['first-input'] });
    }
  }

  trackCLS() {
    if ('PerformanceObserver' in window) {
      let cls = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutShiftEntry = entry;
          if (!layoutShiftEntry.hadRecentInput) {
            cls += layoutShiftEntry.value;
          }
        }
        this.vitals.cls = Math.round(cls * 1000) / 1000;
        this.reportVital('CLS', this.vitals.cls);
      }).observe({ entryTypes: ['layout-shift'] });
    }
  }

  trackFCP() {
    if ('PerformanceObserver' in window) {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            this.vitals.fcp = Math.round(entry.startTime);
            this.reportVital('FCP', this.vitals.fcp);
            break;
          }
        }
      }).observe({ entryTypes: ['paint'] });
    }
  }

  trackTTFB() {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const navEntry = performance.getEntriesByType('navigation')[0];
      if (navEntry) {
        this.vitals.ttfb = Math.round(navEntry.responseStart - navEntry.requestStart);
        this.reportVital('TTFB', this.vitals.ttfb);
      }
    }
  }

  trackCustomMetrics() {
    // Track time to interactive (simplified)
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      this.vitals.load = Math.round(loadTime);
      this.reportVital('Load', this.vitals.load);

      // Track resource loading times
      const resources = performance.getEntriesByType('resource');
      const slowResources = resources.filter(r => r.duration > 1000);
      if (slowResources.length > 0) {
        console.warn('Slow resources detected:', slowResources);
      }
    });

    // Track JavaScript errors
    window.addEventListener('error', (e) => {
      this.reportError('JavaScript Error', e.message, e.filename, e.lineno);
    });

    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (e) => {
      this.reportError('Unhandled Promise Rejection', e.reason);
    });
  }

  reportVital(name, value) {
    // Log to console in development
    if (this.isDevelopment()) {
      console.log(`${name}: ${value}${this.getUnit(name)}`);
    }

    // Send to analytics service (implement as needed)
    this.sendToAnalytics('web-vital', {
      name,
      value,
      url: window.location.href,
      timestamp: Date.now()
    });
  }

  reportError(type, message, filename = '', lineno = 0) {
    if (this.isDevelopment()) {
      console.error(`${type}: ${message}`);
    }

    this.sendToAnalytics('error', {
      type,
      message,
      filename,
      lineno,
      url: window.location.href,
      timestamp: Date.now()
    });
  }

  getUnit(vital) {
    switch (vital) {
      case 'CLS':
        return '';
      case 'FID':
      case 'LCP':
      case 'FCP':
      case 'TTFB':
      case 'Load':
        return 'ms';
      default:
        return '';
    }
  }

  isDevelopment() {
    return window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1' ||
           window.location.hostname.includes('dev');
  }

  sendToAnalytics(event, data) {
    // Implement your analytics service here
    // Example with a generic endpoint:
    if (navigator.sendBeacon && !this.isDevelopment()) {
      const payload = JSON.stringify({ event, data });
      navigator.sendBeacon('/api/analytics', payload);
    }
  }

  setupReporting() {
    // Send final report on page unload
    window.addEventListener('beforeunload', () => {
      this.sendFinalReport();
    });

    // Send report on visibility change (for SPA navigation)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.sendFinalReport();
      }
    });
  }

  sendFinalReport() {
    const report = {
      url: window.location.href,
      vitals: this.vitals,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      connection: this.getConnectionInfo()
    };

    if (navigator.sendBeacon && !this.isDevelopment()) {
      navigator.sendBeacon('/api/performance', JSON.stringify(report));
    }
  }

  getConnectionInfo() {
    if ('connection' in navigator) {
      const conn = navigator.connection;
      return {
        effectiveType: conn.effectiveType,
        downlink: conn.downlink,
        rtt: conn.rtt
      };
    }
    return null;
  }
}

// Initialize tracker
if (typeof window !== 'undefined') {
  window.webVitalsTracker = new WebVitalsTracker();
}
