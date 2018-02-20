var config  = require('../config').fonts;

var gulp = require('gulp');
var path = require('path');
var changed = require('gulp-changed');
var notify = require('gulp-notify');
var browserSync = require('browser-sync').get('sync');

gulp.task('fonts', function() {
  console.log('---------- Копирование шрифтов');

  return gulp.src(config.src, { cwd: config.cwd })
    .pipe(changed(config.dest)) // Ignore unchanged files
    // .pipe(notify({
    //   title: 'IMG Content',
    //   message: "Boooya! I'm done!"
    // }))
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.stream());
});
