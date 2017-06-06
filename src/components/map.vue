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

        function loadMap() {
            map = new mapboxgl.Map({
                container: 'map',
                maxZoom: 30
            });

            // we need to make a dumb default style
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
