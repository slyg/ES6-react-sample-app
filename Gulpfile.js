var gulp      = require('gulp'),
  browserify  = require('browserify'),
  babelify    = require('babelify'),
  source      = require('vinyl-source-stream'),
  sass        = require('gulp-sass'),
  bower       = require('main-bower-files'),
  concat      = require('gulp-concat'),
  es          = require('event-stream');

const DEST_FOLDER = 'dist';
const MAIN_CSS = 'style.css';
const MAIN_JS = 'app.js';

gulp.task('js', function () {

  return browserify({
    entries: './src/js/app.js',
    extensions: ['.js'],
    debug: true
  })
    .transform(babelify)
    .bundle()
    .pipe(source(MAIN_JS))
    .pipe(gulp.dest(DEST_FOLDER));
});

gulp.task('css', function(){
  var vendor = gulp.src(bower()),
      app    = gulp.src('./src/css/*.scss').pipe(sass());

  return es.concat(vendor, app)
    .pipe(concat(MAIN_CSS))
    .pipe(gulp.dest(DEST_FOLDER));
});

gulp.task('default', ['js', 'css']);
