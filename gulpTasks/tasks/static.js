var config  = require('../config').static;

var gulp = require('gulp');
var path = require('path');
var changed = require('gulp-changed');
var notify = require('gulp-notify');
var browserSync = require('browser-sync').get('sync');

gulp.task('static', function() {
  console.log('---------- Копирование сторонних файлов');

  return gulp.src(config.src, { cwd: config.cwd })
    .pipe(changed(config.dest)) // Ignore unchanged files
    // .pipe(notify({
    //   title: 'IMG Content',
    //   message: "Boooya! I'm done!"
    // }))
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.stream());
});
