module.exports = {
  poweredByHeader: false,
  webpack: function (config) {
    config.externals = config.externals || {};
    config.externals["styletron-server"] = "styletron-server";
    return config;
  },
  async redirects() {
    return [
      {
        source: "/u",
        destination: "/",
        permanent: true,
      },
      {
        source: "/p",
        destination: "/",
        permanent: true,
      },
      {
        source: "/f",
        destination: "/",
        permanent: true,
      },
      {
        source: "/battle",
        destination: "/collection",
        permanent: true,
      },
      {
        source: "/fit",
        destination: "/",
        permanent: true,
      },
    ];
  },
  env: {
    HOST: process.env.HOST,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
};
