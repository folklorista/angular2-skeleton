var config = {
	filesToConcatCssMain: "www/assets/**/*.css",
	outputFolderCssJs: "www/cache",
	filesToConcatJs: "www/assets/**/*.js",
	filesBrowserSync: ["www/assets/**/*.css", "www/assets/**/*.js", "app/FrontModule/**/*.latte"],
	proxy: "nas-projekt.cz:3000",
	production: true
}

var gulp = require("gulp"),
	minifycss = require("gulp-minify-css"),
	autoprefixer = require("gulp-autoprefixer"),
	concat = require("gulp-concat"),
	gulpIf = require("gulp-if"),
	uglify = require("gulp-uglify"),
	del = require("del"),
	browserSync = require("browser-sync"),
	revAll = require("gulp-rev-all");

gulp.task("concatCssMain", function() {
	return gulp.src(config.filesToConcatCssMain)
		.pipe(concat("styles.css"))
		.pipe(gulpIf(config.production, autoprefixer("last 4 version", "ie8", "ie9", "safari 5", "opera 12.1")))
		.pipe(gulpIf(config.production, minifycss( { compatibility:"ie8", keepSpecialComments: "0" } )))
		.pipe(gulpIf(config.production, revAll()))
		.pipe(gulp.dest(config.outputFolderCssJs))
});


gulp.task("concatJs", function() {
	return gulp.src(config.filesToConcatJs)
		.pipe(concat("scripts.js"))
		.pipe(gulpIf(config.production, uglify()))
		.pipe(gulpIf(config.production, revAll()))
		.pipe(gulp.dest(config.outputFolderCssJs))
});

gulp.task("deleteCache", function() {
	del([config.outputFolderCssJs + "/*.js", config.outputFolderCssJs + "/*.css"])
});

gulp.task("browser-sync", function() {
	return browserSync.init( {
		proxy: config.proxy,
		files: config.filesBrowserSync,
	} );
});

gulp.task("watchAssets", function() { 
	gulp.watch(config.filesToConcatCssMain, ["concatCssMain", browserSync.reload])
	gulp.watch(config.filesToConcatJs, ["concatJs", browserSync.reload])
});

gulp.task("default", ["deleteCache", "concatCssMain", "concatJs", "watchAssets", "browser-sync"]);
