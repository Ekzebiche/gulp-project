var gulp = require('gulp');
var del = require('del');
var path = require('path');
var config  = require('../config');

gulp.task('clean', function(cb) {
  del([path.join(config.build, '/**'), path.join('!', config.build)]).then(function (paths) {
    cb()
  })
});
