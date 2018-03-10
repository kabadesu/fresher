const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const autoprefixer = require('autoprefixer');

const $ = gulpLoadPlugins();

// gulp-eslint can read from .eslintignore but it makes the task run slower.
const eslintFileList = [
    'src/js/**/*.js',
    '!node_modules/**',
    '!dist/**',
    '!src/js/vendor/**',
];

const postcssPlugins = [
    autoprefixer({
        browsers: [
            'last 2 versions',
            '> 5%',
        ],
    }),
];

gulp.task('webserver', () => {
    gulp.src('./dist')
        .pipe($.serverLivereload({
            livereload: true,
            directoryListing: false,
            port: 3000,
            open: true,
        }));
});

gulp.task('copy-html', () => gulp.src('./src/index.html')
    .pipe(gulp.dest('./dist/')));

gulp.task('copy-js', ['lint-js'], () => gulp.src('./src/js/**/*.js')
    .pipe(gulp.dest('./dist/js')));

gulp.task('copy', ['copy-html', 'copy-js']);

gulp.task('lint-styles', () => gulp.src('./src/scss/**/*.scss')
    .pipe($.sassLint())
    .pipe($.sassLint.format())
    .pipe($.sassLint.failOnError()));

gulp.task('lint-js', () => gulp.src(eslintFileList)
    .pipe($.eslint({ useEslintrc: true }))
    .pipe($.eslint.format()));

gulp.task('styles', ['lint-styles'], () => gulp.src('./src/scss/**/*.scss')
    .pipe($.sass().on('error', $.sass.logError))
    .pipe($.postcss(postcssPlugins))
    .pipe(gulp.dest('./dist/css')));

gulp.task('watch', () => {
    gulp.watch('./src/scss/**/*.scss', ['styles']);
    gulp.watch('./src/js/**/*.js', ['copy-js']);
    gulp.watch('./src/index.html', ['copy-html']);
});

gulp.task('build', ['copy', 'styles']);
gulp.task('default', ['copy', 'styles', 'watch', 'webserver']);
