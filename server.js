'use strict';

var fs = require('fs');
var path = require('path');
var express = require('express');
var app = express();
var log = require('electron-log');
var homedir = require('os').homedir();

app.use(express.static(path.join(__dirname, './')));

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
        res.send(JSON.stringify(metadata));
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
