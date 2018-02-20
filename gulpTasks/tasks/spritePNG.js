var config  = require('../config').spritePNG;

var gulp = require('gulp');
var path = require('path');
var spritesmith = require('gulp.spritesmith');
var notify = require('gulp-notify');
var browserSync = require('browser-sync').get('sync');

gulp.task('sprite:png', function() {
  console.log('---------- Сборка png спрайтов');

  var spriteData =  gulp.src(config.src, { cwd: config.cwd })
    .pipe(spritesmith({
      padding: 5,
      cssFormat: 'less',
      cssName: config.less + '_sprite.less',
      algorithm: 'binary-tree',
      imgName: 'sprite.png',
      cssTemplate: config.less + 'less.template.mustache',
    }))

    spriteData.img.pipe(gulp.dest(config.dest));
    spriteData.css.pipe(gulp.dest(config.less));
});
