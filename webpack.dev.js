const base = require('./webpack.base');

const config = base;

config.mode = 'development';
config.watch = false;
config.watchOptions = {
  ignored: ['example/**/*', 'node_modules']
};

module.exports = config;
