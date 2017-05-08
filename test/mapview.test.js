'use strict';

var path = require('path');
var mapview = require('../lib/mapview');
var request = require('supertest');
var test = require('tape').test;

var server = null;

test('loadTiles', function (t) {
    t.plan(6);

    var mb = path.join(__dirname, '/../examples/baja-highways.mbtiles');
    mapview.loadTiles(mb, function (err, tileset) {
        if (err) t.error(err);

        var center = [-117.037354, 32.537551, 14];
        var layers = tileset.vector_layers;
        t.deepEqual(tileset.center, center, 'sets center');
        t.equal(tileset.maxzoom, 14, 'sets maxzoom');
        t.equal(layers[0].id, 'bajahighways', 'tileset has one layer');
    });

    mb = path.join(__dirname, '/fixtures/twolayers.mbtiles');
    mapview.loadTiles(mb, function (err, tileset) {
        if (err) t.error(err);

        var layers = tileset.vector_layers;
        t.true(tileset, 'loads tileset');
        t.equal(layers[0].id, 'hospitales', 'loads first layer');
        t.equal(layers[1].id, 'playas', 'loads second layer');
    });
});

test('serve', function (t) {
    t.plan(8);

    var params = {
        basemap: 'dark',
        mbtiles: [
            path.join(__dirname, '/../examples/baja-highways.mbtiles'),
            path.join(__dirname, '/fixtures/twolayers.mbtiles'),
            path.join(__dirname, '/fixtures/038.mbtiles')
        ],
        port: 9000,
        accessToken: 'pk.foo.bar'
    };

    mapview.serve(params, function (err, config) {
        t.error(err, 'should start server with no error');
        server = config.server;

        request('localhost:9000')
            .get('/')
            .expect('Content-Type', 'text/html; charset=utf-8')
            .end(function (err, res) {
                if (err) t.error(err);

                var match = res.text.match(/bajahighways-lines/)[0];
                t.true(match, 'loads a map with lines from first tileset');
                match = res.text.match(/hospitales-pts/)[0];
                t.true(match, 'loads points from first layer in second tileset');
                match = res.text.match(/playas-pts/)[0];
                t.true(match, 'loads points from second layer in second tileset');
                match = res.text.match(/menu-container/)[0];
                t.true(match, 'should have a menu');
            });

        request('localhost:9000')
            .get('/#14/32.5376/-117.0374')
            .expect('Content-Type', 'text/html; charset=utf-8')
            .end(function (err) {
                t.error(err, 'responds to Mapbox GL JS panning');
            });

        request('localhost:9000')
            .get('/baja-highways.mbtiles/14/2864/6624.pbf')
            .expect('Content-Type', 'application/x-protobuf')
            .end(function (err) {
                t.error(err, 'serves protobufs for ' + source);
            });

        var source = Object.keys(config.sources)[2];
        request('localhost:9000')
            .get('/' + source + '/14/2864/6624.pbf')
            .expect(200)
            .end(function (err) {
                t.error(err, 'serves protobufs for ' + source);
            });
    });
});

test('teardown', function (t) {
    server.close();
    t.end();
});
