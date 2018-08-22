const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync').create();

const $ = gulpLoadPlugins();

// gulp-eslint can read from .eslintignore but it makes the task run slower.
const eslintFileList = [
    'src/js/**/*.js',
    '!node_modules/**',
    '!dist/**',
    '!src/js/vendor/**',
];

const autoprefixerConfig = [
    autoprefixer({
        browsers: [
            'last 2 versions',
            '> 5%',
        ],
    }),
];

gulp.task('webserver', () => {
    browserSync.init({
        server: {
            baseDir: './dist/',
        },
    });
});

gulp.task('copy-html', () => gulp.src('./src/index.html')
    .pipe(gulp.dest('./dist/')));

gulp.task('copy-images', () => gulp.src('./src/img/**/*')
    .pipe(gulp.dest('./dist/img')));

gulp.task('copy-fonts', () => gulp.src('./src/fonts/**/*')
    .pipe(gulp.dest('./dist/fonts')));

gulp.task('copy-js', ['lint-js'], () => gulp.src('./src/js/**/*.js')
    .pipe(gulp.dest('./dist/js')));

gulp.task('copy', ['copy-images', 'copy-fonts', 'copy-html', 'copy-js']);

gulp.task('lint-styles', () => gulp.src('./src/scss/**/*.scss')
    .pipe($.stylelint({
        reporters: [{
            formatter: 'string',
            console: true,
        }],
    })));

gulp.task('lint-js', () => gulp.src(eslintFileList)
    .pipe($.eslint({ useEslintrc: true }))
    .pipe($.eslint.format()));

gulp.task('styles', () => gulp.src('./src/scss/**/*.scss')
    .pipe($.sass({
        precision: 8,
        includePaths: ['node_modules/normalize-scss/sass/normalize'],
    }).on('error', $.sass.logError))
    .pipe($.postcss(autoprefixerConfig))
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.reload({ stream: true })));

gulp.task('watch', () => {
    gulp.watch('./src/scss/**/*.scss', ['styles']);
    gulp.watch('./src/js/**/*.js', ['copy-js']);
    gulp.watch('./src/index.html', ['copy-html']).on('change', browserSync.reload);
});

gulp.task('build', ['copy', 'styles']);
gulp.task('test', ['lint-styles', 'lint-js']);
gulp.task('default', ['copy', 'styles', 'watch', 'webserver']);
