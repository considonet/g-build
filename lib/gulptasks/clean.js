const imports = {
  "del": require("del"),
  "Logger": require("@considonet/g-logger")
};

module.exports = (config, gulp) => {

  const logger = new imports.Logger("task-clean", config.logVerbosity);

  return () => {
    const dirs = [];

    if(config.cleanDirectories.ejs && config.paths.output.ejs !== false) {
      dirs.push(config.paths.output.ejs);
    }

    if(config.cleanDirectories.css && config.paths.output.css !== false) {
      dirs.push(config.paths.output.css);
    }

    if(config.cleanDirectories.misc && config.paths.output.misc !== false) {
      dirs.push(config.paths.output.misc);
    }

    if(config.cleanDirectories.js && config.paths.output.js !== false) {
      dirs.push(config.paths.output.js);
    }

    logger.log("Cleaning output directories...", 2);
    logger.log("Cleaning: " + dirs.join(", "), 3);
    return imports.del(dirs, { "force": true });
  };

};
