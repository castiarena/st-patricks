var gulp = require('gulp'),
    fs = require('fs'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    site = require('./index'),
    htmlmin = require('gulp-htmlmin'),
    autoprefixer = require('gulp-autoprefixer'),
    imagemin = require('gulp-imagemin'),
    browserSync = require('browser-sync');


gulp.task('build',function(){
    gulp.start('html:build');
    gulp.start('css:build');
    gulp.start('assets:build');
    gulp.start('js:build');
});

gulp.task('js:build',function(){
    gulp.src(['./node_modules/handlebars/dist/handlebars.js','./node_modules/parallaxy/src/parallaxy.js','./src/js/jquery/*.js','./src/js/*.js' ])
        .pipe(concat('site.js'))
        .pipe(gulp.dest('./build/js'));
});

gulp.task('assets:build',function(){
    fs.rmdir('./build/img',function(){
        gulp.src('./src/img/**/*')
            .pipe(gulp.dest('./build/img'));
    });

    fs.rmdir('./build/fonts',function(){
        gulp.src('./src/fonts/**/*')
            .pipe(gulp.dest('./build/fonts'));
    });
});

gulp.task('css:build',function(){
    gulp.src('./src/sass/styles.scss')
        .pipe(sass())
        .pipe(gulp.dest('build/css'));
    gulp.src('./src/sass/icons.scss')
        .pipe(sass())
        .pipe(gulp.dest('build/css'));
});

gulp.task('html:build',function(){
    site.eachPage(function(page, html){
        fs.mkdir(__dirname+'/build/',511,function(err){
            if(err.code != 'EEXIST') console.log(err);
            fs.writeFile(__dirname+'/build/'+ page.template, html,function(){
                console.log(page.template + ' Created');
            });
        });
    });
});

gulp.task('server',function(){
    gulp.start('build');
    browserSync.init({
        server: "./build"
    });
    gulp.watch('./src/**/*.js', ['js:build']);
    gulp.watch('./src/**/*.scss', ['css:build']);
    gulp.watch('./src/**/*.html', ['html:build']);
    gulp.watch('./src/img/**.*', ['assets:build']);
    gulp.watch('./build/*').on('change', browserSync.reload);

});

gulp.task('server:dist', function(){
    browserSync.init({
        server: './dist'
    });
});

gulp.task('html:minify', function() {
    return gulp.src('build/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('dist'))
});

gulp.task('css:dist',function(){
    gulp.src('./src/sass/styles.scss')
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./dist/css'));

    gulp.src('./src/sass/icons.scss')
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('js:dist',function(){
    gulp.src('./build/js/*')
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('assets:dist',function(){
    gulp.src('./build/fonts/*')
        .pipe(gulp.dest('./dist/fonts'));
    gulp.src('./build/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/img'));
});

gulp.task('dist',function() {
    gulp.start('html:minify');
    gulp.start('css:dist');
    gulp.start('js:dist');
    gulp.start('assets:dist');
});