/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://smartaiworkers.com",
  generateRobotsTxt: true,
  changefreq: "daily",
  priority: 0.7,
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    };
  },
  exclude: ["/ko/account/*", "/en/account/*", "/ko/portfolio", "/en/portfolio"],
};
