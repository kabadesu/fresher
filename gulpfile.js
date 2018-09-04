const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync').create();
const fs = require('fs');

const $ = gulpLoadPlugins();

const _ = {
    src: './src',
    dist: './dist',
};

// gulp-eslint can read from .eslintignore but it makes the task run slower.
const eslintFileList = [
    `${_.src}/js/**/*.js`,
    '!node_modules/**',
    `!${_.dist}/**`,
    `!${_.src}/js/vendor/**`,
];

const autoprefixerConfig = [
    autoprefixer({
        browsers: [
            'last 2 versions',
            '> 1%',
        ],
    }),
];

gulp.task('webserver', () => {
    browserSync.init({
        server: {
            baseDir: _.dist,
        },
        port: 8000,
        // ghostMode: false,
    });
});

gulp.task('clean', () => gulp.src(`${_.dist}*`, { read: false })
    .pipe($.clean()));

gulp.task('icons', () => gulp.src(`${_.src}/icons/**/*.svg`)
    .pipe($.cheerio({
        // I'd usually use $ here, but es6lint is complaining about it so...
        run: (ಠ_ಠ) => {
            const fills = ['#000', '#000000', 'none'];
            ಠ_ಠ('[fill]').each(() => {
                const fill = ಠ_ಠ(this).attr('fill');
                if (fills.indexOf(fill) !== -1) {
                    ಠ_ಠ(this).removeAttr('fill');
                }
            });
        },
        parserOptions: { xmlMode: true },
    }))
    .pipe($.svgmin({
        plugins: [{
            removeTitle: true,
        }],
    }))
    .pipe($.svgstore())
    .pipe($.rename('icons.svg'))
    .pipe(gulp.dest(`${_.dist}/img`)));

gulp.task('nunjucks', () => gulp.src(`${_.src}/nunjucks/pages/**/*.njk`)
    .pipe($.data(() => JSON.parse(fs.readFileSync(`${_.src}/data.json`))))
    .pipe($.nunjucksRender({
        path: [
            `${_.src}/nunjucks/templates`,
            `${_.src}/nunjucks/templates/macros`,
            `${_.src}/nunjucks/templates/partials`,
        ],
    }))
    .on('error', function handleError(error) {
        console.log(error.toString());
        this.emit('end');
    })
    .pipe(gulp.dest(_.dist)));

gulp.task('styles', () => gulp.src(`${_.src}/scss/main.scss`)
    .pipe($.sass({
        precision: 8,
        includePaths: ['node_modules/normalize-scss/sass/normalize'],
    }).on('error', $.sass.logError))
    .pipe($.postcss(autoprefixerConfig))
    .pipe(gulp.dest(`${_.dist}/css`))
    .pipe(browserSync.reload({ stream: true })));

gulp.task('lint-styles', () => gulp.src(`${_.src}/scss/**/*.scss`)
    .pipe($.stylelint({
        reporters: [{
            formatter: 'string',
            console: true,
        }],
    })));

gulp.task('lint-js', () => gulp.src(eslintFileList)
    .pipe($.eslint({ useEslintrc: true }))
    .pipe($.eslint.format()));

gulp.task('copy-images', () => gulp.src(`${_.src}/img/**/*`)
    .pipe(gulp.dest(`${_.dist}/img`)));

gulp.task('copy-fonts', () => gulp.src(`${_.src}/fonts/**/*`)
    .pipe(gulp.dest(`${_.dist}/fonts`)));

gulp.task('copy-js', ['lint-js'], () => gulp.src(`${_.src}/js/**/*.js`)
    .pipe(gulp.dest(`${_.dist}/js`)));

gulp.task('copy', ['copy-images', 'copy-fonts', 'copy-js']);

gulp.task('watch', () => {
    gulp.watch(`${_.src}/scss/**/*.scss`, ['styles']);
    gulp.watch(`${_.src}/js/**/*.js`, ['copy-js']);
    gulp.watch(`${_.src}/icons/**/*.svg`, ['icons']);
    gulp.watch(`${_.src}/data.json`, ['nunjucks']).on('change', browserSync.reload);
    gulp.watch(`${_.src}/nunjucks/**/*.njk`, ['nunjucks']).on('change', browserSync.reload);
});

gulp.task('build', ['copy', 'nunjucks', 'styles']);
gulp.task('test', ['lint-styles', 'lint-js']);
gulp.task('default', ['copy', 'nunjucks', 'icons', 'styles', 'watch', 'webserver']);
