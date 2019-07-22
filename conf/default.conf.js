module.exports = {

  paths: {

    projectRoot: "./",
    input: {
      css: "./css",
      js: "./js",
      misc: "./misc",
      ejs: "./ejs"
    },
    output: {
      ejs: false
    }

  },

  postcss: false,

  browsersync: {
    spa: false,
    port: 3000,
    openBrowser: true,
    urlRewrites: [],
    mode: "auto",
    notify: true
  },

  webpack: {
    enableBundleAnalyzerServer: false,
    extractModules: false,
    modules: {
      externals: {},
      alias: {}
    }
  },

  lint: {
    js: false,
    scss: false
  },

  fontastic: {},
	
	customWatchers: [],

  optimizeAssets: true,
  webpSupport: false,
  cleanDirectories: {
    css: true,
    js: true,
    misc: true,
    ejs: false
  },
  ejsVars: {},

  bubbleNotifications: {
    js: true,
    styles: true,
    ejs: true
  },

  php: false,

  logVerbosity: 1

};
