module.exports = {
  webpack: function (config) {
    config.externals = config.externals || {};
    config.externals["styletron-server"] = "styletron-server";
    return config;
  },
  env: {
    HOST: process.env.HOST,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
};
