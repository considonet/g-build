const imports = {
  "del": require("del"),
  "Logger": require("@considonet/g-logger")
};

module.exports = (config, gulp) => {

  const logger = new imports.Logger("task-clean", config.logVerbosity);

  return () => {
    const dirs = [config.paths.output.css, config.paths.output.misc, config.paths.output.js];
    logger.log("Cleaning output directories...", 2);
    logger.log("Cleaning: " + dirs.join(", "), 3);
    return imports.del(dirs, { "force": true });
  };

};
