const gulp = require('gulp');
const del = require('del');
const fs = require('fs');
const runSequence = require('run-sequence');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const _ = require('lodash');

const revision = Date.now();

gulp.task('clean', () => {
  return del(['dist']);
});

gulp.task('webpack', () => {
  const webpackConfig = require('./webpack.config');
  return gulp.src('client/entries/app.js').pipe(webpackStream(webpackConfig, webpack)).pipe(gulp.dest('dist/'));
});

gulp.task('i18nJson2Js', (callback) => {
  const i18nDir = 'dist/i18n';
  const names = fs.readdirSync('i18n');
  _.forEach(names, (name) => {
    const json = fs.readFileSync(`i18n/${name}`, 'utf-8');
    const js = `window.ENV.i18n=${json};`;
    try {
      fs.statSync(i18nDir);
    } catch (e) {
      fs.mkdirSync(i18nDir);
    }
    fs.writeFileSync(`${i18nDir}/${name.replace('.json', '.js')}`, js);
  });
  callback();
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
    let newRevision = `={revision:'/${revision}'`;
    if (!$2) {
      newRevision += ',';
    }
    return newRevision;
  }));
  callback();
});

gulp.task('build', (callback) => {
  return runSequence('clean', 'webpack', 'i18nJson2Js', 'local', callback);
});
