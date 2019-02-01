const imports = {
  "path": require("path"),
  "filter": require("gulp-filter"),
  "imagemin": require("gulp-imagemin"),
  "Logger": require("@considonet/g-logger")
};

module.exports = (config, gulp, mode = "dist") => {

  const logger = new imports.Logger("task-assets", config.logVerbosity);

  return () => {
    const fileFilter = imports.filter(file => file.stat.isFile());

    if(mode==="dist" && config.optimizeAssets) {

      logger.log("Optimizing and copying assets...", 1);

      return gulp.src([
        imports.path.posix.join(config.paths.input.css, '/**/*'),
        imports.path.posix.join(`!${config.paths.input.css}`, '/**/*.{scss,js,html,vue,map}')
      ])
        .pipe(fileFilter)
        .pipe(imports.imagemin({
          verbose: config.logVerbosity >= 2
        }))
        .pipe(gulp.dest(config.paths.output.css));

    } else {

      logger.log("Copying assets...", 1);

      return gulp.src([
        imports.path.posix.join(config.paths.input.css, '/**/*'),
        imports.path.posix.join(`!${config.paths.input.css}`, '/**/*.{scss,js,html,vue,map}')
      ])
        .pipe(fileFilter)
        .pipe(gulp.dest(config.paths.output.css));

    }

  };

};
