var gulp = require('gulp');
var stylus = require('gulp-stylus');
var less = require('gulp-less');
var path = require('path');
var minify = require('gulp-minify');
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
var clean = require('gulp-clean');
var rename = require('gulp-rename');
var pug = require('gulp-pug');
var plumber = require('gulp-plumber');
var livereload = require('gulp-livereload');
var autowatch = require('gulp-autowatch');
var exec = require('gulp-exec');


var paths = {
    bower: './bower_components/',
    assets: {
        js: './assets/js/',
        css: './assets/css/',
        stylus: './assets/styl/',
        less: './assets/less/',
        img: './assets/img/',
        images: './assets/images/',
        views: './assets/views/'
    },
    public: {
        'public': './public/',
        'images': './public/images/',
        'js': './public/js/',
        'css': './public/css',
        'styl': './public/styl/',
        'less': './public/less/',
        'fonts': './public/fonts/',
        'themes': './public/themes/',
        'img': './public/img/'
    }
}

gulp.task('clean', function() {
    gulp.src(paths.public.public).pipe(clean())
})

gulp.task('copy', function() {
    gulp.src(paths.bootstrap + 'fonts/**/*').pipe(gulp.dest(paths.public.fonts))
    gulp.src(paths.assets.images + '**/*').pipe(gulp.dest(paths.public.images))
});

gulp.task('less', function() {
    gulp.src(paths.assets.less + 'default.less')
        .pipe(plumber())
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes')]
        }))
        .pipe(rename('base.css'))
        .pipe(gulp.dest(paths.public.css))
        .pipe(livereload());
});

gulp.task('stylus', function() {
    gulp.src(paths.assets.stylus + 'main.styl')
        .pipe(plumber())
        .pipe(stylus())
        .pipe(cleanCSS())
        .pipe(rename('main.css'))
        .pipe(gulp.dest(paths.public.css))
        .pipe(livereload());
});

gulp.task('views', function buildHTML() {
    gulp.src(paths.assets.views + 'index.pug')
        .pipe(plumber())
        .pipe(pug())
        .pipe(rename('index.html'))
        .pipe(gulp.dest(paths.public.public))
        .pipe(livereload());

})

// gulp.task('styles', function() {
//     gulp.src([])
//         .pipe(plumber())
//         .pipe(cleanCSS())
//         .pipe(concat('vendor.css'))
//         .pipe(gulp.dest(paths.public.css))
//         .pipe(livereload());
// });

gulp.task('scripts', function() {
    gulp.src([
            paths.bower + "jquery/dist/jquery.min.js",
            paths.bower + "bootstrap/dist/js/bootstrap.min.js",
            // paths.toastr + "toastr.min.js",
            // paths.vue + 'vue.min.js',
            paths.assets.js + '*.js'
        ])
        .pipe(plumber())
        .pipe(concat('scripts.js'))
        // .pipe(minify({
        //     ignoreFiles: ['.combo.js', '-min.js', '.min.js', '.map'],
        //     ext: {
        //         min:'.min.js'
        //     }
        // }))
        .pipe(gulp.dest(paths.public.js))
        .pipe(livereload());

})

gulp.task('watch', function() {
    livereload.listen();

    autowatch(gulp, {
        'less': './assets/**/*.less',
        'stylus': './assets/**/*.styl',
        'scripts': './assets/**/*.js',
        'views': ['./assets/**/*.pug','./assets/**/**/.pug']
    });

});

gulp.task('default', ['copy', 'less', 'stylus', 'scripts', 'views', 'watch']);
