'use strict';

var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;
var queue = require('d3-queue').queue;
var log = require('electron-log');
var filesize = require('filesize');
var tildify = require('tildify');
var MBTiles = require('mbtiles-offline');
var Store = require('electron-store');
var store = new Store();

module.exports = {
    scan: function (directory, socket, callback) {
        // immediately send whatever is in the cache first
        getSetFileStore(null, socket);

        // continue scanning to look for new files and update the cache
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

        q.awaitAll(function (err, results) {
            if (err) {
                log.error(err);
                return callback(err);
            }
            // all searches returned, do a hard reset on the store, overwrite all files with what you have here
            var uniq = new Set();
            results.forEach(function (fileArray) {
                fileArray.forEach(function (file) {
                    uniq.add(file);
                });
            });
            getSetFileStore(Array.from(uniq), socket);
            console.log('hard reset');

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

function getSetFileStore(files, socket) {
    if (files) store.set('files', files);
    var stored = store.get('files', []);
    if (stored.length) socket.emit('files', stored);
    return;
}

function find(directory, arg, socket, callback) {
    var qq = queue(10);
    var exclude = '! -path "*node_modules*" ! -path "*.Trash*"';

    exec('find ' + [directory, arg, exclude].join(' ') + ' -type f -iname "*.mbtiles" 2> /dev/null', function (err, stdout) {
        if (err) {
            log.error(err);
            return callback(err);
        }

        stdout.split('\n').forEach(function (file) {
            if (file.length) {
                qq.defer(statMbtile, file);
            }
        });

        qq.awaitAll(function (err, files) {
            if (err) {
                log.error(err);
                return callback(err);
            }

            var stored = store.get('files', []);
            if (stored.length) {
                console.log('from store');
                files = Array.from(new Set(stored.concat(files)));
            }
            // merge and uniq with files
            // then store and emit
            getSetFileStore(files, socket);

            callback(null, files);
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
            metadata.size = filesize(stats.size, {
                round: 1,
                output: 'object'
            });
            if (metadata.size.suffix !== 'GB') {
                metadata.size.value = parseInt(metadata.size.value);
            }
            metadata.size = metadata.size.value + ' ' + metadata.size.suffix;
            metadata.modified = new Date(stats.mtime);
            callback(null, metadata);
        });
    });
}
