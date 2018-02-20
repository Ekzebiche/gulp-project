var config  = require('../config').css;

var gulp = require('gulp');
var path = require('path');
var plumber = require('gulp-plumber');
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');
var cssnano = require('gulp-clean-css');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var notify = require('gulp-notify');
var browserSync = require('browser-sync').get('sync');

gulp.task('css', function() {
  console.log('---------- Сборка css');

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
    .pipe(concat('plugins.css'))
    .pipe(autoprefixer({
      cascade: false,
      browsers: ['> 1%', 'last 2 versions', 'IE 10'],
    }))
    .pipe(cssnano({ compatibility: 'ie10' }))
    .pipe(rename({suffix: '.min'}))
    .pipe(notify({
      title: 'CSS',
      message: "Boooya! I'm done!"
    }))
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.stream());
});
