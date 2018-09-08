const imports = {
  "path": require("path"),
  "fs": require("fs"),
  "filter": require("gulp-filter"),
  "xml2js": require("xml2js"),
  "browserSyncSpa": require("browser-sync-spa"),
  "browserSync": require("browser-sync"),
  "commandExists": require("command-exists").sync,
  "Logger": require("@considonet/g-logger")
};

module.exports = (config, gulp) => {

  const browserSyncProxyConf = require(imports.path.join(config.paths.cwd, '../conf/browsersync/proxy.conf'));
  const browserSyncServerConf = require(imports.path.join(config.paths.cwd, '../conf/browsersync/server.conf'));

  const logger = new imports.Logger("task-browsersync", config.logVerbosity);

  // Runs the browser-sync proxy to a IIS server
  function browserSyncProxy(url, done) {

    const cfg = browserSyncProxyConf();
    cfg.proxy.target = url;
    cfg.port = config.browsersync.port;
    cfg.open = config.browsersync.openBrowser;

    imports.browserSync.init(cfg);

    if(done) {
      done();
    }

  }

  // Runs a traditional browser-sync server
  function browserSyncServer(done) {

    // SPA mode - supported only in the server mode
    if(config.browsersync.spa) {
      imports.browserSync.use(imports.browserSyncSpa());
    }

    const cfg = browserSyncServerConf();
    cfg.port = config.browsersync.port;
    cfg.open = config.browsersync.openBrowser;

    imports.browserSync.init(cfg);

    if(done) {
      done();
    }

  }

  return done => {

    if(config.browsersync.mode==="auto") {

      logger.log("Detecting running environment...", 2);

      const files = imports.fs.readdirSync(config.paths.projectRoot);

      let visualStudioProjectFile = false;
      let phpEnabled = false;

      files.some(fileName => {

        if(fileName.match(/\.csproj$/)) {
          logger.log(`Visual Studio project detected in ${fileName}`, 1);
          visualStudioProjectFile = imports.path.join(config.paths.projectRoot, fileName);
          return true;
        }

        if(fileName.match(/\.php$/) || fileName === "composer.json") {

          logger.log(`PHP project detected (${fileName})`, 1);

          // Checking if php cli exists
          const phpCli = config.php !== false && config.php.hasOwnProperty('bin') ? config.php.bin : 'php';
          if(imports.commandExists(phpCli)) {
            phpEnabled = true;
          } else {
            logger.warn(`PHP binary not found (${phpCli}), starting browser-sync in server mode.`);
          }

          return true;

        }

      });

      if(visualStudioProjectFile) { // Visual Studio mode

        imports.xml2js.parseString(imports.fs.readFileSync(visualStudioProjectFile, {encoding: "utf8"}), (err, xml) => {

          let failed = false;
          let url = "";

          if (err) {

            failed = true;

          } else {

            try {

              url = xml.Project.ProjectExtensions[0].VisualStudio[0].FlavorProperties[0].WebProjectProperties[0].IISUrl[0];

              if (!url) {
                failed = true;
              }

            } catch (err) {
              failed = true;
            }

          }

          if (failed) {
            logger.warn("Cannot detect IIS Development Server port... Running the server mode.");
            browserSyncServer(done);
          } else {
            browserSyncProxy(url, done);
          }

        });

      } else if(phpEnabled) { // PHP mode

        browserSyncProxy('http://localhost:' + (config.php !== false && config.php.port ? config.php.port : '9000') + '/', done);

      } else { // Server mode

        browserSyncServer(done);

      }

    } else if(config.browsersync.mode==="proxy") {

      logger.log(`Starting browser-sync proxy to ${config.browsersync.proxiedUrl} ...`, 2);
      browserSyncProxy(config.browsersync.proxiedUrl, done);

    } else if(config.browsersync.mode==="server") {

      logger.log("Starting browser-sync server...", 2);
      browserSyncServer(done);

    } else {

      logger.error(`Configuration error. Unsupported browser-sync mode: ${config.browsersync.mode}`)

    }

  };

};
