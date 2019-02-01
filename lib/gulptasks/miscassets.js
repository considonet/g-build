const imports = {
  "path": require("path"),
  "filter": require("gulp-filter"),
  "Logger": require("@considonet/g-logger")
};

module.exports = (config, gulp) => {

  const logger = new imports.Logger("task-miscassets", config.logVerbosity);

  if(config.paths.output.misc === false) {
    return () => {
      logger.log("No misc output directory, misc assets not copied", 2);
      return new Promise(resolve => { resolve(); });
    };
  }

  return () => {

    const fileFilter = imports.filter(file => file.stat.isFile());

    logger.log("Copying misc assets...", 2);

    return gulp.src([
      imports.path.posix.join(config.paths.input.misc, '/**/*')
    ])
      .pipe(fileFilter)
      .pipe(gulp.dest(config.paths.output.misc));

  };

};
