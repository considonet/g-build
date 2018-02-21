const webpack = require('webpack');

const baseConfig = require("./base.conf")();

baseConfig.devtool = "source-map";

baseConfig.plugins.push(new webpack.DefinePlugin({
  'process.env.NODE_ENV': '"dev"'
}));

module.exports = baseConfig;