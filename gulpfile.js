var gulp = require('gulp');
var path = require('path');
var cssmin = require('gulp-cssmin');



gulp.task('minify', function () {
    return gulp.src('./static/assets/front.css')
        .pipe(cssmin())
        .pipe(gulp.dest('./static/assets'))
})