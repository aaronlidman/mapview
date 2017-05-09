'use strict';

var path = require('path');
var express = require('express');
var app = express();
var mbtiles = require('@mapbox/mbtiles');
var q = require('d3-queue').queue();

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

module.exports = {
    loadTiles: function (file, callback) {
        new mbtiles(file, function (err, tiles) {
            if (err) throw err;

            tiles.getInfo(function (err, info) {
                if (err) throw err;

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

        q.awaitAll(function (error, tilesets) {
            if (error) throw error;

            config.sources = {};
            tilesets.forEach(function (tileset) {
                config.sources[tileset.basename] = tileset;
            });

            listen(config, callback);
        });
    },
    listen: function (config, onListen) {
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
