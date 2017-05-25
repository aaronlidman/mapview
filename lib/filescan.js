'use strict';

var fs = require('fs');
var exec = require('child_process').exec;
var queue = require('d3-queue').queue;
var log = require('electron-log');

module.exports = function (directory, callback) {
    var q = queue(10);

    exec('find ' + directory + ' -type f -name "*.mbtiles" 2> /dev/null', function (err, stdout) {
        if (err) {
            log.error(err);
            return callback(err);
        }

        stdout.split('\n').forEach(function (file) {
            if (file.length) {
                q.defer(statFile, file);
            }
        });

        q.awaitAll(function (err, files) {
            if (err) {
                log.error(err);
                return callback(err);
            }

            // sort the array by last modified
            files.sort(function (a, b) {
                return a.modified - b.modified;
            });

            callback(null, files);
        });
    });
};

function statFile(file, cb) {
    fs.stat(file, function (err, stats) {
        if (err) return cb(err);
        cb(null, {
            file: file || stats.isFile(),
            size: stats.size,
            modified: +new Date(stats.atime)
        });
    });
}
