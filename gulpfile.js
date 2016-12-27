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
const changed = require('gulp-changed');

/****************************************** 变量 ********************************************/
const path = {
	src: 'src/',
	dist: 'dist/'
};

// 生产静态文件服务器目录
const PROD_HOST = 'http://static.dreamjser.com/dist/';

// 替换css中的图片字体正则表达式
const REPLACE_REG = /((?:\.\.\/)+)([^"\(\)]+\.(?:gif|jpe?g|png|woff2?|ttf|svg|eot))/g;

// 可编译scss路径
const scssSrcArr = [
	path.src + 'scss/[^_]*.scss',
	path.src + 'scss/**/[^_]*.scss'
];

// 环境
const development = environments.development;
const production = environments.production;

// 开发 task
gulp.task('dev', function () {
	runSequence('scss', 'watch');
});

// 生产 task
gulp.task('prod', function () {
	runSequence('clean', 'scss', 'rev', ['replace:json', 'imagemin']);
});

/****************************************** 开发环境 ********************************************/

// 生成css sprite
gulp.task('sprites', function () {
	return gulp.src(path.src + 'images/_sprites/*.png')
		.pipe(spritesmith({
			imgName: 'sprite.png',
			cssName: '_sprite.scss',
			imgPath: '../../images/sprites/sprite.png',
			padding: 5
		}))
		.pipe(gulpif('*.png', gulp.dest(path.src + 'images/sprites'), gulp.dest(path.src + 'scss/modules')));
});

// scss编译
gulp.task('scss', function () {
	return gulp.src(scssSrcArr)
		.pipe(development(sourcemaps.init()))
		.pipe(scss().on('error', scss.logError))
		.pipe(development(sourcemaps.write()))
		// 生产环境
		.pipe(production(base64({
			maxImageSize: 8 * 1024,
			exclude: [/sprite-[\w]+\.png/, /.+\.(woff2?|ttf|svg|eot)/]
		})))
		.pipe(production(autoprefixer()))
		.pipe(production(minicss()))
		.pipe(production(replace(REPLACE_REG, PROD_HOST + '$2')))
		.pipe(development(gulp.dest(path.src + 'css')))
		.pipe(production(gulp.dest(path.src + 'css')));
});

// 本地服务
gulp.task('connect', function () {
	connect.server({
		root: './',
		port: 8000,
		livereload: true
	});
});

// 监听
gulp.task('watch', function () {
	gulp.watch(path.src + 'scss/**', ['scss']);
});


/****************************************** 生产环境 ********************************************/

// clean rev-manifest.json
gulp.task('clean', function () {
	return gulp.src(['../blog/assets.json'])
		.pipe(clean({
			force: true
		}));
});

// 生成md5版本号
gulp.task('rev', function () {
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

// 图片压缩
gulp.task('imagemin', function () {
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


// 删除assets.json的图片和字体映射
gulp.task('replace:json', function () {
	return gulp.src('../blog/assets.json')
		.pipe(replace(/\s*\".+\.(gif|jpe?g|png|woff2?|ttf|svg|eot)\":\s\".+\.(gif|jpe?g|png|woff2?|ttf|svg|eot)\",?/gi, ''))
		.pipe(gulp.dest('../blog'));
});
/****************************************** END ********************************************/
