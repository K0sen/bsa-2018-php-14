 var gulp        = require('gulp'),
    cleanCSS     = require('gulp-clean-css'),
    autoprefixer = require('gulp-autoprefixer'),
    gcmq         = require('gulp-group-css-media-queries'),
    browserSync  = require('browser-sync').create(),
    sass         = require('gulp-sass'),
    concat       = require('gulp-concat'),
    minifyCSS    = require('gulp-clean-css');

var config = {
    root: './',
    html: {
        src: "*.html"
    },
    css: {
        watch: 'assets/css/scss/*.scss',
        filePath: 'assets/css/scss/',
        src: 'assets/css/scss/*.scss',
        dest: 'assets/css/'
    }
}

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {

    browserSync.init({
        server: config.root
    });

    gulp.watch(config.root + config.css.watch, ['sass']);
    gulp.watch(config.root + config.html.src).on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src([
            config.root + config.css.filePath + 'main.scss',
        ])
        .pipe(sass().on('error', sass.logError))
        .pipe(gcmq())
        .pipe(autoprefixer({
            browsers: ['> 0.1%'],
            cascade: false
        }))
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(concat('style.min.css'))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest(config.root + config.css.dest))
        .pipe(browserSync.stream());
});

gulp.task('default', ['serve']);