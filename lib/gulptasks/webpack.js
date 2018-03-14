const imports = {
  "webpack": require("webpack"),
  "path": require("path"),
  "browserSync": require("browser-sync"),
  "Logger": require("../logger")
};

const webpackWrapper = function (watch, conf, done, config, logger) {

  const onError = function(error) {
    logger.error("Webpack error: "  + error.messageFormatted);
    this.emit('end');
  };

  // Optional (but enabled by default) BundleAnalyzerPlugin which runs only in the watch mode
  if(watch === true) {

    if(config.webpack.enableBundleAnalyzerServer) {

      const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

      conf.plugins.push(new BundleAnalyzerPlugin({
        analyzerMode: "server"
      }));
    }

  }

  const webpackBundler = imports.webpack(conf);

  const webpackChangeHandler = (err, stats) => {

    const statsJson = stats.toJson(true);

    if (err) {
      onError(err);
    }

    logger.log(stats.toString({
      colors: true,
      chunks: false,
      hash: false,
      version: false,
      assets: config.logVerbosity>1,
      modules: config.logVerbosity>1
    }), 1);
    logger.log(`Scripts compiled in ${statsJson.time} ms`, 1);

    if (done) {
      done();
      done = null;
    } else {
      imports.browserSync.reload();
    }
  };

  if (watch) {
    webpackBundler.watch(200, webpackChangeHandler);
  } else {
    webpackBundler.run(webpackChangeHandler);
  }
};

module.exports = (config, gulp, mode) => {

  const logger = new imports.Logger("task-webpack", config.logVerbosity);

  const devConfig = require(imports.path.join(config.paths.cwd, '../conf/webpack/dev.conf'));
  const distConfig = require(imports.path.join(config.paths.cwd, '../conf/webpack/dist.conf'));

  return done => {

    switch(mode) {

      case "dev":
        logger.log("Compiling scripts (development mode)...", 1);
        webpackWrapper(false, devConfig, done, config, logger);
        break;

      case "watch":
        webpackWrapper(true, devConfig, done, config, logger);
        break;

      case "watchdist":
        process.env.NODE_ENV = 'production';
        webpackWrapper(true, distConfig, done, config, logger);
        break;

      default: // dist build
        logger.log("Compiling scripts (production mode)...", 1);
        process.env.NODE_ENV = 'production';
        webpackWrapper(false, distConfig, done, config, logger);
        break;

    }

  };

};