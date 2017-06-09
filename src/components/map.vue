<template>
<div>
    <div id='map' class='no-drag bg-near-black w-100 vh-100'></div>
    <h4 v-if='shortFile' class='normal top-0 right-0 white code tr ma3 fixed' id='title'>{{ shortFile }}</h4>
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
        var that = this;
        var hash = qs.parse(window.location.hash);
        var filepath = encodeURIComponent(hash['/map?file']);
        var map, metadata;

        mapboxgl.accessToken = '';

        request('http://localhost:20009/metadata/' + filepath, function (err, resp, body) {
            if (err) return log.error(err);
            metadata = JSON.parse(body);
            console.log(metadata);
            that.shortFile = metadata.shortFile;
            map = new mapboxgl.Map({
                container: 'map',
                maxZoom: 30,
                style: mapStyle(filepath, metadata)
            });
        });
    },
    data: function () {
        return {
            shortFile: this.shortFile
        };
    }
};
</script>

<style src='../../node_modules/mapbox-gl/dist/mapbox-gl.css'></style>

<style>
    #title {
        font-size: 14px;
        text-shadow: 1px 1px 0px black;
    }
</style>
