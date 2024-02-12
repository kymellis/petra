(function() {

  'use strict';

  // Include Gulp & Plugins
  var gulp         = require('gulp'),
      sass         = require('gulp-sass')(require('sass')),
      rtlcss       = require('gulp-rtlcss'),
      cleanCSS     = require('gulp-clean-css'),
      autoprefixer = require('gulp-autoprefixer'),
      concat       = require('gulp-concat'),
      rename       = require('gulp-rename'),
      uglify       = require('gulp-uglify'),
      jshint       = require('gulp-jshint'),
      replace      = require('gulp-replace'),
      size         = require('gulp-size'),
      zip          = require('gulp-zip'),
      fs           = require('fs');

  // SASS
  gulp.task('sass', function (done) {
    return gulp.src('./assets/sass/*.scss')
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(rename({suffix: '-min'}))
    .pipe(cleanCSS())
    .pipe(gulp.dest('./assets/css'))
    .pipe(rtlcss())                     // Convert to RTL
    .pipe(rename({ suffix: '-rtl' }))   // Rename style.css to 'style-rtl.css'
    .pipe(gulp.dest('./assets/css'))    // Output RTL stylesheets
    .pipe(size())
    done();
  });

  // inlineCSS
  gulp.task('inlinecss', function(done) {
    return gulp.src(['partials/css/style.hbs'])
    .pipe(replace('@@compiled_css', fs.readFileSync('assets/css/style-min.css')))
    .pipe(gulp.dest('partials/css/dist'))
    done();
  });

  // inlineCSS-RTL
  gulp.task('inlinecss-rtl', function(done) {
    return gulp.src(['partials/css/style-rtl.hbs'])
    .pipe(replace('@@compiled_css_rtl', fs.readFileSync('assets/css/style-min-rtl.css')))
    .pipe(gulp.dest('partials/css/dist'))
    done();
  });

  // JavaScript
  gulp.task('js', function(done) {
    return gulp.src([
      './bower_components/jquery/dist/jquery.js',
      './node_modules/lazysizes/lazysizes.min.js',
      './node_modules/prismjs/prism.js',
      './assets/js/fslightbox.js',
      './assets/js/app.js'])
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'))
      .pipe(concat('app.js'))
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify())
      .pipe(gulp.dest('./assets/js'))
      .pipe(size())
      done();
  });

  // Watch
  gulp.task('watch', function() {
    gulp.watch('assets/sass/**/*.scss', gulp.series('build_css'));
    gulp.watch('./assets/js/app.js', gulp.series('js'));
  });

  gulp.task(
    'build_css',
    gulp.series('sass', 'inlinecss', 'inlinecss-rtl')
  );

  gulp.task(
    'build',
    gulp.series('build_css', 'js')
  );

  gulp.task('zip', function () {
    return gulp.src([
      './**',
      '!node_modules/**',
      '!bower_components/**',
      '!.git/**',
      '!.DS_Store',
      '!bun.lockb',
      '!package-lock.json'
    ], { dot: true })
    .pipe(zip('petra.zip'))
    .pipe(gulp.dest('../'))
    done();
  });

  gulp.task(
    'default',
    gulp.series('build', 'watch')
  );

})();