const path = require("path");
const fs = require("fs");
const gulp = require("gulp");

const VERSION = require("../package.json").version;
let configFilePath = './gbuildconfig.js';
let configCache = null;

module.exports.splash = function() {

  const supportsColor = require('color-support');

  if(supportsColor) {
    console.log(`\x1b[34m  _____\x1b[37m\n\x1b[34m / ___/\x1b[37m\x1b[1m  G-Build ${VERSION}\x1b[0m\n\x1b[34m/ (_ /\x1b[37m   (C) 2017-2019 ConsidoNet Solutions | www.considonet.com | Licence: MIT\n\x1b[34m\\___/\x1b[37m\x1b[0m\n`);
  } else {
    console.log(`  _____\n / ___/  G-Build ${VERSION}\n/ (_ /   (C) 2017-2019 ConsidoNet Solutions | www.considonet.com | Licence: MIT\n\\___/\n`);
  }

};

const getConfig = function() {

  if(configCache === null) {

    // Deps
    const merge = require('lodash/merge');

    // Env base config
    const envConfig = require(path.join(__dirname, "../conf/default.conf"));

    envConfig.paths.cwd = __dirname;

    // Project-specific config
    let confPath = path.join(process.cwd(), configFilePath);

    if(fs.existsSync(confPath)) {

      const mainConfig = require(confPath);
      configCache = merge({}, envConfig, mainConfig.cfg);

    } else {

      console.warn(`Project config was not found: ${confPath}`);
      configCache = envConfig;

    }

  }

  return configCache;

};

const Logger = require('@considonet/g-logger');
const FontasticBundler = require("@considonet/g-fontasticbundler");

const gulpInit = function(config) {

  const browserSync = require('browser-sync');
  const logger = new Logger("gbuild", config.logVerbosity);

  logger.log("Initializing gulp...", 2);

  // Internal gulp tasks: directory cleaner
  gulp.task('clean', require("./gulptasks/clean")(config, gulp));

  // Internal gulp tasks: asset files copy
  gulp.task('assets:dev', require("./gulptasks/assets")(config, gulp, "dev"));
  gulp.task('assets:dist', require("./gulptasks/assets")(config, gulp));
  gulp.task('miscassets', require("./gulptasks/miscassets")(config, gulp));

  // Internal gulp tasks: browser-sync
  gulp.task('browsersync', require("./gulptasks/browsersync")(config, gulp));

  // Internal gulp tasks: php server
  gulp.task('php', require("./gulptasks/php")(config, gulp));

  // Internal gulp tasks: SCSS compiler with custom importer
  const stylesTask = require("./gulptasks/styles");
  gulp.task('styles:dist', stylesTask(config, gulp));
  gulp.task('styles:dev', stylesTask(config, gulp, "dev"));

  // Internal gulp tasks: Webpack tasks
  const webpackTask = require("./gulptasks/webpack");
  gulp.task('webpack:dev', webpackTask(config, gulp, "dev"));
  gulp.task('webpack:dist', webpackTask(config, gulp));
  gulp.task('webpack:watch', webpackTask(config, gulp, "watch"));
  gulp.task('webpack:watchdist', webpackTask(config, gulp, "watchdist"));

  // Internal gulp tasks: EJS compilation
  gulp.task('ejs', require("./gulptasks/ejs")(config, gulp));

  // Internal gulp tasks: File watchers
  const reloadBrowserSync = function(cb) {
    browserSync.reload();
    cb();
  };

  gulp.task("watch:dist", done => {

    if(config.paths.output.css !== false) {
      gulp.watch(path.posix.join(config.paths.input.css, '/**/*.scss'), gulp.series('styles:dist'));
      gulp.watch([ path.posix.join(config.paths.input.css, '/**/*'), path.posix.join(`!${config.paths.input.css}`, '/**/*.{scss,js,jsx,ts,tsx,html,vue,map}') ], gulp.series('assets:dist'));
    }

    if(config.paths.output.misc !== false) {
      gulp.watch(path.posix.join(config.paths.input.misc, '/**/*'), gulp.series('miscassets'));
    }

    if(config.paths.output.ejs !== false) {
      gulp.watch(path.posix.join(config.paths.input.ejs, '/**/*.ejs'), gulp.series('ejs', reloadBrowserSync));
    }

    done();
  });

  gulp.task("watch:dev", done => {

    gulp.watch(path.posix.join(config.paths.projectRoot, './*.html'), reloadBrowserSync);
    gulp.watch(path.posix.join(config.paths.projectRoot, './Views/**/*.cshtml'), reloadBrowserSync);

    if(config.paths.output.css !== false) {
      gulp.watch(path.posix.join(config.paths.input.css, '/**/*.scss'), gulp.series('styles:dev'));
      gulp.watch([ path.posix.join(config.paths.input.css, '/**/*'), path.posix.join(`!${config.paths.input.css}`, '/**/*.{scss,js,jsx,ts,tsx,html,vue,map}') ], gulp.series('assets:dev'));
    }

    if(config.paths.output.misc !== false) {
      gulp.watch(path.posix.join(config.paths.input.misc, '/**/*'), gulp.series('miscassets'));
    }

    if(config.paths.output.ejs !== false) {
      gulp.watch(path.posix.join(config.paths.input.ejs, '/**/*.ejs'), gulp.series('ejs', reloadBrowserSync));
    }
    
    // Custom path watchers
    if(config.customWatchers.length>0) {
      config.customWatchers.forEach(watchedPath => {
        gulp.watch(path.posix.join(config.paths.projectRoot, watchedPath), reloadBrowserSync);
      });
    }
    
    done();
  });

  // External gulp tasks
  gulp.task('build', gulp.series("clean", "assets:dist", gulp.parallel("miscassets", 'styles:dist', 'webpack:dist', 'ejs')));
  gulp.task("serve", gulp.series("clean", "assets:dev", "miscassets", "styles:dev", "watch:dev", "webpack:watch", "php", "browsersync"));
  gulp.task("watch", gulp.series("clean", "assets:dist", "miscassets", "styles:dist", gulp.parallel("webpack:watchdist", "watch:dist")));
  gulp.task("fullassets", gulp.series("assets:dist", "miscassets"));

};

