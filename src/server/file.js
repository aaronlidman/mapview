'use strict';

var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;
var queue = require('d3-queue').queue;
var log = require('electron-log');
var filesize = require('filesize');
var tildify = require('tildify');
var MBTiles = require('mbtiles-offline');

module.exports = {
    scan: function (directory, socket, callback) {
        var q = queue(10);

        var searchArgs = [
            '-maxdepth 3',
            '-maxdepth 4',
            '-maxdepth 5',
            ''
        ];

        searchArgs.forEach(function (arg) {
            q.defer(find, directory, arg, socket);
        });

        q.awaitAll(function (err) {
            if (err) {
                log.error(err);
                return callback(err);
            }
            callback(null);
        });
    },
    metadata: function (file, callback) {
        file = decodeURIComponent(file);
        var mbtiles = new MBTiles(file);
        mbtiles.metadata().then(function (metadata) {
            metadata.shortFile = tildify(file);
            callback(null, metadata);
        });
    }
};

function find(directory, arg, socket, callback) {
    var qq = queue(10);
    var exclude = '! -path "*node_modules*" ! -path "*.Trash*"';

    exec('find ' + [directory, arg, exclude].join(' ') + ' -type f -iname "*.mbtiles" 2> /dev/null', function (err, stdout) {
        if (err) {
            log.error(err);
            return callback(err);
        }

        stdout.split('\n').forEach(function (file) {
            // todo: ignore */node_modules/*
            if (file.length) {
                qq.defer(statMbtile, file);
            }
        });

        qq.awaitAll(function (err, files) {
            if (err) {
                log.error(err);
                return callback(err);
            }

            socket.emit('files', files);
            callback(null, true);
        });
    });
}

function statMbtile(file, callback) {
    var mbtiles = new MBTiles(file);
    // yeah I know :/
    // todo: refactor to use metadata function above
    mbtiles.metadata().then(function (metadata) {
        fs.stat(file, function (err, stats) {
            if (err) return callback(err);
            // add a few more useful properties
            metadata.path = file;
            metadata.basename = path.basename(file);
            metadata.dir = tildify(path.dirname(file));
            // todo: move filesize modification to clientside
            metadata.size = filesize(stats.size);
            metadata.modified = new Date(stats.mtime);
            callback(null, metadata);
        });
    });
}
