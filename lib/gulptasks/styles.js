const imports = {
  "path": require("path"),
  "sass": require("gulp-sass"),
  "autoprefixer": require("gulp-autoprefixer"),
  "sourcemaps": require("gulp-sourcemaps"),
  "browserSync": require("browser-sync"),
  "scssImporter": require("../scssimporter"),
  "Logger": require("../logger")
};

module.exports = (config, gulp, mode) => {

  const logger = new imports.Logger("task-styles", config.logVerbosity);
  const scssImporter = new imports.scssImporter(config.logVerbosity);

  return () => {

    const autoprefixerConfig = config.autoprefixer;
    autoprefixerConfig.browsers = config.targetBrowsers;

    const onError = function(error) {
      logger.error("SCSS compiler error: "  + error.messageFormatted);
      this.emit('end');
    };

    switch(mode) {

      case "dev":

        logger.log("Compiling styles (development mode)...", 1);

        return gulp.src(imports.path.join(config.paths.input.css, '/**/*.scss'))
          .pipe(imports.sourcemaps.init())
          .pipe(imports.sass({
            importer: (f, p, d) => {
              return scssImporter.importerCallback(f, p, d);
            }
          }).on('error', onError))
          .pipe(imports.sourcemaps.write())
          .pipe(gulp.dest(config.paths.output.css))
          .pipe(imports.browserSync.stream());

      default:

        logger.log("Compiling styles (production mode)...", 1);

        return gulp.src(imports.path.join(config.paths.input.css, '/**/*.scss'))
          .pipe(imports.sass({
            outputStyle: 'compressed',
            importer: (f, p, d) => {
              return scssImporter.importerCallback(f, p, d);
            }
          }).on('error', onError))
          .pipe(imports.autoprefixer(autoprefixerConfig))
          .pipe(gulp.dest(config.paths.output.css));

    }

  };

};