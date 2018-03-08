'use strict';

// Подключения зависимостей
const fs = require('fs');
const gulp = require('gulp');
const browserSync = require('browser-sync').create();

const autoprefixer = require('gulp-autoprefixer');
const cleanss = require('gulp-cleancss');

const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const gulpIf = require('gulp-if');
const debug = require('gulp-debug');
const rename = require('gulp-rename');
const size = require('gulp-size');
const del = require('del');
const newer = require('gulp-newer');


// Получение настроек проекта из projectConfig.json
let projectConfig = require('./config.json');
let dirs = projectConfig.dirs;
let lists = getFilesList(projectConfig);
// console.log(lists.js);

// Получение адреса репозитория
let repoUrl = require('./package.json').repository.url.replace(/\.git$/g, '');
console.log('Репозиторий: ' + repoUrl);

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV == 'dev';

// Очистка папки сборки
gulp.task('clean', function () {
  console.log('---------- Очистка папки сборки');
  return del([
    dirs.buildPath + '/**/*',
    // '!' + dirs.buildPath + '/readme.md'
  ]);
});

// Компиляция Less стилей
gulp.task('style:less', function () {
  const less = require('gulp-less');
  const sourcemaps = require('gulp-sourcemaps');
  const wait = require('gulp-wait');
  const insert = require('gulp-insert');

  console.log('---------- Компиляция less');

  return gulp.src(dirs.srcPath + 'css/less/styles.less')
    .pipe(plumber({
      errorHandler: function(err) {
        notify.onError({
          title: 'LESS compilation error',
          message: err.message
        })(err);
        this.emit('end');
      }
    }))
    .pipe(wait(100))
    .pipe(gulpIf(isDev, sourcemaps.init()))
    .pipe(debug({title: "Less:"}))
    .pipe(less({
      includePaths: [__dirname, dirs.srcPath + 'css/less/']
    }))
    .pipe(autoprefixer({
      cascade: false,
      browsers: ['> 1%', 'last 2 versions', 'IE 10'],
    }))
    .pipe(gulpIf(!isDev, cleanss()))
    .pipe(rename('styles.min.css'))
    .pipe(gulpIf(isDev, sourcemaps.write('/')))
    .pipe(size({
      title: 'Размер',
      showFiles: true,
      showTotal: false,
    }))
    .pipe(gulp.dest(dirs.buildPath + '/css'))
    .pipe(browserSync.stream());
});

// Компиляция сторонних css библиотек
gulp.task('style:css', function () {
  const concat = require('gulp-concat');
  const sourcemaps = require('gulp-sourcemaps');
  const wait = require('gulp-wait');

  console.log('---------- Компиляция добавочных стилей');

  if (lists.css.length > 0) {
    return gulp.src(lists.css)
      .pipe(plumber({
        errorHandler: function(err) {
          notify.onError({
            title: 'CSS style compilation error',
            message: err.message
          })(err);
          this.emit('end');
        }
      }))
      .pipe(wait(100))
      .pipe(gulpIf(isDev, sourcemaps.init()))
      .pipe(debug({title: "CSS styles:"}))
      .pipe(concat('plugins.min.css'))
      .pipe(autoprefixer({
        cascade: false,
        browsers: ['> 1%', 'last 2 versions', 'IE 10'],
      }))
      .pipe(gulpIf(!isDev, cleanss()))
      .pipe(gulpIf(isDev, sourcemaps.write('/')))
      .pipe(size({
        title: 'Размер',
        showFiles: true,
        showTotal: false,
      }))
      .pipe(gulp.dest(dirs.buildPath + '/css'))
      .pipe(browserSync.stream());
    } else {
      console.log('---------- В сборке нет добавочных стилей');
      callback();
    }
});

