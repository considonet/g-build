module.exports = {

  paths: {
    input: {
      css: "./css",
      js: "./js",
      misc: "./misc"
    }
  },

  autoprefixer: {},

  browsersync: {
    spa: false,
    port: 3000,
    openBrowser: true,
    urlRewrites: [],
    mode: "auto"
  },

  webpack: {
    hardSourceCache: false,
    enableBundleAnalyzerServer: true,
    modules: {
      externals: {},
      alias: {}
    }
  },

  logVerbosity: 1

};
