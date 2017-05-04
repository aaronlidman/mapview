/* eslint-disable no-console */

var express = require('express');
var app = express();
var MBTiles = require('mbtiles');
var q = require('d3-queue').queue();
var utils = require('./utils');
var objectAssign = require('object-assign');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static('public'));

module.exports = {
    loadTiles: function (file, callback) {
        new MBTiles(file, function(err, tiles) {
            if (err) throw err;

            tiles.getInfo(function (err, info) {
                if (err) throw err;

                var tileset = objectAssign({}, info, {
                    tiles: tiles
                });

                callback(null, tileset);
            });
        });
    },
    serve: function (config, callback) {
        var loadTiles = this.loadTiles;
        var listen = this.listen;

        config.mbtiles.forEach(function (file) {
            q.defer(loadTiles, file);
        });

        q.awaitAll(function (error, tilesets) {
            if (error) throw error;
            var finalConfig = utils.mergeConfigurations(config, tilesets);
            listen(finalConfig, callback);
        });
    },
    listen: function (config, onListen) {
        var format = config.tiles._info.format;

        app.get('/', function (req, res) {
            if (format === 'pbf') {
                res.render('vector', config);
            } else {
                res.render('raster', config);
            }
        });

        app.get('/:source/:z/:x/:y.' + format, function (req, res) {
            var p = req.params;

            var tiles = config.sources[p.source].tiles;
            tiles.getTile(p.z, p.x, p.y, function (err, tile, headers) {
                if (err) {
                    res.end();
                } else {
                    res.writeHead(200, headers);
                    res.end(tile);
                }
            });
        });

        config.server = app.listen(config.port, function () {
            onListen(null, config);
        });
    }
};
