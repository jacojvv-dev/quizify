var gulp = require("gulp");
var eslint = require("gulp-eslint");
var rollup = require("gulp-rollup");
var rename = require("gulp-rename");
var babel = require("gulp-babel");
var uglify = require("gulp-uglify");

var destFolder = "./dist";

gulp.task("default", function () {
    process.env.NODE_ENV = "release";
    return gulp.src("./src/**/*.js")
        .pipe(rollup({
            input: "./src/quizify.js",
            output: {
                format: "umd",
                name: "quizify",
            }
        }))
        .pipe(rename("quizify.es2015.js"))
        .pipe(gulp.dest(destFolder)) // save rollup
        .pipe(babel())
        .pipe(rename("quizify.js"))
        .pipe(gulp.dest(destFolder)) // save babel transpiled        
        .pipe(uglify())
        .pipe(rename("quizify.min.js"))
        .pipe(gulp.dest(destFolder)); // save minified
});

gulp.task("watch", function () {
    gulp.start("default");
    gulp.watch("./src/**/*.js", ["default"]);
});

