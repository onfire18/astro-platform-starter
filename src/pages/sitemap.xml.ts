import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../config/site';

export const prerender = true;

const staticPages = [
  { url: '/', priority: '1.0', changefreq: 'weekly' },
  { url: '/webdesign', priority: '0.9', changefreq: 'monthly' },
  { url: '/blog', priority: '0.8', changefreq: 'weekly' },
  { url: '/ueber-uns', priority: '0.7', changefreq: 'monthly' },
  { url: '/vertrieb', priority: '0.6', changefreq: 'monthly' },
  { url: '/impressum', priority: '0.3', changefreq: 'yearly' },
  { url: '/datenschutz', priority: '0.3', changefreq: 'yearly' },
  { url: '/agb', priority: '0.3', changefreq: 'yearly' },
];

export const GET: APIRoute = async () => {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const blogPages = posts.map((post) => ({
    url: `/blog/${post.slug}`,
    priority: '0.7',
    changefreq: 'monthly',
    lastmod: (post.data.updatedDate ?? post.data.pubDate).toISOString().split('T')[0],
  }));

  const pages = [...staticPages, ...blogPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (p) => `  <url>
    <loc>${SITE.url}${p.url}</loc>${'lastmod' in p ? `\n    <lastmod>${(p as { lastmod: string }).lastmod}</lastmod>` : ''}
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
