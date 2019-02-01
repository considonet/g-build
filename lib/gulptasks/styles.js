const imports = {
  "path": require("path"),
  "sass": require("gulp-sass"),
  "autoprefixer": require("gulp-autoprefixer"),
  "sourcemaps": require("gulp-sourcemaps"),
  "browserSync": require("browser-sync"),
  "scssImporter": require("@considonet/g-scssimporter"),
  "Logger": require("@considonet/g-logger"),
  "stylelint": require("gulp-stylelint")
};

module.exports = (config, gulp, mode) => {

  const logger = new imports.Logger("task-styles", config.logVerbosity);
  const scssImporter = new imports.scssImporter(config.logVerbosity);

  if(config.paths.output.css === false) {
    return () => {
      logger.log("No CSS output directory, SCSS compilation disabled", 2);
      return new Promise(resolve => { resolve(); });
    };
  }

  return () => {

    const autoprefixerConfig = config.autoprefixer;
    autoprefixerConfig.browsers = config.targetBrowsers;

    const onError = function(error) {
      logger.error("SCSS compiler error: "  + error.messageFormatted);
      this.emit('end');
    };

    const onLintError = function(error) {
      logger.error("SCSS linting failed!");
      this.emit('end');
    };

    switch(mode) {

      case "dev":

        logger.log("Compiling styles (development mode)...", 1);

        if(config.lint.scss) {

          return gulp.src(imports.path.posix.join(config.paths.input.css, '/**/*.scss'))
            .pipe(imports.sourcemaps.init())
            .pipe(imports.stylelint({
              failAfterError: false,
              reporters: [
                {formatter: config.logVerbosity > 1 ? "verbose" : "console", console: true}
              ]
            }))
            .pipe(imports.sass({
              importer: (f, p, d) => {
                return scssImporter.importerCallback(f, p, d);
              }
            }).on('error', onError))
            .pipe(imports.sourcemaps.write())
            .pipe(gulp.dest(config.paths.output.css))
            .pipe(imports.browserSync.stream());

        } else {

          return gulp.src(imports.path.posix.join(config.paths.input.css, '/**/*.scss'))
            .pipe(imports.sourcemaps.init())
            .pipe(imports.sass({
              importer: (f, p, d) => {
                return scssImporter.importerCallback(f, p, d);
              }
            }).on('error', onError))
            .pipe(imports.sourcemaps.write())
            .pipe(gulp.dest(config.paths.output.css))
            .pipe(imports.browserSync.stream());

        }

      default:

        logger.log("Compiling styles (production mode)...", 1);

        if(config.lint.scss) {

          return gulp.src(imports.path.posix.join(config.paths.input.css, '/**/*.scss'))
            .pipe(imports.stylelint({
              failAfterError: true,
              reporters: [
                {formatter: config.logVerbosity > 1 ? "verbose" : "console", console: true}
              ]
            }).on('error', onLintError))
            .pipe(imports.sass({
              outputStyle: 'compressed',
              importer: (f, p, d) => {
                return scssImporter.importerCallback(f, p, d);
              }
            }).on('error', onError))
            .pipe(imports.autoprefixer(autoprefixerConfig))
            .pipe(gulp.dest(config.paths.output.css));

        } else {

          return gulp.src(imports.path.posix.join(config.paths.input.css, '/**/*.scss'))
            .pipe(imports.sass({
              outputStyle: 'compressed',
              importer: (f, p, d) => {
                return scssImporter.importerCallback(f, p, d);
              }
            }).on('error', onError))
            .pipe(imports.autoprefixer(autoprefixerConfig))
            .pipe(gulp.dest(config.paths.output.css));

        }

    }

  };

};
