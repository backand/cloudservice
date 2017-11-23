'use strict';

//basic configuration object used by gulp tasks
module.exports = {
  port: 3000,
  tmp: 'build/tmp',
  dist: 'build/dist',
  base: 'client',
  tpl: [
    'client/views/**/*.html',
    'client/common/**/*.html',
    '!client/index.html',
  ],
  mainScss: 'client/assets/stylesheets/main.scss',
  scss: 'client/assets/stylesheets/**/*.scss',
  js: [
    'client/common/**/*.js',
    'client/config/*.js',
    'client/views/**/*.js',
    '!client/vendor/**/*.js',
    'client/test/unit/**/*.js',
    'client/test/e2e/**/*.js'
  ],
  index: 'client/index.html',
  assets: 'client/assets',
  images: 'client/assets/images/**/*',
  banner: ['/**',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * @version v<%= pkg.version %>',
    ' * @link <%= pkg.homepage %>',
    ' * @license <%= pkg.license %>',
    ' */',
    ''
  ].join('\n'),
  consts: 'client/config',
  rsync: {
    src: 'build/dist/**',
    options: {
      destination: '~/public_html/apps/',
      root: 'build/dist',
      hostname: 'www.backand.com',
      username: 'backan6',
      port: '2222',
      incremental: true,
      progress: true,
      relative: true,
      emptyDirectories: false,
      recursive: true,
      clean: false,
      silent: true,
      exclude: ['.DS_Store'],
      include: []
    }
  }
};
