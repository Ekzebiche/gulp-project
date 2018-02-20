var config  = require('../config').imgGeneral;

var gulp = require('gulp');
var path = require('path');
var changed = require('gulp-changed');
var notify = require('gulp-notify');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var browserSync = require('browser-sync').get('sync');

gulp.task('img:general', function() {
  console.log('---------- Копирование основных изображений');

  // console.log(config.watch, { cwd: config.cwd });

  return gulp.src(config.src, { cwd: config.cwd })
    .pipe(changed(config.dest)) // Ignore unchanged files
    .pipe(imagemin({
      interlaced: true,
      progressive: true,
      optimizationLevel: 5,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    // .pipe(notify({
    //   title: 'IMG General',
    //   message: "Boooya! I'm done!"
    // }))
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.stream());
});
