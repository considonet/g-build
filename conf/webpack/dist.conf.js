const webpack = require('webpack');

const baseConfig = require("./base.conf")();

baseConfig.plugins.push(new webpack.DefinePlugin({
  'process.env.NODE_ENV': '"production"'
}));

baseConfig.mode = "production";

baseConfig.optimization = {
  minimize: true
};

module.exports = baseConfig;