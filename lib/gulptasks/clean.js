const imports = {
  "del": require("del"),
  "Logger": require("@considonet/g-logger")
};

module.exports = (config, gulp) => {

  const logger = new imports.Logger("task-clean", config.logVerbosity);

  if(!config.cleanDirectories) {
    return () => {
      logger.log("Directory cleanup disabled", 3);
      return new Promise(resolve => { resolve(); });
    };
  }

  return () => {
    const dirs = [];

    if(config.paths.output.css !== false) {
      dirs.push("config.paths.output.css");
    }

    if(config.paths.output.misc !== false) {
      dirs.push("config.paths.output.misc");
    }

    if(config.paths.output.js !== false) {
      dirs.push("config.paths.output.js");
    }

    logger.log("Cleaning output directories...", 2);
    logger.log("Cleaning: " + dirs.join(", "), 3);
    return imports.del(dirs, { "force": true });
  };

};
