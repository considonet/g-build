module.exports = {

  paths: {

    projectRoot: "./",
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
    enableBundleAnalyzerServer: false,
    extractRuntime: false,
    extractModules: false,
    modules: {
      externals: {},
      alias: {}
    }
  },

  lint: {
    js: true,
    scss: false
  },

  fontastic: {
  },
	
	customWatchers: [],

  php: false,

  logVerbosity: 1

};
