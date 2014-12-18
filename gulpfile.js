'use strict';

var fs = require('fs');
var config = require('./build/build.config.js');
var karmaConfig = require('./build/karma.config.js');
var protractorConfig = require('./build/protractor.config.js');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var pkg = require('./package');
var karma = require('karma').server;
var del = require('del');
var url = require('url');
var proxy = require('proxy-middleware');
var filelog = require('gulp-filelog');
var replace = require('gulp-replace-task');
var minifyCSS = require('gulp-minify-css');

var _ = require('lodash');
/* jshint camelcase:false*/
var webdriverStandalone = require('gulp-protractor').webdriver_standalone;
var webdriverUpdate = require('gulp-protractor').webdriver_update;
var currEnv = 'dev';

//update webdriver if necessary, this task will be used by e2e task
gulp.task('webdriver:update', webdriverUpdate);

// run unit tests and watch files
gulp.task('tdd', function(cb) {
  karma.start(_.assign({}, karmaConfig, {
    singleRun: false,
    action: 'watch',
    browsers: ['PhantomJS']
  }), cb);
});

// run unit tests with travis CI
gulp.task('travis', ['build'], function(cb) {
  karma.start(_.assign({}, karmaConfig, {
    singleRun: true,
    browsers: ['PhantomJS']
  }), cb);
});

// optimize images and put them in the dist folder
gulp.task('images', function() {
  return gulp.src(config.images)
    .pipe($.imagemin({
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest(config.dist + '/assets/images'))
    .pipe($.size({
      title: 'images'
    }));
});

//generate angular templates using html2js
gulp.task('templates', function() {
  return gulp.src(config.tpl)
    .pipe($.changed(config.tmp))
    .pipe($.html2js({
      outputModuleName: 'templates',
      base: 'client',
      useStrict: true
    }))
    .pipe($.concat('templates.js'))
    .pipe(filelog())
    .pipe(gulp.dest(config.tmp))
    .pipe($.size({
      title: 'templates'
    }));
});

//generate css files from scss sources
gulp.task('sass', function() {
  return gulp.src(config.mainScss)
    .pipe($.rubySass({
      loadPath: [
        process.cwd() + '/client/vendor/bootstrap-sass-official/assets/stylesheets'
      ]
    }))
    .on('error', function(err) {
      console.log(err.message);
    })
    .pipe(gulp.dest(config.tmp))
    .pipe($.size({
      title: 'sass'
    }));
});

//build files for creating a dist release
gulp.task('build:dist', ['clean'], function(cb) {
  runSequence(['build', 'copy', 'copy:assets', 'images'], 'html', cb);
});

//build files for development
gulp.task('build', ['clean'], function(cb) {
  runSequence(['sass', 'templates'], cb);
});

//generate a minified css files, 2 js file, change theirs name to be unique, and generate sourcemaps
gulp.task('html', function() {
  var assets = $.useref.assets({
    searchPath: '{build,client}'
  });

  return gulp.src(config.index)
    .pipe(assets)
    .pipe($.if(currEnv != 'prod', $.sourcemaps.init()))
    .pipe($.if('**/*main.js', $.ngAnnotate()))
    .pipe($.if('*.js', $.uglify({
      mangle: false,
    })))
    .pipe($.if('*.css', $.csso()))
    .pipe($.if(['**/*main.js', '**/*main.css'], $.header(config.banner, {
      pkg: pkg
    })))
    .pipe($.rev())
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.revReplace())
    .pipe($.if('*.html', $.minifyHtml({
      empty: true
    })))
    .pipe($.if(currEnv != 'prod', $.sourcemaps.write()))
    .pipe(filelog())
    .pipe($.if('*.css', $.if(currEnv == 'prod', minifyCSS())))
    .pipe(gulp.dest(config.dist))
    .pipe($.size({
      title: 'html'
    }));
});

//copy assets in dist folder
gulp.task('copy:assets', function() {
  return gulp.src(config.assets, {
      dot: true
    }).pipe(gulp.dest(config.dist + '/assets'))
    .pipe($.size({
      title: 'copy:assets'
    }));
});

//copy assets in dist folder
gulp.task('copy', function() {
  return gulp.src([
      config.base + '/*',
      '!' + config.base + '/*.html',
      '!' + config.base + '/src',
      '!' + config.base + '/test'
    ]).pipe(gulp.dest(config.dist))
    .pipe($.size({
      title: 'copy'
    }));
});

//clean temporary directories
gulp.task('clean', del.bind(null, [config.dist, config.tmp]));

//lint files
gulp.task('jshint', function() {
  return gulp.src(config.js)
    .pipe(reload({
      stream: true,
      once: true
    }))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

/* tasks supposed to be public */


//default task
gulp.task('default', ['serve']); //

//run unit tests and exit
gulp.task('test:unit', ['build'], function(cb) {
  karma.start(_.assign({}, karmaConfig, {
    singleRun: true
  }), cb);
});

// Run e2e tests using protractor, make sure serve task is running.
gulp.task('test:e2e', ['webdriver:update'], function() {
  return gulp.src(protractorConfig.config.specs)
    .pipe($.protractor.protractor({
      configFile: 'build/protractor.config.js'
    }))
    .on('error', function(e) {
      throw e;
    });
});

//run the server,  watch for file changes and redo tests.
gulp.task('serve:tdd', function(cb) {
  runSequence(['serve', 'tdd']);
});

//run the server after having built generated files, and watch for changes
gulp.task('serve', ['env:dev', 'build'], function() {
  var proxyOptions = url.parse('http://api.backand.info:8099');
  proxyOptions.route = '/api';
  browserSync({
    browser: ['google chrome'],
    notify: false,
    port: 3001,
    logPrefix: pkg.name,
    server: {
      baseDir: ['build', 'client'],
      middleware: [proxy(proxyOptions)]
    }
  });

  gulp.watch(config.html, reload);
  gulp.watch(config.scss, ['sass', reload]);
  gulp.watch(config.js, ['jshint']);
  gulp.watch(config.tpl, ['templates', reload]);
  gulp.watch(config.assets, reload);
});

//run the app packed in the dist folder
gulp.task('serve:dist', ['env:prod', 'build:dist'], function() {
  browserSync({
    notify: false,
    server: [config.dist]
  });
});

function setEnv(env) {
  // Read the settings from the right file
  var settings = JSON.parse(fs.readFileSync('./client/config/env/' + env + '.json', 'utf8'));

  // Replace each placeholder with the correct value for the variable.
  gulp.src('./client/config/env/consts.js')
    .pipe(replace({ patterns: [{ match: 'consts', replacement: settings }] }))
    .pipe(gulp.dest(config.consts));

  currEnv = env;
}

gulp.task('env:dev', function () {
  setEnv('dev');
});

gulp.task('env:prod', function () {
  setEnv('prod');
});
