var postcss = require('gulp-postcss'),
    gulp = require('gulp'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),
    inline = require('gulp-inline'),
    uglify = require('gulp-uglify'),
    htmlmin = require('gulp-htmlmin'),
    del = require('del'),
    ghPages = require('gulp-gh-pages');

var SRC_PATH = './src/';
var DEST_PATH = './public/';

gulp.task('clean', function () {
  return del([
    DEST_PATH.concat('index.html'),
    DEST_PATH.concat('styles.css'),
  ]);
});

gulp.task('cleanCss', function () {
  return del([
    DEST_PATH.concat('styles.css'),
  ]);
});

gulp.task('css', function() {
  var processors = [
    autoprefixer({browsers: ['last 1 version']}),
    cssnano(),
  ];

  return gulp.src(SRC_PATH.concat('styles.css'))
    .pipe(postcss(processors))
    .pipe(gulp.dest(DEST_PATH));
});

gulp.task('inline', function() {
  return gulp.src(SRC_PATH.concat('index.html'))
    .pipe(inline({
      base: DEST_PATH,
      disabledTypes: ['svg', 'img'], // Only inline css files
    }))
    .pipe(gulp.dest(DEST_PATH));
});

gulp.task('minify', function() {
  return gulp.src(DEST_PATH.concat('index.html'))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(DEST_PATH));
});

gulp.task('deploy', function() {
  return gulp.src(DEST_PATH.concat('**/*'))
    .pipe(ghPages({
      branch: 'master'
    }));
});

gulp.task('build', gulp.series('clean', 'css', 'inline', 'minify', 'cleanCss'));

gulp.task('default', gulp.series('build'));
