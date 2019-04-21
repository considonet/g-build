const imports = {
  "path": require("path"),
  "sass": require("gulp-sass"),
  "autoprefixer": require("gulp-autoprefixer"),
  "sourcemaps": require("gulp-sourcemaps"),
  "browserSync": require("browser-sync"),
  "scssImporter": require("@considonet/g-scssimporter"),
  "Logger": require("@considonet/g-logger"),
  "cssnano": require("gulp-cssnano"),
  "stylelint": require("gulp-stylelint"),
  "gulpif": require("gulp-if")
};

module.exports = (config, gulp, mode = "production") => {

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

    logger.log(`Compiling styles (mode: ${mode})...`, 1);

    return gulp.src(imports.path.posix.join(config.paths.input.css, '/**/*.scss'))
      .pipe(imports.gulpif(mode === "dev", imports.sourcemaps.init()))
      .pipe(imports.gulpif(config.lint.scss, imports.stylelint({
        failAfterError: mode !== "dev",
        reporters: [
          {formatter: config.logVerbosity > 1 ? "verbose" : "console", console: true}
        ]
      }).on('error', onLintError)))
      .pipe(imports.sass({
        outputStyle: mode !== "dev" ? "expanded" : "nested",
        importer: (f, p, d) => scssImporter.importerCallback(f, p, d)
      }).on('error', onError))
      .pipe(imports.gulpif(mode === "dev", imports.sourcemaps.write()))
      .pipe(imports.gulpif(mode !== "dev", imports.autoprefixer(autoprefixerConfig)))
      .pipe(imports.gulpif(mode !== "dev", imports.cssnano()))
      .pipe(gulp.dest(config.paths.output.css))
      .pipe(imports.gulpif(mode === "dev", imports.browserSync.stream()));

  };

};
