/**
 * Copy folders to the build folder
 */
'use strict';

const gulp = require('gulp');

const global = require('../gulp-config.js');

module.exports = function () {
  const filesList = ['./src/styles/*.scss'];

  return () => {
    return gulp.src(filesList, { dot: true }).pipe(gulp.dest(`./${global.folder.build}`));
  };
};
