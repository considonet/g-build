const imports = {
  "path": require("path"),
  "filter": require("gulp-filter"),
  "imagemin": require("gulp-imagemin"),
  "webp": require("imagemin-webp"),
  "gulpif": require("gulp-if"),
  "rename": require("gulp-rename"),
  "Logger": require("@considonet/g-logger")
};

module.exports = (config, gulp) => {

  const logger = new imports.Logger("task-webp", config.logVerbosity);

  if(config.webpSupport === false) {
    return () => {
      logger.log("No WebP support enabled, skipping", 5);
      return new Promise(resolve => { resolve(); });
    };
  }

  if(config.paths.output.css === false) {
    return () => {
      logger.log("No CSS output directory, skipping", 2);
      return new Promise(resolve => { resolve(); });
    };
  }

  const webpConfig = Object.assign({}, {
    replaceExtension: true,
    extensions: [ "png" ],
    codecConfig: {
      lossless: true
    }
  }, config.webpSupport !== false ? config.webpSupport : {});
  const webpExtensions = webpConfig.extensions;

  return () => {
    const fileFilter = imports.filter(file => file.stat.isFile());
    const webpFilter = imports.filter(webpExtensions.length > 1 ? `**/*.{${webpExtensions.join(",")}}` : `**/*.${webpExtensions[0]}`);

    logger.log("Converting image assets to WebP...", 1);

    return gulp.src([
      imports.path.posix.join(config.paths.input.css, '/**/*'),
      imports.path.posix.join(`!${config.paths.input.css}`, '/**/*.{scss,js,html,vue,map}')
    ])
      .pipe(fileFilter)
      .pipe(webpFilter)
      .pipe(imports.imagemin([ imports.webp(webpConfig.codecConfig) ]))
      .pipe(imports.rename(p => {
        p.extname = webpConfig.replaceExtension ? ".webp" : p.extname + ".webp";
      }))
      .pipe(gulp.dest(config.paths.output.css));

  };

};
