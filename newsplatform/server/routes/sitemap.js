const express = require('express');
const router = express.Router();
const Article = require('../models/Article');

router.get('/sitemap.xml', async (req, res) => {
  try {
    const articles = await Article.find({ status: 'published' }).select('slug updatedAt').lean();
    const baseUrl = process.env.CLIENT_URL || 'https://newsplatform.com';

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${baseUrl}</loc><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>${baseUrl}/videos</loc><changefreq>daily</changefreq><priority>0.8</priority></url>
  <url><loc>${baseUrl}/categories</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`;

    for (const article of articles) {
      xml += `
  <url>
    <loc>${baseUrl}/article/${article.slug}</loc>
    <lastmod>${new Date(article.updatedAt).toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
    }
    xml += `\n</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err) {
    res.status(500).send('Error generating sitemap');
  }
});

router.get('/robots.txt', (req, res) => {
  const baseUrl = process.env.CLIENT_URL || 'https://newsplatform.com';
  res.header('Content-Type', 'text/plain');
  res.send(`User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: ${baseUrl}/sitemap.xml\n`);
});

module.exports = router;
