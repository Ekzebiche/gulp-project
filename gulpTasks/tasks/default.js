var gulp = require('gulp');
var runSequence = require('run-sequence');

// Default task
gulp.task('default', function(cb) {
  runSequence(
    'clean',
    'fonts',
    'sprite:png',
    'sprite:svg',
    'img:general',
    'img:temp',
    ['html', 'less', 'css'],
    'scripts',
    'static',
    'browserSync',
    'watch',
    cb
  );
});
