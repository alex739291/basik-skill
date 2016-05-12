//------------------------------------------------------

// Pluings

//------------------------------------------------------

var gulp             = require('gulp'),
	sass             = require('gulp-sass'),
	concat           = require('gulp-concat'),
    watch            = require('gulp-watch'),
    plumber          = require('gulp-plumber'),
    cleanCSS         = require('gulp-clean-css'),
    uglify           = require('gulp-uglify'),
    sourcemaps       = require('gulp-sourcemaps'),
    imagemin         = require('gulp-imagemin'),
    imageminPngquant = require('imagemin-pngquant'),
    browserSync      = require('browser-sync'),
    autoprefixer     = require('gulp-autoprefixer');

//------------------------------------------------------
var dest_js  = 'dist/js';
var dest_css = 'dist/css';
var dest_img = 'dist/img';
var dest_html = 'dist/*.html';
var src_sass = 'src/sass/**/*.scss';
var src_js   = 'src/js/**/*.js';
var src_img   = 'src/img/*';
// --------------------------------------------------------

//---------------------------------------------------------

// Plumber Error

var onError = function(err){
	console.log(err);
	this.emit('end');
};

//---------------------------------------------------------

// SASS to CSS

gulp.task('sass', function(){
	
	return gulp.src(src_sass)
		.pipe(plumber({
			errorHandler: onError
		}))
		.pipe(sass())
		.pipe(autoprefixer('last 2 versions'))
		.pipe(concat('app.min.css'))
		.pipe(cleanCSS({compatibility: 'ie8'}))
		.pipe(sourcemaps.init())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(dest_css))
		.pipe(browserSync.reload({stream: true}));

});

// ------------------------------------------------------------

// IMG

gulp.task('img', function(){
	return gulp.src(src_img)
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [imageminPngquant()]
		}))
		.pipe(gulp.dest(dest_img));
});

// ----------------------------------------------------------------

// Compile JS
gulp.task('js', function(){
	
	return gulp.src(src_js)
		.pipe(plumber({
			errorHandler: onError
		}))
		.pipe(uglify())
		.pipe(concat('app.min.js'))
		.pipe(sourcemaps.init())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(dest_js))
		.pipe(browserSync.reload({stream: true}));
});

// ------------------------------------------------------------
// Watch

gulp.task('watch', function(){
	browserSync.init({
		server: 'dist'
	});
	gulp.watch(src_js, ['js']);
	gulp.watch(src_sass, ['sass']);
	gulp.watch(src_img, ['img']);
	gulp.watch(dest_html).on('change', browserSync.reload);
});

// ------------------------------------------------------------

// Default
gulp.task('default', ['watch', 'sass', 'js', 'img']);