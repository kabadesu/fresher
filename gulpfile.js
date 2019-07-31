const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync').create();
const fs = require('fs');

const { TwingEnvironment, TwingLoaderFilesystem } = require('twing');

const $ = gulpLoadPlugins({
    pattern: [
        '*',
        '!stylelint',
        '!twing',
        '!eslint'
    ],
    lazy: true,
});

const _ = {
    src: './src',
    dist: './dist',
};

let siteData = require(`${_.src}/data.json`);

const twingInit = () => {
    const loader = new TwingLoaderFilesystem('.');

    loader.addPath(`${_.src}/twig/components/`, 'components');
    loader.addPath(`${_.src}/twig/layouts/`, 'layouts');
    loader.addPath(`${_.src}/img/`, 'image');

    const env = new TwingEnvironment(loader);
    env.addGlobal('imagepath', '/img');

    return {
        loader, env
    };
}

let { loader, env } = twingInit();

// gulp-eslint can read from .eslintignore but it makes the task run slower.
const eslintFileList = [
    `${_.src}/js/**/*.js`,
    '!node_modules/**',
    `!${_.dist}/**`,
    `!${_.src}/js/vendor/**`,
];

const postcssPlugins = [
    autoprefixer(),
];

function webserver() {
    return browserSync.init({
        server: {
            baseDir: _.dist,
        },
        port: 8000,
        // ghostMode: false,
    })
}

function clean() {
    return gulp.src(`${_.dist}*`, { read: false })
    .pipe($.clean())
}

function icons() {
    return gulp.src(`${_.src}/icons/**/*.svg`)
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
    .pipe(gulp.dest(`${_.dist}/img`))
}

function twig() {
    let { loader, env } = twingInit();

    return gulp.src(`${_.src}/twig/pages/**/*.twig`)
        .pipe($.twing(env, siteData))
        .pipe(gulp.dest(_.dist))
}

function styles() {
    return gulp.src(`${_.src}/scss/main.scss`)
    .pipe($.sass({
        precision: 8,
        includePaths: ['node_modules/normalize-scss/sass/normalize'],
    }).on('error', $.sass.logError))
    .pipe($.postcss(postcssPlugins))
    .pipe(gulp.dest(`${_.dist}/css`))
    .pipe(browserSync.reload({ stream: true }))
}

function stylelint() {
    return gulp.src(`${_.src}/scss/**/*.scss`)
    .pipe($.stylelint({
        reporters: [{
            formatter: 'string',
            console: true,
        }],
    }))
}

function lintJs() {
    return gulp.src(eslintFileList)
    .pipe($.eslint({ useEslintrc: true }))
    .pipe($.eslint.format())
}

function copyImages() {
    return gulp.src(`${_.src}/img/**/*`)
    .pipe(gulp.dest(`${_.dist}/img`))
}

function copyFonts() {
    return gulp.src(`${_.src}/fonts/**/*`)
    .pipe(gulp.dest(`${_.dist}/fonts`))
}

function copyJs() {
    return gulp.src(`${_.src}/js/**/*.js`)
    .pipe(gulp.dest(`${_.dist}/js`))
}

gulp.task('copy', gulp.series(copyImages, copyFonts, lintJs, copyJs));

gulp.task('watch', () => {
    gulp.watch(`${_.src}/scss/**/*.scss`, gulp.series(styles));
    gulp.watch(`${_.src}/js/**/*.js`, gulp.series(lintJs, copyJs)).on('change', browserSync.reload);
    gulp.watch(`${_.src}/icons/**/*.svg`, gulp.series(icons));
    gulp.watch(`${_.src}/data.json`, gulp.series(twig)).on('change', browserSync.reload);
    gulp.watch(`${_.src}/twig/**/*.twig`, gulp.series(twig)).on('change', browserSync.reload);
});

gulp.task('clean', clean);

gulp.task('build', gulp.series('copy', twig, styles));
gulp.task('test', gulp.series(stylelint, lintJs));
gulp.task('default', gulp.series('copy', twig, icons, styles, gulp.parallel('watch', webserver)));
