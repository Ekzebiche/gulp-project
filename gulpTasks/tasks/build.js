var gulp = require('gulp');
var runSequence = require('run-sequence');
var config = require('../config');

gulp.task('build', function(cb) {
  runSequence('clean', 'fonts', 'sprite:png', 'sprite:svg', 'img:general', 'img:temp', 'html', 'less', 'css', 'scripts', 'static', cb);
});
