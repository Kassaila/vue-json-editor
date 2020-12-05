const base = require('./webpack.base');

const config = base;

config.mode = 'production';
config.watch = false;
config.optimization = {
  minimize: true,
};

module.exports = config;
