var gulp = require("gulp");
var server = require('gulp-express');

gulp.task('server', function()
{
    gulp.watch(['./src/**/*.js'], function(event)
    {
        server.stop();
        server.run(['./bin/www']);
    });

    gulp.watch(['./app.js'], function(event)
    {
        server.stop();
        server.run(['./bin/www']);
    });

    server.run(['./bin/www']);
});