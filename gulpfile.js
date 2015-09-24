var gulp = require('gulp')
var ts = require('gulp-typescript')
var sourcemaps = require('gulp-sourcemaps')
var tsProject = ts.createProject('tsconfig.json')
var tslint = require('gulp-tslint')
var mocha = require('gulp-mocha')


gulp.task('test', ['build'],function (cb) {
    gulp.src('deploy/test/*.js', {read: false})
        // gulp-mocha needs filepaths so you can't have any plugins before it
        .pipe(mocha({reporter: 'spec'}))
        .once('error', function () {
            process.exit(1)
        })
        .once('end', function () {
            process.exit()
        })
})

gulp.task('tslint', function(){
      return gulp.src(['src/**/*.ts','!ts/typings/**/*.ts'] )
        .pipe(tslint())
        .pipe(tslint.report('verbose'));
})

gulp.task('build', function () {
  var tsResult = tsProject.src() // instead of gulp.src(...)
      .pipe(sourcemaps.init())
      .pipe(ts(tsProject));
  return tsResult.js
          .pipe(sourcemaps.write('.',{includeContent: false, sourceRoot: '../src'}))
          .pipe(gulp.dest('deploy'));
})

gulp.task('static', function(){
  return gulp.src('static/**/*.*')
    .pipe(gulp.dest('deploy/static'))
})

gulp.task('default',['static','build','test'],function cb(cd) {
  process.exit()
  // body...
})
