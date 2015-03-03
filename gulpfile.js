(function() {
  'use strict';

  var paths, gulp, jshint, csslint, stylish, svgmin, imagemin, usemin, prefixer, bowerJSON, fs, replace, runSequence, authors, dependencies, languages, clean, jsonlint, node_env, less, revall, extend, uglify, minifyCss, minifyHtml, annotate, gutil, rename, gzip, notify;

  gulp = require('gulp');
  runSequence = require('run-sequence');

  replace     = require('gulp-replace');
  clean       = require('gulp-rimraf');
  jshint      = require('gulp-jshint');
  csslint     = require('gulp-csslint');
  jsonlint    = require('gulp-jsonlint');
  stylish     = require('jshint-stylish');
  svgmin      = require('gulp-svgmin');
  imagemin    = require('gulp-imagemin');
  usemin      = require('gulp-usemin');
  prefixer    = require('gulp-autoprefixer');
  less        = require('gulp-less');
  bowerJSON   = require('./bower.json');
  fs          = require('fs');
  revall      = require('gulp-rev-all');
  extend      = require('gulp-extend');
  uglify      = require('gulp-uglify');
  minifyHtml  = require('gulp-minify-html');
  minifyCss   = require('gulp-minify-css');
  annotate    = require('gulp-ng-annotate');
  gutil       = require('gulp-util');
  rename      = require("gulp-rename");
  gzip        = require('gulp-gzip');
  notify      = require("gulp-notify");

  /* File Paths
   *
   * Files and directories groups for file types.
   */

  paths = {
    scripts: [
      'gulpfile.js',
      'app/scripts/**/*.js'
    ],
    styles: 'app/styles/**/*.css',
    jsons: [
      'bower.json',
      'package.json',
      'app/locales/**/*.json'
    ],
    dest: '.tmp/'
  };

  /* Variables
   */

  authors = []; // Project authors and maintainers
  dependencies = []; // Project Third-party dependencies.
  languages = []; // Translation languages this project is available in.

  dependencies = Object.keys(bowerJSON.dependencies || {}).sort().join(', ');
  bowerJSON.authors.forEach(function(author) {
    var result = [];
    result.push(author.name);
    if (author.url) {
      result.push('Site: ' + author.url);
    }
    if (author.twitter) {
      result.push('Twitter: ' + author.twitter);
    }
    if (author.location) {
      result.push('Location: ' + author.location);
    }
    authors.push(result.join('\n'));
  });

  fs.readdir('./app/locales/', function(err, files) {
    files.filter(function(file) {
      return file.substr(-5) === '.json';
    })
      .forEach(function(file) {
        languages.push(file.replace('.json', ''));
      });
  });
  console.log(languages);

  /**
   * @name env
   *
   * @describe returns the given NODE_ENV.
   * @returns {string} environment stage.
   */
  node_env = process.env.NODE_ENV || 'development';

  /**
   * @name Lint Tasks
   *
   * @desc
   * Code linting checks code for simple mistakes that may cause an issue
   * later in the build process.
   *
   * Code quality is a good thing.
   */

  gulp.task('lint', ['lint:css', 'lint:js', 'lint:json']);

  gulp.task('lint:js', function() {
    return gulp.src(paths.scripts)
      .pipe(jshint())
      .pipe(jshint.reporter(stylish));
  });

  gulp.task('lint:css', function() {
    return gulp.src(paths.styles)
      .pipe(csslint('.csslintrc'))
      .pipe(csslint.reporter());
  });

  gulp.task('lint:json', function() {
    return gulp.src(paths.jsons)
      .pipe(jsonlint())
      .pipe(jsonlint.reporter());
  });

  /**
   * @name Code Minimisation Tasks
   *
   * @desc
   * Cuts the fat and gristle from the application.
   */

  gulp.task('minify', [
    'usemin',
    'min:img',
    'min:svg'
  ]);

  gulp.task('usemin', function() {
    return gulp.src('app/*.html')
      .pipe(node_env !== 'development' ? usemin({
        // css: [minifyCss()],
        htmlmin: false, // Setting true will cause issues with JavaScript dependant on custom attributes.,
        js: [annotate(), uglify({
          mangle: false,
          dead_code: true
        })]
      }) : gutil.noop())
      .pipe(node_env === 'development' ? usemin({
        htmlmin: false // Setting true will cause issues with JavaScript dependant on custom attributes.,
      }) : gutil.noop())
      .pipe(gulp.dest(paths.dest));
  });

  gulp.task('min:img', function() {
    return gulp.src('app/images/**/*.{png,jpg,gif,jpeg}')
      .pipe(imagemin())
      .pipe(gulp.dest('.tmp/images/'));
  });

  gulp.task('min:svg', function() {
    return gulp.src('app/images/**/*.svg')
      .pipe(svgmin())
      .pipe(gulp.dest('.tmp/images/'));
  });

  gulp.task('min_css', function() {
    return gulp.src('public/**/*.css')
      .pipe(node_env !== 'development' ? minifyCss() : gutil.noop())
      .pipe(gulp.dest('public/'));
  });

  /**
   * @name Compiler Tasks
   *
   * @desc
   * A collection of tasks that perform code automated code alterations.
   */

  /**
   * @name AutoPrefixer
   * @desc
   * Parses CSS and add vendor prefixes to CSS rules using values from
   * Can I Use.
   *
   * [autoprefixer](https://github.com/ai/autoprefixer)
   */
  gulp.task('autoprefixer', function() {
    return gulp.src(
      '.tmp/styles/*.css'
    )
      .pipe(
      prefixer('> 1%', 'last 2 versions', 'Firefox ESR', 'Explorer >= 9')
    )
      .pipe(gulp.dest('.tmp/styles/'));
  });

  gulp.task('replace', function() {
    return gulp.src('.tmp/**/*.{txt,js,css,html}', {
      base: paths.dest
    })
      .pipe(replace('{{@@TEAM}}', authors.join('\n\n')))
      .pipe(replace('{{@@VERSION}}', bowerJSON.version))
      .pipe(replace('{{@@BUILD_DATE}}', new Date().toISOString()))
      .pipe(replace('{{@@COMPONENTS}}', dependencies))
      .pipe(replace('{{@@LANGUAGES}}', languages.sort().join(', ')))
      .pipe(replace('{{@@ENV}}', node_env))
      .pipe(gulp.dest(paths.dest));
  });

  /**
   * @name less
   *
   * @desc
   * Pre-compiles `.less` files into `.css` files
   */
  gulp.task('less', function() {
    return gulp.src('app/less/**/*.less')
      .pipe(less())
      .pipe(gulp.dest('app/less/'));
  });


  /**
   * @name Utility Tasks
   *
   * @desc
   * Useful tasks that do useful things.
   */

  gulp.task('copy', function() {
    return gulp.src([
      'app/*.{txt,ico,xml}',
      'app/views/**/*.html',
      'app/locales/**/*.json',
      'app/fonts/**/*.{woff,ttf,eot,otf,svg}',
    ], {
      base: 'app/'
    })
      .pipe(gulp.dest(paths.dest));
  });

  gulp.task('clean', function() {
    return gulp.src(['public/', '.tmp'], {
      read: false
    })
      .pipe(clean());
  });

  gulp.task('clean_tmp', function() {
    return gulp.src(['.tmp/index.html', '.tmp/views/', '.tmp/styles', '.tmp/scripts', '.tmp/locales', '.tmp/fonts', '.tmp/images'], {
      read: false
    })
      .pipe(clean());
  });

  gulp.task('rev', function() {
    return gulp.src('.tmp/**')
      .pipe(revall({
        quiet: true,
        ignore: ['favicon.ico', '.html', 'robots.txt', 'humans.txt']
      }))
      .pipe(gulp.dest('public/'));
  });

  gulp.task('copy_index_html', function() {
    return gulp.src('public/index.html')
      .pipe(gulp.dest('public/'));
  });

  gulp.task('compress', function() {
      return gulp.src([
        'public/styles/*.*',
        'public/images/**/*.*',
        'public/fonts/**/*.*',
        'public/scripts/*.js',
        'public/locales/**/*.json',
        'public/views/**/*.html',
        'public/*.html'
      ], {
        base: 'public/'
      })
        .pipe(gzip())
        .pipe(gulp.dest('public/'));
    }
  );

  gulp.task('notify_finished', function() {
    return gulp.src("public/index.html")
      .pipe(notify("GoteoStatistics build finished!!!"));
  });

  /**
   * @name Main Tasks
   *
   * @desc
   * The main two tasks `build` and `watch` will do what is says on the tin.
   *
   * The default task when running `gulp` will be `build`.
   */

  gulp.task('build', ['lint'], function() {
    return runSequence(
      'clean',
      ['copy', 'less'],
      ['minify'],
      ['autoprefixer'],
      'replace',
      'rev',
      'min_css',
      'copy_index_html',
      'clean_tmp',
      'notify_finished'
    );
  });

  gulp.task('watch', ['build'], function() {
    return gulp.watch([
      'app/*.txt',
      'app/styles/**/*.css',
      'app/less/**/*.less',
      'app/scripts/**/*.js',
      'app/views/**/*.html',
      'app/locales/**/*.json',
      'app/*.html',
    ], ['build']);
  });

  gulp.task('default', ['build']);

}).call(this);

