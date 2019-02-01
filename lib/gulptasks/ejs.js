const imports = {
  "path": require("path"),
  "sass": require("gulp-sass"),
  "autoprefixer": require("gulp-autoprefixer"),
  "sourcemaps": require("gulp-sourcemaps"),
  "ejs": require("gulp-ejs"),
  "browserSync": require("browser-sync"),
  "scssImporter": require("@considonet/g-scssimporter"),
  "Logger": require("@considonet/g-logger"),
  "stylelint": require("gulp-stylelint")
};

module.exports = (config, gulp, mode) => {

  const logger = new imports.Logger("task-styles", config.logVerbosity);

  if(config.paths.output.ejs === false) {
    return () => {
      logger.log("No EJS output directory, EJS compilation disabled", 2);
      return new Promise(resolve => { resolve(); });
    };
  }

  return () => {

    const onError = function(error) {
      logger.error("EJS compiler error: "  + error.messageFormatted);
      this.emit('end');
    };

    logger.log("Compiling EJS files...", 1);
    return gulp.src(imports.path.posix.join(config.paths.input.ejs, '/*.ejs'))
      .pipe(imports.ejs(config.ejsVars, {}, { ext: ".html" }).on('error', onError))
      .pipe(gulp.dest(config.paths.output.ejs))

  };

};
