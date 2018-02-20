var gulp = require('gulp');
var runSequence = require('run-sequence');
var config = require('../config');

gulp.task('watch', function () {
  gulp.watch(config.fonts.watch, { cwd: config.fonts.cwd }, ['fonts']);

  gulp.watch(config.spritePNG.watch, { cwd: config.spritePNG.cwd }, ['sprite:png']);
  gulp.watch(config.spritePNG.watch, { cwd: config.spritePNG.cwd }, ['sprite:svg']);

  gulp.watch(config.imgGeneral.watch, { cwd: config.imgGeneral.cwd }, ['img:general']);
  gulp.watch(config.imgTemp.watch, { cwd: config.imgTemp.cwd }, ['img:temp']);

  gulp.watch(config.html.watch, { cwd: config.html.cwd }, ['html']);

  gulp.watch(config.less.watch, { cwd: config.less.cwd }, ['less']);
  gulp.watch(config.css.watch, { cwd: config.css.cwd }, ['css']);

  gulp.watch(config.scripts.watch, { cwd: config.scripts.cwd }, ['scripts']);

  gulp.watch(config.static.watch, { cwd: config.static.cwd }, ['static']);
});
