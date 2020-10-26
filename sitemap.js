const sitemap = require("nextjs-sitemap-generator");

sitemap({
  baseUrl: "https://stupidfits.com",
  ignoredPaths: ["admin", "f", "feed", "me", "fit"],
  extraPaths: ["/extraPath"],
  pagesDirectory: __dirname + "\\pages",
  targetDirectory: "static/",
  sitemapFilename: "sitemap.xml",
  nextConfigPath: __dirname + "\\next.config.js",
  ignoredExtensions: ["png", "jpg"],
  pagesConfig: {
    "/": {
      priority: "0.5",
      changefreq: "daily",
    },
    "/brand": {
      priority: "0.5",
      changefreq: "daily",
    },
    "/global": {
      priority: "0.5",
      changefreq: "daily",
    },
  },
});

console.log(`✅ sitemap.xml generated!`);
