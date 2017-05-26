'use strict';

var path = require('path');
var express = require('express');
var app = express();
var log = require('electron-log');
var homedir = require('os').homedir();

var filescan = require('./lib/filescan');

app.use(express.static(path.join(__dirname, './')));

function searchMbtiles(req, res) {
    var dir = req.params.dir ? decodeURIComponent(req.params.dir) : homedir;
    filescan(dir, function (err, files) {
        if (err) {
            log.error(err);
            return res.end(err);
        }
        res.send(files);
    });
}

module.exports = function (config, callback) {
    app.get('/mbtiles/:dir', searchMbtiles);
    app.get('/mbtiles', searchMbtiles);

    app.listen(config.port, function () {
        callback(null, config);
    });
};
