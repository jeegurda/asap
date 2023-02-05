var gulp = require('gulp');
var livereload = require('gulp-livereload');
var sass = require('gulp-sass');
var notifier = require('node-notifier');

gulp.task('reload-page', function() {
	livereload.reload();
});

gulp.task('build-and-reload-sass', function() {
	gulp.src('./src/css/**/*.sass')
		.pipe(sass())
		.on('error', function(err) {
			notifier.notify({
				title: 'Gulp sass',
				message: err.formatted
			});
			console.log('Sass error in ' + err.file + '\n' + err.formatted);
		})
		.pipe(gulp.dest('./dist/css/'))
		.pipe(livereload());
});

gulp.task('watch', function() {
	livereload.listen();

	// watch for src
	gulp.watch('./src/css/**/*.sass', ['build-and-reload-sass']);
	// gulp.watch('src/js/*.{js,jsx}', ['build-and-reload-js']);

	// watch for files put directly in /dist
	gulp.watch('./dist/**/*.html', ['reload-page']);
	gulp.watch('./dist/**/*.js', ['reload-page']);
	gulp.watch('./dist/images/**/*.{png,jpg,jpeg}', ['reload-page']);
});

