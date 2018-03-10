var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var $ = gulpLoadPlugins();
var autoprefixer = require('autoprefixer');

gulp.task('webserver', function() {
    gulp.src('./dist')
    .pipe($.serverLivereload({
        livereload: true,
        directoryListing: false,
        port: 3000,
        open: true
    }));
});

gulp.task('styles', function () {
    return gulp.src('./src/scss/**/*.scss')
    .pipe($.sass().on('error', $.sass.logError))
    .pipe(gulp.dest('./dist/css'))
});

gulp.task('copy-html', function () {
    return gulp.src('./src/index.html')
    .pipe(gulp.dest('./dist/'))
});

gulp.task('copy-js', function () {
    return gulp.src('./src/js/**/*.js')
    .pipe(gulp.dest('./dist/js'))
});

gulp.task('copy', ['copy-html', 'copy-js']);

gulp.task('watch', function () {
    gulp.watch('./src/scss/**/*.scss', ['styles']);
    gulp.watch('./src/index.html', ['copy-html']);
});

gulp.task('default', ['styles', 'watch', 'copy', 'webserver']);
