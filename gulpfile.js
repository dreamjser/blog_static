'use strict';

const gulp = require('gulp');
const gulpif = require('gulp-if');
const scss = require('gulp-sass');
const clean = require('gulp-clean');
const rev = require('gulp-rev');
const plumber = require('gulp-plumber');
const uglify = require('gulp-uglify');
const eslint = require('gulp-eslint');
const minicss = require('gulp-clean-css');
const revcss = require('gulp-rev-css-url');
const replace = require('gulp-replace');
const connect = require('gulp-connect');
const base64 = require('gulp-base64');
const imagemin = require('gulp-imagemin');
const optipng = require('imagemin-optipng');
const jpegtran = require('imagemin-jpegtran');
const spritesmith = require('gulp.spritesmith');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const environments = require('gulp-environments');
const runSequence = require('run-sequence');
const webpack = require('webpack-stream');

/****************************************** 变量 ********************************************/
const path = {
  src: 'src/',
  dist: 'dist/'
};

// 生产静态文件
const PROD_HOST = 'http://static.dreamjser.com/dist/';
// 替换css中的图片字体正则表达式
const REPLACE_REG = /((?:\.\.\/)+)([^"\(\)]+\.(?:gif|jpe?g|png|woff2?|ttf|svg|eot))/g;
// 可编译scss路径
const scssSrcArr = [path.src + 'scss/[^_]*.scss', path.src + 'scss/**/[^_]*.scss'];
// 监听的静态文件路径
const watchAssets = {
  html: path.src + 'templates/**',
  scss: [path.src + 'scss/**', path.src + 'templates/**/*.scss'],
  js: [path.src + 'js/@(entry|modules)/**', path.src + 'components/**']
}

// 环境
const development = environments.development;
const production = environments.production;

// 开发 task
gulp.task('dev', function() {
  runSequence('connect', 'watch');
});

// 生产 task
gulp.task('prod', function() {
  runSequence('clean', 'eslint', ['scss', 'js'], 'rev', ['minicss', 'uglify'], 'base64', ['replace', 'replace:json', 'imagemin']);
});

/****************************************** 开发环境 ********************************************/

// 生成css sprite
gulp.task('sprites', function() {
  return gulp.src(path.src + 'images/_sprites/*.png')
    .pipe(spritesmith({
      imgName: 'sprite.png',
      cssName: '_sprite.scss',
      imgPath: '../../images/sprites/sprite.png',
      padding: 5
    }))
    .pipe(gulpif('*.png', gulp.dest(path.src + 'images/sprites'), gulp.dest(path.src + 'scss/modules')));
});

// js代码检测
gulp.task('eslint', function() {
  return gulp.src([
      path.src + 'js/(entry|modules)/**',
      path.src + 'components/**/**.jsx'
    ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

// scss编译
gulp.task('scss', function() {
  return gulp.src(scssSrcArr)
    .pipe(development(sourcemaps.init()))
    .pipe(scss().on('error', scss.logError))
    .pipe(development(sourcemaps.write()))
    .pipe(production(autoprefixer()))
    .pipe(gulp.dest(path.src + 'css'));
});

// js
gulp.task('js', function() {
  return gulp.src('')
    .pipe(plumber())
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest(''));
});

// 本地服务
gulp.task('connect', function() {
  connect.server({
    root: './',
    livereload: true
  });
});

// 监听
gulp.task('watch', function() {
  gulp.watch(watchAssets.html)
    .on('change', function() {
      gulp.src(watchAssets.html)
        .pipe(connect.reload());
    });
  gulp.watch(watchAssets.scss, ['scss'])
    .on('change', function() {
      gulp.src(watchAssets.scss)
        .pipe(connect.reload());
    });
  gulp.watch(watchAssets.js, ['js'])
    .on('change', function() {
      gulp.src(watchAssets.js)
        .pipe(connect.reload());
    });
});


/****************************************** 生产环境 ********************************************/

// clean rev-manifest.json
gulp.task('clean', function() {
  return gulp.src(['../blog/assets.json'])
    .pipe(clean({
      force: true
    }));
});

// 生成md5版本号
gulp.task('rev', function() {
  return gulp.src([
      path.src + 'css/**',
      path.src + 'js/@(bundle|utils)/**',
      path.src + 'images/**',
      path.src + 'fonts/**',
      '!' + path.src + 'images/_sprites/**'
    ], {
      base: path.src
    })
    .pipe(rev())
    .pipe(revcss())
    .pipe(gulp.dest(path.dist))
    .pipe(rev.manifest({
      path: 'assets.json'
    }))
    .pipe(gulp.dest('../blog'));
});

// css压缩
gulp.task('minicss', function() {
  return gulp.src(path.dist + 'css/**', {
      base: path.dist
    })
    .pipe(minicss())
    .pipe(gulp.dest(path.dist));
});

// js压缩
gulp.task('uglify', function() {
  return gulp.src(path.dist + 'js/**', {
      base: path.dist
    })
    .pipe(uglify())
    .pipe(gulp.dest(path.dist));
});

// 图片压缩
gulp.task('imagemin', function() {
  return gulp.src(path.dist + 'images/**/*.@(jpg|png)', {
      base: path.dist
    })
    .pipe(imagemin({
      use: [optipng({
        optimizationLevel: 3
      }), jpegtran({
        progressive: true
      })]
    }))
    .pipe(gulp.dest(path.dist));
});

// 图片base64转换
gulp.task('base64', function() {
  return gulp.src(path.dist + 'css/**/*.css', {
      base: path.dist
    })
    .pipe(base64({
      maxImageSize: 8 * 1024,
      exclude: [/sprite-[\w]+\.png/, /.+\.(woff2?|ttf|svg|eot)/],
      deleteAfterEncoding: true,
      debug: true
    }))
    .pipe(gulp.dest(path.dist));
});

// 替换
gulp.task('replace', function() {
  return gulp.src([
      path.dist + 'css/**',
      path.dist + 'js/**'
    ], {
      base: path.dist
    })
    .pipe(replace(REPLACE_REG, PROD_HOST + '$2'))
    .pipe(gulp.dest(path.dist));
});

// 删除assets.json的图片和字体映射
gulp.task('replace:json', function() {
  return gulp.src('../blog/assets.json')
    .pipe(replace(/\s*\".+\.(gif|jpe?g|png|woff2?|ttf|svg|eot)\":\s\".+\.(gif|jpe?g|png|woff2?|ttf|svg|eot)\",?/gi, ''))
    .pipe(gulp.dest('../blog'));
});
/****************************************** END ********************************************/
