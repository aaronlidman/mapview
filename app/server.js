'use strict';

var path = require('path');
var express = require('express');
var app = express();
var mbtiles = require('@mapbox/mbtiles');
var q = require('d3-queue').queue();
var log = require('electron-log');

var filescan = require('../lib/filescan');

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

function determineView(sources) {
    // quick and dirty for now
    // todo: properly confirm all sources have the same settings
        // if they don't, create smart compromises
        // if they do, return the shared settings
    var firstSource = sources[Object.keys(sources)[0]];
    return {
        format: firstSource.format,
        zoom: firstSource.maxzoom || 12,
        center: firstSource.center || [0, 0]
    };
}

function searchMbtiles(req, res) {
    var dir = req.params.dir ? decodeURIComponent(req.params.dir) : '~/';
    filescan(dir, function (err, files) {
        if (err) {
            log.error('ugh wtf');
            return res.end(err);
        }
        res.send(files);
    });
}

module.exports = {
    loadTiles: function (file, callback) {
        new mbtiles(file, function (err, tiles) {
            if (err) {
                log.error(err);
                throw err;
            }

            tiles.getInfo(function (err, info) {
                if (err) {
                    log.error(err);
                    throw err;
                }

                for (var property in tiles) {
                    info[property] = tiles[property];
                }

                callback(null, info);
            });
        });
    },
    serve: function (config, callback) {
        var loadTiles = this.loadTiles;
        var listen = this.listen;

        config.mbtiles.forEach(function (file) {
            q.defer(loadTiles, file);
        });

        q.awaitAll(function (err, tilesets) {
            if (err) {
                log.error(err);
                throw err;
            }

            config.sources = {};
            tilesets.forEach(function (tileset) {
                config.sources[tileset.basename] = tileset;
            });

            listen(config, callback);
        });
    },
    listen: function (config, callback) {
        var viewSettings = determineView(config.sources);
        for (var setting in viewSettings) {
            config[setting] = viewSettings[setting];
        }

        app.get('/', function (req, res) {
            if (config.format === 'pbf') {
                res.render('vector', config);
            } else {
                res.render('raster', config);
            }
        });

        app.get('/:source/:z/:x/:y.' + config.format, function (req, res) {
            var params = req.params;
            var source = config.sources[params.source];
            source.getTile(params.z, params.x, params.y, function (err, tile, headers) {
                if (err) {
                    log.error(err);
                    res.end();
                } else {
                    res.writeHead(200, headers);
                    res.end(tile);
                }
            });
        });

        app.get('/mbtiles/:dir', searchMbtiles);
        app.get('/mbtiles', searchMbtiles);

        // hook this up more
        // app.get('/mapbox_access_token', function (req, res) {
        //     res.end({
        //         accessToken: process.env.MAPBOX_ACCESS_TOKEN ||
        //             process.env.MapboxAccessToken || false
        //     });
        // });

        config.server = app.listen(config.port, function () {
            callback(null, config);
        });
    }
};
