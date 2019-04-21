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

  autoprefixer: null,
  postcssPresetEnv: {},
  flexbugs: {},

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
