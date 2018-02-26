const config = require("../../lib/api").getConfig();
const url = require("url");

module.exports = () => {

  const base = {
    server: {
      baseDir: config.paths.projectRoot,
      directory: true
    }
  };

  // Url rewrites
  if(config.browsersync.urlRewrites.length>0) {

    base.server.middleware = [

      (req, res, next) => {

        let fileName = url.parse(req.url).href;

        config.browsersync.urlRewrites.forEach(rewriteEntry => {

          if(fileName.match(rewriteEntry.src)) {
            req.url = rewriteEntry.dest;
          }

        });

        return next();

      }

    ];

  }

  return base;

};