// Сборка HTML
gulp.task('html', function() {
  const data = require('gulp-data');
  const nunjucks = require('gulp-nunjucks-render');
  const htmlbeautify = require('gulp-html-beautify');
  const prettify = require('gulp-prettify');
  const replace = require('gulp-replace');

  console.log('---------- Сборка HTML');

  const getData = function(file) {
    var dataPath = dirs.srcPath + '/html/data/global.json';

    return JSON.parse(fs.readFileSync(dataPath, 'utf8'))
  }

  return gulp.src([dirs.srcPath + '/html/*.html',])
    .pipe(plumber())
    .pipe(data(getData))
    .pipe(nunjucks({
      path: [__dirname+'/', dirs.srcPath + '/html/'],
      envOptions: { watch: false }
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
    .pipe(gulp.dest(dirs.buildPath));
});

// Конкатенация и углификация Javascript
gulp.task('js', function (callback) {
  const uglify = require('gulp-uglify');
  const concat = require('gulp-concat');

  console.log('---------- Обработка JS');

  if (lists.js.length > 0) {
    return gulp.src(lists.js)
      .pipe(plumber({
        errorHandler: function(err) {
          notify.onError({
            title: 'Javascript concat/uglify error',
            message: err.message
          })(err);
          this.emit('end');
        }
      }))
      .pipe(concat('combined.min.js'))
      .pipe(gulpIf(!isDev, uglify().on('error', function(e){console.log(e);})))
      .pipe(size({
        title: 'Размер',
        showFiles: true,
        showTotal: false,
      }))
      .pipe(gulp.dest(dirs.buildPath + '/js'));
    } else {
      console.log('---------- В сборке нет JS-файлов');
      callback();
    }
});

// Копирование JS
gulp.task('copy:js', function (callback) {
  if(projectConfig.copiedJs.length) {
    return gulp.src(projectConfig.copiedJs)
      .pipe(size({
        title: 'Размер',
        showFiles: true,
        showTotal: false,
      }))
      .pipe(gulp.dest(dirs.buildPath + '/js'));
  } else {
    callback();
  }
});


// Копирование основных изображений
gulp.task('copy:img-general', function () {
  const imagemin = require('gulp-imagemin');
  const pngquant = require('imagemin-pngquant');

  console.log('---------- Копирование основных изображений');

  return gulp.src(dirs.srcPath + 'images/general/**/*.{jpg,jpeg,gif,png,svg,ico}')
    .pipe(newer(dirs.buildPath + '/images/general'))
    .pipe(gulpIf(!isDev, imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    })))
    .pipe(size({
      title: 'Размер',
      showFiles: true,
      showTotal: false,
    }))
    .pipe(gulp.dest(dirs.buildPath + '/images'));
});

// Копирование временных изображений
gulp.task('copy:img-content', function () {
  const imagemin = require('gulp-imagemin');
  const pngquant = require('imagemin-pngquant');

  console.log('---------- Копирование временных изображений');

  return gulp.src(dirs.srcPath + 'images/content/**/*.{jpg,jpeg,gif,png,svg,ico}')
    .pipe(newer(dirs.buildPath + '/images/content'))
    .pipe(gulpIf(!isDev, imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    })))
    // .pipe(size({
      // title: 'Размер',
      // showFiles: true,
      // showTotal: false,
    // }))
    .pipe(gulp.dest(dirs.buildPath + '/temp'));
});

// Копирование шрифтов
gulp.task('copy:fonts', function () {
  console.log('---------- Копирование шрифтов');

  return gulp.src(dirs.srcPath + '/fonts/**/*.{ttf,woff,woff2,eot,svg}')
    .pipe(newer(dirs.buildPath + '/fonts'))  // оставить в потоке только изменившиеся файлы
    .pipe(size({
      title: 'Размер',
      showFiles: true,
      showTotal: false,
    }))
    .pipe(gulp.dest(dirs.buildPath + '/fonts'));
});

// Копирование статичных файлов
gulp.task('copy:static', function () {
  console.log('---------- Копирование статичных файлов');

  return gulp.src(dirs.srcPath + 'static/**/*.*')
    .pipe(gulp.dest(dirs.buildPath + '/'));
});

// Сборка растрового спрайта sprite-png
let spritePngPath = dirs.srcPath + 'images/sprite/png/';
gulp.task('sprite:png', function (callback) {
  const spritesmith = require('gulp.spritesmith');
  const buffer = require('vinyl-buffer');
  const merge = require('merge-stream');
  const imagemin = require('gulp-imagemin');
  const pngquant = require('imagemin-pngquant');

  if(fileExist(spritePngPath) !== false) {
    console.log('---------- Сборка PNG спрайтов');

    let spriteData = gulp.src(spritePngPath + '*.png')
      .pipe(spritesmith({
        imgName: '../images/sprite.png',
        cssName: '_sprite.less',
        cssFormat: 'less',
        padding: 4,
        cssTemplate: dirs.srcPath + '/css/less/sprite/less.template.mustache',
      }));
    let imgStream = spriteData.img
      .pipe(buffer())
      .pipe(imagemin({
        use: [pngquant()]
      }))
      .pipe(gulp.dest(dirs.buildPath + '/images'));
    let cssStream = spriteData.css
      .pipe(gulp.dest(dirs.srcPath + '/css/less/sprite/'));
    return merge(imgStream, cssStream);
  } else {
    console.log('---------- Сборка PNG спрайта: ОТМЕНА, нет папки с картинками');
    callback();
  }
});

