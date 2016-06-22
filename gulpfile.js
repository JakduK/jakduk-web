var gulp = require('gulp');

var sass = require('gulp-sass');
var inject = require('gulp-inject');

gulp.task('dev', function() {
  // var cssFiles = gulp.src('./client/**/*.scss')
  //   .pipe(sass())
  //   .pipe(gulp.dest('./public'));

  gulp.src('./server/views/home/home.hbs')
    .pipe(inject(gulp.src('./src/importantFile.js', {
      read: false
    }), {
      name: 'script'
    }))
    .pipe(inject(gulp.src([
      './src/*.js', '!./src/importantFile.js'
    ], {
      read: false
    })))
    .pipe(gulp.dest('./public'));
});

gulp.task('uploadToS3', function() {
  
});

gulp.task('default', function() {

});