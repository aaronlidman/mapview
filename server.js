'use strict';

var fs = require('fs');
var path = require('path');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var log = require('electron-log');
var homedir = require('os').homedir();
var MBTiles = require('mbtiles-offline');
var tiletype = require('@mapbox/tiletype');
var io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, './')));

var file = require('./src/server/file');
var loadedTiles = {};

function searchMbtiles(dir, socket) {
    file.scan(dir, socket, function (err) {
        if (err) return log.error(err);
        socket.emit('done');
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

function getTile(req, res) {
    var p = req.params;
    var file = decodeURIComponent(p.source);
    if (!loadedTiles[file]) {
        // todo: refactor to only initialize and get stats/metadata once per file
        loadedTiles[file] = new MBTiles(decodeURIComponent(file));
        loadedTiles[file].stats = fs.statSync(decodeURIComponent(file));
    }

    loadedTiles[file].findOne([p.x, p.y, p.z].map(Number))
        .then(function (tile) {
            if (!tile) {
                res.writeHead(204);
                return res.end();
            }
            var headers = tiletype.headers(tile);
            headers['Last-Modified'] = new Date(loadedTiles[file].stats.mtime).toUTCString();
            res.writeHead(200, headers);
            res.end(tile);
        })
        .catch(function (err) {
            log.error(err);
            res.end();
        });
}

module.exports = function (callback) {
    app.get('/metadata/:file', getMetadata);
    app.get('/:source/:z/:x/:y.:format', getTile);

    io.of('/picker')
        .on('connection', function (socket) {
            // immediately initialize a search and respond through websocket events
            searchMbtiles(homedir, socket);
        });

    server.listen(20009);
    callback(null, 'ok');
};
