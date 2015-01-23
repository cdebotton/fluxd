'use strict';

var pruno = require('pruno');
var to5 = require('gulp-6to5');
var plumber = require('gulp-plumber');

function to5Task(params) {
  this.params = params;
  this.displayName = 'to5';

  require('6to5/register');
}

to5Task.getDefaults = function() {
  return {
    entry: '::src/**/*.js',
    search: '::src/**/*.js',
    dist: '::dist'
  };
};

to5Task.prototype.enqueue = function(gulp, params) {
  params || (params = {});

  gulp.src(params.entry)
    .pipe(to5())
    .pipe(plumber())
    .pipe(gulp.dest(params.dist));
};

to5Task.prototype.generateWatcher = function() {
  return true;
};

module.exports = pruno.extend(to5Task);
