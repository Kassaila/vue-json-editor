const base = require('./webpack.base');

const config = base;

config.mode = 'development';
config.watch = true;
config.watchOptions = {
  ignored: ['node_modules']
};

module.exports = config;
