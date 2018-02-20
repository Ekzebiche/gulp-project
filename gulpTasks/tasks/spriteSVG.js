var config  = require('../config').spriteSVG;

var gulp = require('gulp');
var path = require('path');
var del = require('del');
var svgSprite = require('gulp-svg-sprite');
var notify = require('gulp-notify');
var browserSync = require('browser-sync').get('sync');

gulp.task('sprite:svg', function(cb) {
  console.log('---------- Сборка svg спрайтов');

  // del([config.html + 'svg/**']).then(function (paths) {
  //   console.log('Deleted files and folders:\n', paths.join('\n'));
  // });

  del([config.html + 'svg/**']);

  var svg = {
    mode: {
      symbol: { // symbol mode to build the SVG
        render: {
          less: true, // LESS output option for icon sizing
          css: false, // CSS output option for icon sizing
          scss: false // SCSS output option for icon sizing
        },
        dest: 'svg', // destination folder
        prefix: '.icon-%s', // BEM-style prefix if styles rendered
        sprite: 'svg-sprite.svg', //generated sprite name
        example: true // Build a sample page, please!
      }
    }
  };

  return gulp.src(config.src, { cwd: config.cwd })
    .pipe(svgSprite(svg))
    .pipe(gulp.dest(config.html))
    .pipe(browserSync.stream());
});
