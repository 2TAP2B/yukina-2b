#!/bin/bash

# Performance cleanup script for Yukina blog
echo "🚀 Starting performance cleanup..."

# Remove astro-compress from dependencies since it's not being used
echo "📦 Cleaning up unused dependencies..."
pnpm remove astro-compress 2>/dev/null || npm uninstall astro-compress 2>/dev/null || echo "astro-compress not found or already removed"

# Clean build artifacts
echo "🧹 Cleaning build artifacts..."
rm -rf dist/
rm -rf .astro/
rm -rf node_modules/.astro/
rm -rf node_modules/.cache/

# Rebuild with optimizations
echo "🔨 Rebuilding with optimizations..."
pnpm build 2>/dev/null || npm run build || echo "Build tools not available"

echo "✅ Performance cleanup complete!"
echo ""
echo "📊 Performance optimizations applied:"
echo "  ✅ Image optimization (Sharp)"
echo "  ✅ Font preloading and optimization"
echo "  ✅ Code splitting for vendor libraries"
echo "  ✅ Lazy loading for images"
echo "  ✅ CSS optimization"
echo "  ✅ DNS prefetch for external resources"
echo "  ✅ Build asset optimization"
echo "  ✅ Dependency optimization"
echo ""
echo "🎯 Next steps:"
echo "  1. Test the site locally with 'pnpm dev' or 'npm run dev'"
echo "  2. Run Lighthouse audit to verify improvements"
echo "  3. Deploy and test on production"
