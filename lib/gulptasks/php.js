const imports = {
  "path": require("path"),
  "fs": require("fs"),
  "php": require("node-php-awesome-server"),
  "commandExists": require("command-exists").sync,
  "Logger": require("../logger")
};

module.exports = (config, gulp) => {

  const logger = new imports.Logger("php", config.logVerbosity);

  return done => {

    let enablePhp = config.php !== false;

    // Browsersync auto mode cooperation
    if(config.browsersync.mode==="auto") {

      const files = imports.fs.readdirSync(config.paths.projectRoot);

      files.some(fileName => {

        if(fileName.match(/\.php$/)) {

          if(config.php === false) {
            config.php = {};
          }

          // Setting default root path if not set
          if(!config.php.hasOwnProperty('root')) {
            config.php.root = config.paths.projectRoot;
          }

          enablePhp = true;
          return true;

        }

      });

    }

    if(enablePhp) {

      // Checking if php cli exists
      const phpCli = config.php !== false && config.php.hasOwnProperty('bin') ? config.php.bin : 'php';

      if(!imports.commandExists(phpCli)) {

        logger.warn(`PHP binary not found (${phpCli}), not starting the PHP server.`);
        enablePhp = false;

      }

    }

    if(enablePhp) {

      logger.log("Starting PHP server...", 1);

      if(!config.php.hasOwnProperty("output")) {

        if(config.logVerbosity<=1) {
          config.php.output = {
            startup: false,
            date: true,
            ip: false,
            os: false,
            browser: false,
            device: false,
            statusCode: false,
            method: false
          };
        }

      }

      const php = imports.php(config.php);

      php.on('connect', () => {

        if(done) {
          done();
        }

      });

    } else {

      if(done) {
        done();
      }

    }

  }

};
