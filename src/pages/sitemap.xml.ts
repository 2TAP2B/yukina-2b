export const prerender = true;

import { getCollection } from 'astro:content';
import YukinaConfig from '../../yukina.config';

export async function GET() {
  const posts = await getCollection('posts');
  const pages = await getCollection('specs');
  
  const staticPages = [
    '',
    'about',
    'archive',
    'projects',
  ];

  const allUrls = [
    ...staticPages.map(page => ({
      url: `${YukinaConfig.site}${page}`,
      lastmod: new Date().toISOString(),
      priority: page === '' ? '1.0' : '0.8',
      changefreq: 'weekly'
    })),
    ...posts.map(post => ({
      url: `${YukinaConfig.site}posts/${post.id}`,
      lastmod: post.data.published?.toISOString() || new Date().toISOString(),
      priority: '0.9',
      changefreq: 'monthly'
    })),
    ...pages.map(page => ({
      url: `${YukinaConfig.site}${page.id}`,
      lastmod: new Date().toISOString(),
      priority: '0.7',
      changefreq: 'monthly'
    }))
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(({ url, lastmod, priority, changefreq }) => `
  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>${priority}</priority>
    <changefreq>${changefreq}</changefreq>
  </url>`).join('')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
