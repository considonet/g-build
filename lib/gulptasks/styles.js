const imports = {
  "path": require("path"),
  "sass": require("gulp-dart-sass"),
  "sourcemaps": require("gulp-sourcemaps"),
  "browserSync": require("browser-sync"),
  "scssImporter": require("@considonet/g-scssimporter"),
  "Logger": require("@considonet/g-logger"),
  "postcss": require("gulp-postcss"),
  "stylelint": require("gulp-stylelint"),
  "gulpif": require("gulp-if"),
  "postcssWebp": require("../postcss-webp"),
  "bubble": require("../bubble")
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

    const onError = function(error) {
      logger.error("SCSS compiler error: "  + error.messageFormatted);
      if(config.bubbleNotifications.styles) {
        imports.bubble(error.message, "SCSS", `${error.relativePath} (${error.line}:${error.column})`);
      }
      this.emit('end');
    };

    const onLintError = function(error) {
      logger.error("SCSS linting failed!");
      this.emit('end');
    };

    logger.log(`Compiling styles (mode: ${mode})...`, 1);

    const lintReporters = [
      {formatter: config.logVerbosity > 1 ? "verbose" : "console", console: true}
    ];

    if(config.bubbleNotifications.styles) {

      const rPath = imports.path.posix.join(process.cwd(), config.paths.input.css, "./");

      lintReporters.push({
        formatter: results => {
          const failedPaths = results.filter(r => r.errored || (r.warnings.length)).map(r => ({ path: r.source.replace(rPath, ""), warnings: r.warnings.length }));
          if(failedPaths.length > 0) {
            imports.bubble(failedPaths.map(p => `${p.path}: ${p.warnings} problem(s)`).join("\n"), "SCSS/stylelint", "Linting failed");
          }
        }
      });
    }

    return gulp.src(imports.path.posix.join(config.paths.input.css, '/**/*.scss'))
      .pipe(imports.gulpif(mode === "dev", imports.sourcemaps.init()))
      .pipe(imports.gulpif(config.lint.scss, imports.stylelint({
        failAfterError: mode !== "dev",
        reporters: lintReporters
      }).on('error', onLintError)))
      .pipe(imports.sass({
        outputStyle: "expanded",
        importer: (f, p, d) => scssImporter.importerCallback(f, p, d)
      }).on('error', onError))
      .pipe(imports.gulpif(config.webpSupport !== false, // WebP-only PostCSS
        imports.postcss([
          imports.postcssWebp(config.webpSupport)
        ])
      ))
      .pipe(imports.gulpif(config.postcss, // User-specific PostCSS
        imports.postcss()
      ))
      .pipe(imports.gulpif(mode === "dev", imports.sourcemaps.write()))
      .pipe(gulp.dest(config.paths.output.css))
      .pipe(imports.gulpif(mode === "dev", imports.browserSync.stream()));

  };

};
