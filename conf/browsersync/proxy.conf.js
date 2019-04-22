const config = require("../../lib/api").getConfig();

module.exports = function () {
  return {
    notify: config.browsersync.notify,
    proxy: {
      ws: true,
      middleware: function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        next();
      }
    }
  };
};
