var gulp = require('gulp');
var $ = require('gulp-load-plugins')({lazy: true});
var browserSync = require('browser-sync').create();
const iconfont = require('gulp-iconfont');
const iconfontCss = require('gulp-iconfont-css');

var paths = {
    styles: {
        src: 'assets/dev/scss/**/*.scss',
        dest: './assets/build/css/'
    },
    icons:{
        src: 'assets/dev/icons/**/*.svg',
        dest: 'assets/build/fonts/icons'
    } 
};

gulp.task('hello',function(){
    console.log('helloworld');
})
 
gulp.task('scss', function () {
    console.log('Run scss tasks');
    return gulp
        .src(paths.styles.src)
        .pipe($.sourcemaps.init())
		.pipe($.sass().on('error', $.sass.logError))
		.pipe($.sourcemaps.write())
        .pipe($.autoprefixer({browsers: ['last 2 versions']}))
        .pipe(
            browserSync.reload({
                stream: true}
            )
        )
        .pipe(gulp.dest(paths.styles.dest))
        .pipe($.rename({basename: 'styles'}))
        .pipe($.rename({ suffix: '.min' }))
        .pipe($.uglifycss())
        .pipe(gulp.dest(paths.styles.dest))
});

var runTimestamp = Math.round(Date.now()/1000);
var fontName = 'icons';
gulp.task('iconfont', function(){
  gulp.src([paths.icons.src])
    .pipe(iconfontCss({
      fontName: fontName,
      targetPath: '../../../dev/scss/fonts/_icons.scss',
      fontPath: '../fonts/icons/',
      cssClass: 'icon',
    }))
    .pipe(iconfont({
		fontName: fontName,
		formats: ['ttf', 'eot', 'woff', 'woff2', 'svg'],
		normalize: true,
		appendCodepoints: true,
		prependUnicode: false,
		fontHeight: 1024,
		timestamp: runTimestamp
     }))
    .pipe(gulp.dest(paths.icons.dest));
});

gulp.task('watch', function() {
    browserSync.init({
        server: './'
    });
    browserSync.watch(paths.styles.src).on('change', gulp.series('scss', browserSync.reload));
    browserSync.watch('index.html').on('change', gulp.series(browserSync.reload));
 });