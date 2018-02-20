var config = require('../config').html;

var gulp = require('gulp');
var path = require('path');
var data = require('gulp-data');
var fs = require('fs');
var plumber = require('gulp-plumber');
var nunjucks = require('gulp-nunjucks-render');
var markdown = require('nunjucks-markdown');
var htmlbeautify = require('gulp-html-beautify');
var prettify = require('gulp-prettify');
var replace = require('gulp-replace');
var marked = require('marked');
var notify = require('gulp-notify');
var browserSync = require('browser-sync').get('sync');

gulp.task('html', function() {
  console.log('---------- Сборка html');

  var env = nunjucks.nunjucks.configure([config.cwd], {
    watch: false
  });

  env.addFilter('limit', function (input, limit) {
    if (typeof limit !== 'number') {
      return input;
    }
    if (typeof input === 'string') {
      if (limit >= 0) {
        return input.substring(0, limit);
      } else {
        return input.substr(limit);
      }
    }
    if (Array.isArray(input)) {
      limit = Math.min(limit, input.length);
      if (limit >= 0) {
        return input.slice(0, limit);
      } else {
        return input.slice(input.length + limit, input.length);
      }
    }
    return input;
  });

  markdown.register(env, marked.setOptions({
    breaks: true
  }));

  var getData = function(file) {
    var dataPath = path.resolve(config.data)

    return JSON.parse(fs.readFileSync(dataPath, 'utf8'))
  }

  return gulp.src(config.src, { cwd: config.cwd })
    .pipe(plumber({
      errorHandler: notify.onError({
        title: 'Html compilation error',
        message: "Error: <%= error.message %>"
      })
    }))
    .pipe(data(getData))
    .pipe(nunjucks({
      path: [path.join(config.cwd)],
    }))
    .pipe(prettify({
      indent_inner_html: false,
      preserve_newlines: true,
      unformatted: []
    }))
    // .pipe(htmlbeautify())
    // и... привет бьютификатору!
    // .pipe(replace(/^(\s*)(<header.+?>)(.*)(<\/header>)/gm, '$1$2\n$1  $3\n$1$4'))
    // .pipe(replace(/^(\s*)(<footer.+?>)(.*)(<\/footer>)/gm, '$1$2\n$1  $3\n$1$4'))
    // .pipe(replace(/^\s*<section.+>/gm, '\n$&'))
    // .pipe(replace(/^\s*<\/section>/gm, '$&\n'))
    // .pipe(replace(/^\s*<article.+>/gm, '\n$&'))
    // .pipe(replace(/^\s*<\/article>/gm, '$&\n'))
    // .pipe(replace(/\n\n\n/gm, '\n\n'))
    .pipe(notify({
      title: 'HTML',
      message: "Boooya! I'm done!"
    }))
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.reload({ stream: true }));
});
