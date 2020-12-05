const baseConfig = require('./webpack.base');

const config = baseConfig;

config.mode = 'production';
config.watch = false;
config.optimization = {
  minimize: true,
};

module.exports = config;
