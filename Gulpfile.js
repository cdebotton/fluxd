'use strict';

var gulp = require('gulp');
var to5 = require('gulp-6to5');
var pruno = require('pruno').use(gulp);
var config = pruno.config;

config.srcDir = 'src';
config.output = './dist/';

pruno.extend('to5', function() {
  gulp.task('to5', function() {
    return gulp.src('./src/**/*.js')
      .pipe(to5())
      .pipe(gulp.dest('./dist/'));
  });
  config.registerWatcher('to5', './src/**/*.js');
  return config.queueTask('to5');
});

pruno(function(runner) {
  runner.del('./dist');
  runner.to5();
});
