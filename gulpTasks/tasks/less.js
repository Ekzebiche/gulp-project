var config  = require('../config').less;

var gulp = require('gulp');
var path = require('path');
var plumber = require('gulp-plumber');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var cssnano = require('gulp-clean-css');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var notify = require('gulp-notify');
var browserSync = require('browser-sync').get('sync');

gulp.task('less', function() {
  console.log('---------- Сборка less');

  return gulp.src(config.src, { cwd: config.cwd })
    .pipe(plumber({
      errorHandler: function(err) {
        notify.onError({
          title: 'Styles compilation error',
          message: err.message
        })(err);
        this.emit('end');
      }
    }))
    .pipe(less())
    .pipe(autoprefixer({
      cascade: false,
      browsers: ['> 1%', 'last 2 versions', 'IE 10'],
    }))
    .pipe(cssnano({ compatibility: 'ie10' }))
    .pipe(rename({suffix: '.min'}))
    .pipe(notify({
      title: 'LESS',
      message: "Boooya! I'm done!"
    }))
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.stream());
});
