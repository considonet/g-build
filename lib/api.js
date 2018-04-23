const path = require("path");
const fs = require("fs");
const gulp = require("gulp");

const VERSION = "1.5.0";
let configCache = null;

module.exports.splash = function() {

  const supportsColor = require('color-support');

  if(supportsColor) {
    console.log('\x1b[34m  _____\x1b[37m_____________  ___   ___  \x1b[33m____\n\x1b[34m / ___/\x1b[37m __/_  __/ _ \\/ _ | / _ \\\x1b[33m|_  /\n\x1b[34m/ (_ /\x1b[37m\\ \\  / / / , _/ __ |/ ___/\x1b[33m/_ <\n\x1b[34m\\___/\x1b[37m___/ /_/ /_/|_/_/ |_/_/  \x1b[33m/____/\x1b[0m');
  } else {
    console.log('  __________________  ___   ___  ____\n / ___/ __/_  __/ _ \\/ _ | / _ \\|_  /\n/ (_ /\\ \\  / / / , _/ __ |/ ___//_ <\n\\___/___/ /_/ /_/|_/_/ |_/_/  /____/');
  }

  console.log(`\nVersion ${VERSION} | A simple front-end bootstrapping and building environment\nCopyright (C) 2013-2018 ConsidoNet Solutions | www.considonet.com | Licence: MIT\n`);

};

const getConfig = function() {

  if(configCache === null) {

    // Deps
    const merge = require('deepmerge');

    // Env base config
    const envConfig = require(path.join(__dirname, "../conf/default.conf"));

    envConfig.paths.cwd = __dirname;

    // Project-specific config
    // Deprecated path
    const deprecatedConfPath = path.join(process.cwd(), './conf/main.conf.js');
    let confPath = path.join(process.cwd(), './gbuildconfig.js');

    if(!fs.existsSync(confPath) && fs.existsSync(deprecatedConfPath)) {
      console.warn(`Deprecated gbuild config path. Please use ${confPath} instead. The deprecated path (${deprecatedConfPath}) support will be removed starting from version 2.0.0.`);
      confPath = deprecatedConfPath;
    }

    if(fs.existsSync(confPath)) {

      const mainConfig = require(confPath);
      configCache = merge(envConfig, mainConfig.cfg);

    } else {

      console.warn(`Project config was not found: ${confPath}`);
      configCache = envConfig;

    }

  }

  return configCache;

};

const Logger = require('./logger');

const gulpInit = function(config) {

  const browserSync = require('browser-sync');
  const logger = new Logger("gbuild", config.logVerbosity);

  // Config legacy settings support
  if(typeof config.hardSourceCache !== "undefined") {

    logger.warn("hardSourceCache config setting is deprecated. Please use webpack.hardSourceCache instead. This feature will be removed starting from version 2.0.0.");

    config.webpack.hardSourceCache = config.hardSourceCache;

  }

  logger.log("Initializing gulp...", 2);

  // Internal gulp tasks: directory cleaner
  gulp.task('clean', require("./gulptasks/clean")(config, gulp));

  // Internal gulp tasks: asset files copy
  gulp.task('assets', require("./gulptasks/assets")(config, gulp));
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

  // Internal gulp tasks: File watchers
  const reloadBrowserSync = function(cb) {
    browserSync.reload();
    cb();
  };

  gulp.task("watch:dist", done => {
    gulp.watch([ path.join(config.paths.input.css, '/**/*', path.join(`!${config.paths.input.css}`, '/**/*.{scss,js,html,vue,map}')) ], gulp.series('assets', "miscassets")); //TODO: it doesnt watch/react
    gulp.watch(path.join(config.paths.input.css, '/**/*.scss'), gulp.series('styles:dist'));
    done();
  });

  gulp.task("watch:dev", done => {
    gulp.watch([ path.join(config.paths.input.css, '/**/*', path.join(`!${config.paths.input.css}`, '/**/*.{scss,js,html,vue,map}')) ], gulp.series('assets', "miscassets")); //TODO: it doesnt watch/react
    gulp.watch(path.join(config.paths.projectRoot, './*.html'), reloadBrowserSync);
    gulp.watch(path.join(config.paths.projectRoot, './Views/**/*.cshtml'), reloadBrowserSync);
    gulp.watch(path.join(config.paths.input.css, '/**/*.scss'), gulp.series('styles:dev'));
    
    // Custom path watchers
    if(config.customWatchers.length>0) {
      config.customWatchers.forEach(watchedPath => {
        gulp.watch(path.join(config.paths.projectRoot, watchedPath), reloadBrowserSync);
      });
    }
    
    done();
  });

  // External gulp tasks
  gulp.task('build', gulp.series("clean", gulp.parallel('assets', "miscassets", 'styles:dist', 'webpack:dist')));
  gulp.task("serve", gulp.series("clean", "assets", "miscassets", "styles:dev", "watch:dev", "webpack:watch", "php", "browsersync"));
  gulp.task("watch", gulp.series("clean", "assets", "miscassets", "styles:dist", gulp.parallel("webpack:watchdist", "watch:dist")));
  gulp.task("fullassets", gulp.series("assets", "miscassets"));

};

const init = function() {
  const conf = getConfig();
  gulpInit(conf);
};

// Exports
module.exports.getConfig = getConfig;

module.exports.getVersion = function() {

  return VERSION;

};

// Build command
module.exports.build = function() {
  init();
  gulp.task("build")();
};

// Serve command
module.exports.serve = function() {
  init();
  gulp.task("serve")();
};

// Watch command
module.exports.watch = function() {
  init();
  gulp.task("watch")();
};

// Assets command
module.exports.assets = function() {
  init();
  gulp.task("fullassets")();
};
