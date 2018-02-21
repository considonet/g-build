const imports = {
  "path": require("path"),
  "fs": require("fs"),
  "filter": require("gulp-filter"),
  "xml2js": require("xml2js"),
  "browserSyncSpa": require("browser-sync-spa"),
  "browserSync": require("browser-sync"),
  "Logger": require("../logger")
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

    done();

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
    done();

  }

  return done => {

    logger.log("Detecting running environment...", 2);

    const files = imports.fs.readdirSync(config.paths.projectRoot);

    let visualStudioProjectFile = false;

    files.forEach(fileName => {

      if(fileName.match(/\.csproj$/)) {
        logger.log(`Visual Studio project detected in ${fileName}`, 1);
        visualStudioProjectFile = path.join(config.paths.projectRoot, fileName);
      }

    });

    if(visualStudioProjectFile) {

      imports.xml2js.parseString(fs.readFileSync(visualStudioProjectFile, { encoding: "utf8" }), (err, xml) => {

        let failed = false;
        let url = "";

        if(err) {

          failed = true;

        } else {

          try {

            url = xml.Project.ProjectExtensions[0].VisualStudio[0].FlavorProperties[0].WebProjectProperties[0].IISUrl[0];

            if(!url) {
              failed = true;
            }

          } catch(err) {
            failed = true;
          }

        }

        if(failed) {
          logger.warn("Cannot detect IIS Development Server port... Running the server mode.", 2);
          browserSyncServer(done);
        } else {
          browserSyncProxy(url, done);
        }

      });

    } else {

      browserSyncServer(done);

    }

  };

};