// Сборка SVG-спрайта для блока sprite-svg
let spriteSvgPath = dirs.srcPath + 'images/sprite/svg/';
gulp.task('sprite:svg', function (callback) {
  const svgstore = require('gulp-svgstore');
  const svgmin = require('gulp-svgmin');
  const cheerio = require('gulp-cheerio');

  if(fileExist(spriteSvgPath) !== false) {
    console.log('---------- Сборка SVG спрайта');

    del(dirs.srcPath + 'html/data/svg/**/*.*');

    return gulp.src(spriteSvgPath + '*.svg')
      .pipe(svgmin(function (file) {
        return {
          plugins: [{
            cleanupIDs: {
              minify: true
            }
          }]
        }
      }))
      .pipe(svgstore({ inlineSvg: true }))
      .pipe(cheerio({
        run: function($) {
          $('svg').attr('style',  'display:none');
        },
        parserOptions: {
          xmlMode: true
        }
      }))
      .pipe(rename('sprite-svg.svg'))
      .pipe(size({
        title: 'Размер',
        showFiles: true,
        showTotal: false,
      }))
      .pipe(gulp.dest(dirs.srcPath + 'html/data/svg/'));
  } else {
    console.log('---------- Сборка SVG спрайта: ОТМЕНА, нет папки с картинками');
    callback();
  }
});

// Сборка всего
gulp.task('build', gulp.series(
  'clean',
  gulp.parallel('sprite:png', 'sprite:svg', 'copy:static'),
  gulp.parallel('style:less', 'style:css', 'js', 'copy:js', 'copy:img-general', 'copy:img-content'),
  'html'
));

// Локальный сервер, слежение
gulp.task('serve', gulp.series('build', function() {

  browserSync.init({
    server: dirs.buildPath,
    port: 3000,
    startPath: 'index.html',
    open: false,
  });

  // Less
  gulp.watch(dirs.srcPath + 'css/less/**/*.less', gulp.series('style:less'));

  // Стили, которые нужно компилировать отдельно
  let cssPaths = [ dirs.srcPath + 'css/csslib/*.css' ]
  cssPaths.concat(projectConfig.addCssBefore, projectConfig.addCssAfter);
  gulp.watch(dirs.srcPath + 'css/csslib/**/*.css', gulp.series('style:css'));

  // HTML
  gulp.watch(dirs.srcPath + 'html/**/*.*', gulp.series('html', reload));

  // JS-файлы
  gulp.watch(lists.js, gulp.series('js', reload));

  // JS-файлы, которые нужно просто копировать
  if(projectConfig.copiedJs.length) {
    gulp.watch(projectConfig.copiedJs, gulp.series('copy:js', reload));
  }

  // Основные изображения
  gulp.watch(dirs.buildPath + 'images/general/*.{jpg,jpeg,gif,png,svg,ico}', gulp.series('copy:img-general', reload));

  // Временные изображения
  gulp.watch(dirs.buildPath + 'images/content/*.{jpg,jpeg,gif,png,svg,ico}', gulp.series('copy:img-content', reload));

  // Шрифты
  gulp.watch(dirs.srcPath + 'fonts/*.{ttf,woff,woff2,eot,svg}', gulp.series('copy:fonts', reload));

  // Статичные файлы
  gulp.watch(dirs.buildPath + 'static/**/*.*', gulp.series('copy:static', reload));

  // PNG-изображения, попадающие в спрайт
  gulp.watch('*.png', {cwd: spritePngPath}, gulp.series('sprite:png', reload));

  // SVG-изображения, попадающие в спрайт
  gulp.watch('*.svg', {cwd: spriteSvgPath}, gulp.series('sprite:svg', reload));
}));

// Задача по умолчанию
gulp.task('default', gulp.series('serve'));

/**
 * Вернет объект с обрабатываемыми файлами и папками
 * @param  {object}
 * @return {object}
 */
function getFilesList(config){

  let res = {
    'css': [],
    'js': []
  };

  // Добавления
  res.css = res.css.concat(config.addCssAfter);
  res.css = config.addCssBefore.concat(res.css);
  res.js = res.js.concat(config.addJsAfter);
  res.js = config.addJsBefore.concat(res.js);

  return res;
}

/**
 * Проверка существования файла или папки
 * @param  {string} path  Путь до файла или папки
 * @return {boolean}
 */
function fileExist(filepath){
  let flag = true;

  try {
    fs.accessSync(filepath, fs.F_OK);
  } catch(e) {
    flag = false;
  }

  return flag;
}

// Перезагрузка браузера
function reload(done) {
  browserSync.reload();
  done();
}
