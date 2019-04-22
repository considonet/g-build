const imports = {
  "path": require("path"),
  "ejs": require("gulp-ejs"),
  "browserSync": require("browser-sync"),
  "Logger": require("@considonet/g-logger"),
  "rename": require("gulp-rename"),
  "bubble": require("../bubble")
};

module.exports = (config, gulp, mode) => {

  const logger = new imports.Logger("task-ejs", config.logVerbosity);

  if(config.paths.output.ejs === false) {
    return () => {
      logger.log("No EJS output directory, EJS compilation disabled", 2);
      return new Promise(resolve => { resolve(); });
    };
  }

  return () => {

    const onPipeError = function(error) {

      logger.error("EJS compilation failed: "  + error.toString());

      if(config.bubbleNotifications.ejs) {

        const rPath = imports.path.posix.join(process.cwd(), config.paths.input.ejs, "./");
        const msg = error.message.indexOf("\n\n")!== -1 ? error.message.split("\n\n")[1].split("\n")[0].trim() : error.message;
        imports.bubble(error.name + ": " + msg, "EJS", typeof error.fileName !== "undefined" ? error.fileName.replace(rPath, "") : null);

      }

      this.emit('end');

    };

    logger.log("Compiling EJS files...", 1);

    return gulp.src(imports.path.posix.join(config.paths.input.ejs, '/*.ejs'))
      .pipe(imports.ejs(config.ejsVars)).on("error", onPipeError)
      .pipe(imports.rename({ extname: ".html" }))
      .pipe(gulp.dest(config.paths.output.ejs));

  };

};
