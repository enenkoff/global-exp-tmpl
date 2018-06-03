/* gulp variables */

var gulp = require('gulp'),
    notify = require('gulp-notify'),
    svgstore = require('gulp-svgstore'),
    injectSvg = require('gulp-inject-svg'),
    imagemin = require('gulp-imagemin'),
    include = require('gulp-html-tag-include'),
    rigger = require('gulp-rigger'),
    sass = require('gulp-sass'),
    rename = require("gulp-rename"),
    cssmin = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    newer = require('gulp-newer'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync');


/* postcss variables */

var postcss = require('gulp-postcss'),
    autoprefix = require('autoprefixer'),
    stylefmt = require('stylefmt'),
    configFmt = require('./stylefmt.config'),
    mqpacker = require('css-mqpacker');


/* paths */

var path = {
    src: {
        html: 'dev/',
        js: 'dev/js/',
        css: 'dev/css/',
        sass: 'dev/sass/**/*.+(sass|scss)',
        img: 'dev/images/',
        media: 'dev/media/',
        svg: 'dev/svg/',
        fonts: 'dev/fonts/'
    },
    watch: {
        html: 'dev/*.html',
        js: 'dev/js/*.js',
        style: 'dev/sass/*.scss'
    },
    clean: 'dev/'
};


/* browser sync */

gulp.task('browser-sync',function () {
    browserSync({
        server: path.clean,
        host: 'localhost',
        browser: 'chrome',
        port: 4000,
        notify: false
    })
});

gulp.task('browser:reload', function () {
    gulp.src(path.watch.html)
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('builder:css', function () {
    gulp.src(path.src.sass)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sass().on('error', notify.onError(
            {
                message: "<%= error.message %>",
                title  : "Sass ошибка!"
            }))
        )
        .pipe(
            postcss([
                autoprefix({
                    browsers:['last 10 versions']
                }),
                mqpacker(),
                stylefmt(configFmt)
            ])
        )
        // .pipe(cssmin())
        .pipe(sourcemaps.write())
        // .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(path.src.css))
        .pipe(notify( 'Готово!' ) )
        .pipe(browserSync.reload({stream: true}));
});


/* watch changes */

gulp.task('watch', ['builder:css', 'browser-sync'], function () {
    gulp.watch(path.src.sass,['builder:css']);
    gulp.watch(path.watch.html, ['browser:reload']);
    gulp.watch(path.watch.js, ['browser:reload']);
});

/* dafault tasks */

gulp.task('default',function () {
    gulp.run('watch');
});
