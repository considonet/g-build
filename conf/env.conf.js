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

  logVerbosity: 1

};
