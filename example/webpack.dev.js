const base = require('./webpack.base');

const config = base;

config.mode = 'development';
config.watch = true;
config.watchOptions = {
  ignored: ['node_modules'],
};

config.devtool = 'inline-source-map';

config.devServer = {
  contentBase: '../docs',
  port: 9000,
};

module.exports = config;
