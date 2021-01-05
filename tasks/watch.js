/**
 * Watch for file changes
 */

const gulp = require('gulp');

const global = require('../gulp-config.js');

module.exports = function () {
  return () => {
    gulp.watch(`./src/styles/**/*.scss`, gulp.series(global.task.buildStyles));

    gulp.watch([`./src/**/*.js`, `./src/**/*.vue`], gulp.series(global.task.buildJs));
  };
};
