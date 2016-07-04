// 载入gulp
var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    rev = require('gulp-rev'),
    revCollector = require('gulp-rev-collector');
//imageisux = require('gulp-imageisux');




// 样式
/*gulp.task('styles', function() {
    return sass('css/', { style: 'expanded' })
        .pipe(autoprefixer('last 2 version'))
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        //.pipe(rev())
        .pipe(gulp.dest('dist/assets/css'))
});*/
/*
gulp.task('minifycss', function() {
    return gulp.src('css/!*.css')      //压缩的文件
        .pipe(gulp.dest('dist/assets/css'))   //输出文件夹
        .pipe(minifycss());   //执行压缩
});
*/

// 脚本
gulp.task('scripts', function() {
        return gulp.src('js/*.js')
            .pipe(concat('main.js'))    //合并所有js到main.js
            .pipe(gulp.dest('dist/assets/js'))    //输出main.js到文件夹
            .pipe(rename({suffix: '.min'}))   //rename压缩后的文件名
            .pipe(uglify())    //压缩
            //.pipe(rev())
            .pipe(gulp.dest('dist/assets/js'));  //输出
});
// 图片
gulp.task('images', function() {
    return gulp.src('images/**/*')
        .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
        .pipe(gulp.dest('dist/assets/img'))
        .pipe(notify({ message: 'Images task complete' }));
});

// 清理
gulp.task('clean', function() {
    return gulp.src(['dist/styles', 'dist/scripts', 'dist/images'], {read: false})
        .pipe(clean());
});


// 预设任务
gulp.task('default', ['clean'], function() {
    gulp.start('scripts', 'images');
});

// 监听
gulp.task('watch', function() {

    // 监听所有.scss档
    //gulp.watch('css/*.css', ['styles']);

    // 监听所有.js档
    gulp.watch('js/*.js', ['scripts']);

    // 监听所有图片档
    gulp.watch('images/**/*', ['images']);

    // 建立即时重整伺服器
    var server = livereload();

    // 监听所有位在 dist/  目录下的档案，一旦有更动，便进行重整
    gulp.watch(['dist/**']).on('change', function(file) {
        server.changed(file.path);
    });

});

//gulp.task('imageisux', function() {
//    return gulp.src(['images/*'])
//        .pipe(imageisux('/dist/',true));
//});
