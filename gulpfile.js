const gulp = require('gulp');
const del = require('del');
const fs = require('fs');
const runSequence = require('run-sequence');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const cleanSemanticUI = require('./client/semantic/tasks/clean');
const buildSemanticUI = require('./client/semantic/tasks/build');

const revision = Date.now();

gulp.task('clean', () => {
  return del(['dist']);
});

gulp.task('clean-semantic-ui', cleanSemanticUI);
gulp.task('semantic-ui', 'clean-semantic-ui', buildSemanticUI);

gulp.task('webpack', () => {
  const webpackConfig = require('./webpack.config');
  return gulp.src('client/entries/app.js').pipe(webpackStream(webpackConfig, webpack)).pipe(gulp.dest('dist/'));
});

gulp.task('local', (callback) => {
  let local;

  try {
    local = fs.readFileSync('local.js', 'utf-8');
  } catch (e) {
    fs.writeFileSync('local.js', 'module.exports={};');
    local = fs.readFileSync('local.js', 'utf-8');
  }

  fs.writeFileSync('local.js', local.replace(/(=\s*\{)[.\s]*(revision:.[^,]+)?/, (matched, $1, $2) => {
    let newRevision = `={revision:'${revision}'`;
    if (!$2) {
      newRevision += ',';
    }
    return newRevision;
  }));

  callback();
});

gulp.task('build', (callback) => {
  return runSequence('clean', 'semantic-ui', 'webpack', 'local', callback);
});
