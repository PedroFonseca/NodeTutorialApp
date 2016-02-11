var gulp = require('gulp');
var connect = require('gulp-connect');      //Runs a local dev server
var open = require('gulp-open');            //Open a URL in a web browser
var browserify = require('browserify');     //Bundles JS modules into one file
var reactify = require('reactify');         //Transforms React jsx to js
var source = require('vinyl-source-stream');//Use conventional text streams with gulp  
var concat = require('gulp-concat');        //Concatenates files
var eslint = require('gulp-eslint');

var config = {
    port: 5000,
    devBaseUrl: 'http://localhost',
    paths:{
        html: './src/*.html',
        js: 'src/**/*.js',
        jsx: 'src/**/*.jsx',
        images: 'src/images/*',
        css: [
            'node_modules/bootstrap/dist/css/bootstrap.min.css',
            'node_modules/bootstrap/dist/css/bootstrap-theme.min.css'
        ],
        dist: './dist',
        mainJs: './src/main.jsx'
    }
}

gulp.task('connect', function(){
    connect.server({
        root: ['dist'],
        port: config.port,
        base: config.devBaseUrl,
        livereload: true
    });
});

gulp.task('open', ['connect'], function(){
    gulp.src('dist/index.html')
        .pipe(open({uri: config.devBaseUrl + ':' + config.port + '/'}));
});

gulp.task('html', function(){
    gulp.src(config.paths.html)
    .pipe(gulp.dest(config.paths.dist))
    .pipe(connect.reload());
});

gulp.task('js', function(){
    browserify(config.paths.mainJs)
        .transform(reactify)
        .bundle()
        .on('error', console.error.bind(console))
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(config.paths.dist + '/scripts'))
        .pipe(connect.reload());
});

gulp.task('css', function(){
    gulp.src(config.paths.css)
        .pipe(concat('bundle.css'))
        .pipe(gulp.dest(config.paths.dist + '/css'));
});

gulp.task('images', function () {
    gulp.src(config.paths.images)
        .pipe(gulp.dest(config.paths.dist + '/images'))
        .pipe(connect.reload());
});

gulp.task('lint', function(){
    return gulp.src(config.paths.js)
        .pipe(eslint({config: 'eslint.config.json'}))
        .pipe(eslint.format());
});

gulp.task('watch', function(){
   gulp.watch(config.paths.html, ['html']);
   gulp.watch(config.paths.js, ['js', 'lint']);
   gulp.watch(config.paths.jsx, ['js']);  
});

gulp.task('default', ['html', 'js', 'css', 'images', 'open', 'watch']);