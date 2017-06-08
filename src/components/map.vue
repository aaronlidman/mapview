<template>
<div>
    <div id='map' class='bg-near-black w-100 vh-100'></div>
    <!-- todo: set a cool title -->
    <h1 id='title'></h1>
</div>
</template>

<script>
var mapboxgl = require('mapbox-gl');
var qs = require('query-string');
var request = require('request');
var log = require('electron-log');
var mapStyle = require('../client/mapStyle');

module.exports = {
    mounted: function () {
        var hash = qs.parse(window.location.hash);
        var filepath = hash['/map?file'];
        var map, metadata;

        console.log('filezPath', this.filezPath);
        console.log('filez', this.filez);

        mapboxgl.accessToken = '';

        request('http://localhost:20009/metadata/' + encodeURIComponent(filepath), function (err, resp, body) {
            if (err) return log.error(err);
            metadata = JSON.parse(body);
            map = new mapboxgl.Map({
                container: 'map',
                maxZoom: 30,
                style: mapStyle(filepath, metadata)
            });
        });
    },
    data: function () {
        return {};
    }
};
</script>

<style src='../../node_modules/mapbox-gl/dist/mapbox-gl.css'></style>
