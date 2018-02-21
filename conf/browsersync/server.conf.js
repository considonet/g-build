const config = require("../../lib/api").getConfig();

module.exports = () => ({
  server: {
    baseDir: config.paths.projectRoot,
    directory: true
  }
});
