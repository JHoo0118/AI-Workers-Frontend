/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    proxyTimeout: 1000 * 120,
  },
  httpAgentOptions: {
    keepAlive: true,
  },
  transpilePackages: ["crypto-js"],
  webpack: (config) => {
    config.resolve.alias.canvas = false;

    return config;
  },
  rewrites: async () => {
    return [
      {
        source: "/py-api/:path*",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/api/:path*"
            : `${process.env.BASE_API_URL}/api/:path*`,
      },
      {
        source: "/docs",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/docs"
            : `${process.env.BASE_API_URL}/docs`,
      },
      {
        source: "/openapi.json",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/openapi.json"
            : `${process.env.BASE_API_URL}/openapi.json`,
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "mermaid.ink",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
