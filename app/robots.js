export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", "/account"],
      },
    ],
    sitemap: [
      "https://www.thefinancialbuddy.com/sitemap.xml",
      "https://www.thefinancialbuddy.com/news-sitemap.xml",
    ],
  };
}
