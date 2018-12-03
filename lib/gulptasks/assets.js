const imports = {
  "path": require("path"),
  "filter": require("gulp-filter"),
  "Logger": require("@considonet/g-logger")
};

module.exports = (config, gulp) => {

  const logger = new imports.Logger("task-assets", config.logVerbosity);

  return () => {
    const fileFilter = imports.filter(file => file.stat.isFile());

    logger.log("Copying assets...", 2);

    return gulp.src([
      imports.path.posix.join(config.paths.input.css, '/**/*'),
      imports.path.posix.join(`!${config.paths.input.css}`, '/**/*.{scss,js,html,vue,map}')
    ])
      .pipe(fileFilter)
      .pipe(gulp.dest(config.paths.output.css));
  };

};
