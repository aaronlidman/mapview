<template>
<div>
    <div id='map' class='w-100 vh-100'></div>
    <h1 id='title'></h1>
</div>
</template>

<script>
var mapboxgl = require('mapbox-gl');
var qs = require('query-string');
var request = require('request');
var log = require('electron-log');

module.exports = {
    mounted: function () {
        var hash = qs.parse(window.location.hash);
        var file = hash['/map?file'];
        var map, metadata;

        mapboxgl.accessToken = '';

        request('http://localhost:20009/metadata/' + encodeURIComponent(file), function (err, resp, body) {
            if (err) return log.error(err);
            metadata = JSON.parse(body);
            loadMap();
        });

        function createStyle(layers, sourceId) {
            layers.forEach(function (layer) {
                var polygons = {
                    id: layer.id + '-polygons',
                    type: 'fill',
                    source: sourceId,
                    'source-layer': layer.id,
                    filter: ['==', '$type', 'Polygon'],
                    layout: {},
                    paint: {
                        'fill-opacity': 0.1,
                        'fill-color': '#00FF00'
                    }
                };

                var polygonOutlines = {
                    id: layer.id + '-polygon-outlines',
                    type: 'line',
                    source: sourceId,
                    'source-layer': layer.id,
                    filter: ['==', '$type', 'Polygon'],
                    layout: {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    paint: {
                        'line-color': '#00FF00',
                        'line-width': 1,
                        'line-opacity': 0.75
                    }
                };

                var lines = {
                    id: layer.id + '-lines',
                    type: 'line',
                    source: sourceId,
                    'source-layer': layer.id,
                    filter: ['==', '$type', 'LineString'],
                    layout: {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    paint: {
                        'line-color': '#00FF00',
                        'line-width': 1,
                        'line-opacity': 0.75
                    }
                };

                var points = {
                    id: layer.id + '-points',
                    type: 'circle',
                    source: sourceId,
                    'source-layer': layer.id,
                    filter: ['==', '$type', 'Point'],
                    paint: {
                        'circle-color': '#00FF00',
                        'circle-radius': 2.5,
                        'circle-opacity': 0.75
                    }
                };

            });
        }

        function loadMap() {
            map = new mapboxgl.Map({
                container: 'map',
                maxZoom: 30
            });

            map.setStyle('mapbox://styles/mapbox/streets-v9');
        }
    },
    data: function () {
        return {};
    }
};
</script>

<style src='../../node_modules/mapbox-gl/dist/mapbox-gl.css'></style>
<style>

</style>
