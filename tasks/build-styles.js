/**
 * Build styles for application from SASS
 */
'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const rename = require('gulp-rename');

const notifier = require('../helpers/notifier');
const global = require('../gulp-config.js');

sass.compiler = require('sass');

module.exports = function () {
  const production = global.isProduction();
  const plugins = [autoprefixer()];

  if (production) {
    plugins.push(cssnano());
  }

  return (done) => {
    return gulp
      .src(`./${global.folder.dev}/styles/*.scss`, { sourcemaps: false })
      .pipe(rename(`${global.file.styles.build}`))
      .pipe(sass.sync({ sourceMap: false }))
      .on('error', (error) => notifier.error(error.message, 'Main Sass compiling error', done))
      .pipe(postcss(plugins))
      .pipe(gulp.dest(`./${global.folder.build}`));
  };
};
