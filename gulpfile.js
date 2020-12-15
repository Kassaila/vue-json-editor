'use strict';

const gulp = require('gulp');

const global = require('./gulp-config');

const cleanBuild = require('./tasks/clean-build');
const copyFiles = require('./tasks/copy-files');
const buildStyles = require('./tasks/build-styles');
const buildJs = require('./tasks/build-js');
const watch = require('./tasks/watch');

gulp.task(global.task.cleanBuild, cleanBuild());

gulp.task(global.task.buildStyles, buildStyles());

gulp.task(global.task.buildJs, buildJs());

gulp.task(global.task.copyFiles, copyFiles());

gulp.task(global.task.watch, watch());

// develop mode
gulp.task(
  'default',
  gulp.series(
    gulp.series(
      global.task.cleanBuild,
      global.task.buildStyles,
      global.task.buildJs,
      global.task.copyFiles
    ),
    global.task.watch
  )
);

// production mode
gulp.task(
  global.task.build,
  gulp.series(
    global.task.cleanBuild,
    global.task.buildStyles,
    global.task.buildJs,
    global.task.copyFiles
  )
);
