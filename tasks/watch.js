/**
 * Watch for file changes
 */
'use strict';

const gulp = require('gulp');

const global = require('../gulp-config.js');

module.exports = function (options) {
  return () => {
    gulp.watch(`./src/styles/**/*.scss`, gulp.series(global.task.buildStyles));

    gulp.watch([`./src/**/*.js`, `./src/**/*.vue`], gulp.series(global.task.buildJs));
  };
};
