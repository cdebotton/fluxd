'use strict';

var gulp = require('gulp');
var to5 = require('gulp-6to5');
var plumber = require('gulp-plumber');

gulp.task('js', function() {
  gulp.src('./src/**/*.js')
    .pipe(to5())
    .pipe(plumber())
    .pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['js']);
gulp.task('watch', function() {
  gulp.watch(['./src/**/*.js'], ['default']);
});