const init = function(configFile, noGulp = false) {

  configFilePath = configFile;
  const conf = getConfig();

  // Deprecation warnings and config validation
  const logger = new Logger("gbuild-configcheck", conf.logVerbosity);

  Object.keys(conf.jsEntries).forEach(k => {
    if(conf.jsEntries[k].indexOf(".js") !== -1) {
      logger.warn(`Deprecation warning: Entry point ${k} output path (${conf.jsEntries[k]}) contains file extension. Please make sure to remove the extension before version 3.x!`);
    }
  });

  if(typeof conf.paths.public === "undefined") {
    logger.warn("Config key paths.public is not defined. Async imports will not work. Please refer to README.md for more details.")
  }

  if(conf.webpack.extractRuntime && conf.webpack.extractRuntime.match(/\.js$/)) {
    logger.warn("Config key webpack.extractRuntime contains file extension. This leads to file naming convention problems.");
  }

  if(!noGulp) {
    gulpInit(conf);
  }

};

// Exports
module.exports.getConfig = getConfig;

module.exports.getVersion = function() {

  return VERSION;

};

// Build command
module.exports.build = function(configFile) {
  init(configFile);
  gulp.task("build")();
};

// Serve command
module.exports.serve = function(configFile) {
  init(configFile);
  gulp.task("serve")();
};

// Watch command
module.exports.watch = function(configFile) {
  init(configFile);
  gulp.task("watch")();
};

// Assets command
module.exports.assets = function(configFile) {
  init(configFile);
  gulp.task("fullassets")();
};

// Fontastic bundler command
module.exports.fontastic = function(configFile) {

  init(configFile, true);

  const conf = getConfig();
  const logger = new Logger("gbuild", conf.logVerbosity);

  const bundler = new FontasticBundler(conf.logVerbosity);
  if(typeof conf.fontastic.id === "undefined") {
    logger.error("Fontastic ID not found in the config file. Please make sure to add a 'fontastic' key with 'id', 'scssFile' and 'fontsDir' settings.");
  } else {
    bundler.bundle(conf.fontastic.id, conf.paths.input.css, conf.fontastic.fontsDir, conf.fontastic.scssFile);
  }

};
