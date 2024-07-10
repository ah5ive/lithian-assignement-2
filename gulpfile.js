const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const connect = require('gulp-connect');
const pug = require('gulp-pug');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
// const uglify  = require('gulp-uglify');
const autoprefixer = require('gulp-autoprefixer');
const del = require('del');
const merge = require('gulp-merge-json');
const fs = require('file-system');
const data = require('gulp-data');
const argv = require('yargs').argv;
const isProduction = argv.prod;
const inlineCss = require('gulp-inline-css');
// const eslint = require('gulp-eslint');
// const concat = require('gulp-concat');
// babel = require('gulp-babel')
// isFixStyle = argv.fix;
const ASSETS_DEST = './site';
const ASSETS_SRC = './src';

let jsVendor = [
  // './node_modules/jquery/dist/jquery.min.js',
  // 'src/js/vendor/bootstrap-datepicker.js',
  // 'src/js/vendor/validator.js',
  // 'src/js/vendor/country.js',
  // 'src/js/vendor/slick.js',
  // './node_modules/select2/dist/js/i18n/*.js',
  // './node_modules/select2/dist/js/select2.min.js'
];

function cleanUp () {
  return del(
    [ASSETS_DEST + '/images', ASSETS_DEST + '/css']
  );
}

function reload (done) {
  connect.server({
    livereload: true,
    root: './site',
    port: 3000,
  });
  done();
}

// function move () {
//   return gulp.src([ASSETS_SRC + '/scss/**/*.scss'],
//     { base: ASSETS_SRC })
//     .pipe(gulp.dest(ASSETS_DEST));
// }

function imageMinify () {
  return gulp.src([
    ASSETS_SRC + '/images/**/*.{gif,jpg,png,ico}',
  ]).pipe(gulp.dest( ASSETS_DEST + '/images/'));
}

function svgMinify () {
  return gulp.src([
    ASSETS_SRC + '/images/**/*.svg',
  ]).pipe(gulp.dest(ASSETS_DEST + '/images/'));
}

function styles () {
  return (
    gulp.src(ASSETS_SRC + '/scss/**/*.scss')
      .pipe(plumber())
      .pipe(sass({
        includePaths: [
          'node_modules',
        ],
        outputStyle: 'expanded',
      }).on('error', sass.logError))
      .pipe(autoprefixer({
        overrideBrowserslist: ['last 4 versions'],
        cascade: false,
      }))
      .pipe(gulp.dest(ASSETS_DEST + '/css/'))
      .pipe(connect.reload())
  );
}

// function jsEslint() {
//   return gulp.src([
//     ASSETS_SRC + '/js/*.js',
//     ASSETS_SRC + '/js/page/*.js'
//   ])
//   .pipe(eslint())
//   .pipe(eslint.format())
//   .pipe(gulp.dest(ASSETS_DEST + '/js/'))
//   .pipe(connect.reload())
// }

// function vendorJs () {
//   return gulp.src(jsVendor)
//   .pipe(gulp.dest(
//     ASSETS_DEST + '/js/vendor/'
//   ))
//   .pipe(connect.reload())
// }

// function scripts() {
//   return (
//     gulp.src([
//       ASSETS_SRC + '/js/*.js'
//     ])
//     .pipe(concat('app.js'))
//     .pipe(gulp.dest(ASSETS_DEST + '/js/'))
//     .pipe(uglify())
//     .pipe(rename('app.min.js'))
//     .pipe(gulp.dest(ASSETS_DEST + '/js/'))
//     .pipe(connect.reload())
//   );
// }

function html () {
  return (
    gulp.src('./site/')
      .pipe(plumber())
      .pipe(gulp.dest('./site/'))
      .pipe(connect.reload())
  );
}

function mergeData () {
  return gulp.src([
    ASSETS_SRC + '/data/**/_*.json',
  ])
    .pipe(merge({
      fileName: 'static.json',
      edit: (json, file) => { return json; },
    })).pipe(gulp.dest(ASSETS_SRC + '/data'));
}

function views () {
  var sources = [
    ASSETS_SRC + '/templates/*.pug',
    ASSETS_SRC + '/templates/pages/*.pug',
    ASSETS_SRC + '/templates/_components/*.pug',
    '!' + ASSETS_SRC + '/templates/_*/',
    '!' + ASSETS_SRC + '/templates/_*/*.pug',
  ];
  return (
    gulp.src(sources)
      .pipe(plumber())
      .pipe(data((file) => {
        return JSON.parse(
          fs.readFileSync(ASSETS_SRC + '/data/static.json')
        );
      }))
      .pipe(pug({
        basedir: './',
        pretty: true,
        locals: {
          isProd: isProduction,
        },
      }))
      .pipe(gulp.dest(ASSETS_DEST + '/'))
      .pipe(connect.reload())
  );
}
// for emailer
// function emailerViews() {
//   var sources = [
//     ASSETS_SRC + '/emailer/*.pug'
//   ]
//   return (
//     gulp.src(sources)
//     .pipe(plumber())
//     .pipe(data((file) => {
//       return JSON.parse(
//         fs.readFileSync(ASSETS_SRC + '/data/static.json')
//       )
//     }))
//     .pipe(pug({
//       basedir:'./',
//       pretty: true,
//       locals: {
//         isProd: isProduction
//       }
//     }))
//     .pipe(gulp.dest('./site/emailer'))
//     .pipe(connect.reload())
//   )
// }

// function emailerImageMinify () {
//   return gulp.src([
//     ASSETS_SRC + '/emailer/images/**/*.{gif,jpg,png,ico}'
//   ]).pipe(gulp.dest( ASSETS_DEST + '/emailer/images/'))
// }

// function emailerCss () {
//   return gulp.src([
//     ASSETS_SRC + '/emailer/*.css'
//   ]).pipe(gulp.dest( ASSETS_DEST + '/emailer/'))
// }

// function inline () {
//   return gulp.src(ASSETS_DEST + '/index.html')
//     .pipe(inlineCss({
//       applyStyleTags: true,
//       applyLinkTags: true,
//       removeStyleTags: false,
//       removeLinkTags: true,
//       preserveMediaQueries: true,
//     }))
//     .pipe(gulp.dest(ASSETS_DEST + '/'));
// }

function watchTask (done) {
  console.log('I am watching');
  gulp.watch('./site/*.html', html);
  gulp.watch('./src/images/**/*.{gif,jpg,png,ico}', images);
  gulp.watch(['./src/scss/**/_*.scss', './src/scss/**/*.scss'], styles);
  gulp.watch('./src/templates/**/*.pug', views);
  gulp.watch('./src/data/**/_*.json', mergeData);
  done();
}

const cssStyles = gulp.series(styles);
// const jslint = gulp.series(jsEslint, scripts, vendorJs)
const images = gulp.series(imageMinify, svgMinify);
const watch = gulp.parallel(watchTask, reload, images, html, mergeData, views, styles);
const build = gulp.series(cleanUp, gulp.parallel(cssStyles, images, html, mergeData, views));

// exports.move = move;
exports.reload = reload;
exports.mergeData = mergeData;
exports.cleanUp = cleanUp;
exports.imageMinify = imageMinify;
exports.svgMinify = svgMinify;
exports.cssStyles = cssStyles;
exports.styles = styles;
exports.html = html;
// exports.inline = inline;
exports.views = views;
exports.watch = watch;
exports.watchTask = watchTask;
exports.images = images;
exports.build = build;
exports.default = watch;
