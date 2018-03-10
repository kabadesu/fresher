var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var $ = gulpLoadPlugins();
var autoprefixer = require('autoprefixer');

var plugins = [
    autoprefixer({browsers: [
        'last 2 versions',
        '> 5%'
    ]})
]

gulp.task('webserver', function() {
    gulp.src('./dist')
    .pipe($.serverLivereload({
        livereload: true,
        directoryListing: false,
        port: 3000,
        open: true
    }));
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

gulp.task('lint-styles', function () {
    return gulp.src('./src/scss/**/*.scss')
    .pipe($.sassLint())
    .pipe($.sassLint.format())
    .pipe($.sassLint.failOnError())
})

gulp.task('styles', ['lint-styles'], function () {
    return gulp.src('./src/scss/**/*.scss')
    .pipe($.sass().on('error', $.sass.logError))
    .pipe($.postcss(plugins))
    .pipe(gulp.dest('./dist/css'))
});

gulp.task('watch', function () {
    gulp.watch('./src/scss/**/*.scss', ['styles']);
    gulp.watch('./src/js/**/*.js', ['copy-js']);
    gulp.watch('./src/index.html', ['copy-html']);
});

gulp.task('default', ['copy', 'styles', 'watch', 'webserver']);
