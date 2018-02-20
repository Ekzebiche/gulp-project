var build = './build';
var src = './src';

module.exports = {

  src: src,
  build: build,

  html: {
    src: ['*.html', '!_*.html'],
    cwd: src + '/html/',
    dest: build,
    data: './src/html/data/global.json',
    watch: '**/*.{html,json}'
  },

  less: {
    src: 'styles.less',
    cwd: src + '/css/less/',
    dest: build + '/css/',
    watch: '**/*.less'
  },

  css: {
    src: '*.css',
    cwd: src + '/css/csslib/',
    dest: build + '/css/',
    watch: '*.css'
  },

  spritePNG: {
    src: '*.png',
    cwd: src + '/images/sprite/png/',
    dest: build + '/images/',
    less: src + '/css/less/sprite/',
    watch: '*.png'
  },

  spriteSVG: {
    src: '*.svg',
    cwd: src + '/images/sprite/svg/',
    dest: build + '/images/',
    html: src + '/html/data/',
    less: src + '/css/less/sprite/',
    watch: '*.svg'
  },

  imgGeneral: {
    src: './**/*.{jpg,jpeg,gif,png,svg,ico}',
    cwd: src + '/images/general/',
    dest: build + '/images/',
    watch: '**/*.{jpg,jpeg,gif,png,svg,ico}'
  },

  imgTemp: {
    src: './**/*.*',
    cwd: src + '/images/content/',
    dest: build + '/temp/',
    watch: '**/*.*'
  },

  scripts: {
    src: './**/*.js',
    cwd: src + '/js/',
    dest: build + '/js/',
    watch: '**/*.js'
  },

  fonts: {
    src: '*.*',
    cwd: src + '/fonts/',
    dest: build + '/fonts/',
    watch: '*.*'
  },

  static: {
    src: './**/*.*',
    cwd: src + '/static/',
    dest: build,
    watch: '**/*.*'
  },

};
