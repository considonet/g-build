module.exports = function () {
  return {
    proxy: {
      ws: true,
      middleware: function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        next();
      }
    }
  };
};
