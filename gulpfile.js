const scss = require("gulp-sass");
const browserSync = require("browser-sync").create();
const concat = require("gulp-concat");
const uglifyEs = require("gulp-uglify-es").default;
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const del = require("del");
const { src, dest, watch, parallel, series } = require("gulp");

function browsersync() {
  browserSync.init({ server: { baseDir: "app/" }, notify: false });
}

function convertsToCss() {
  return src("app/scss/main.scss")
    .pipe(scss({ outputStyle: "expanded" }))
    .pipe(
      autoprefixer({ overrideBrowserslist: ["last 5 versions"], grid: true })
    )
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(dest("app/css"))
    .pipe(browserSync.stream());
}

function scripts() {
  return src("app/js/main.js")
    .pipe(uglifyEs())
    .pipe(concat("main.min.js"))
    .pipe(dest("app/js"))
    .pipe(browserSync.stream());
}

function build() {
  return src(
    [
      "app/css/main.css",
      "app/fonts/**/*",
      "app/js/main.min.js",
      "app/*.html",
      "app/images/*",
    ],
    { base: "app" }
  ).pipe(dest("dist"));
}

function watching() {
  watch(["app/scss/**/*.scss"], convertsToCss);
  watch(["app/js/**/*.js", "!app/js/main.min.js"], scripts);
  watch(["app/*.html"]).on("change", browserSync.reload);
}

function cleanDist() {
  return del("dist");
}

exports.convertsToCss = convertsToCss;
exports.watching = watching;
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.cleanDist = cleanDist;

exports.build = series(cleanDist, build);
exports.default = parallel(convertsToCss, scripts, browsersync, watching);

// use "gulp" for start
// use "gulp build" for compare project into "dist" folder
