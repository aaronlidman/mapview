'use strict';

var express = require('express');
var app = express();
var log = require('electron-log');
var homedir = require('os').homedir();

var file = require('./src/server/file');

function searchMbtiles(req, res) {
    var dir = req.params.dir ? decodeURIComponent(req.params.dir) : homedir;
    file.scan(dir, function (err, files) {
        if (err) {
            log.error(err);
            return res.end(err);
        }
        res.send(files);
    });
}

function getMetadata(req, res) {
    file.metadata(decodeURIComponent(req.params.file), function (err, metadata) {
        if (err) {
            log.error(err);
            return res.end(err);
        }
        res.sent(JSON.stringify(metadata));
    });
}

module.exports = function (config, callback) {
    app.get('/mbtiles/:dir', searchMbtiles);
    app.get('/mbtiles', searchMbtiles);
    app.get('/metadata/:file', getMetadata);

    app.listen(config.port, function () {
        callback(null, config);
    });
};
