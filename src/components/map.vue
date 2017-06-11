<template>
<div>
    <table id='navigation' class='collapse left-0 z-max fixed top-3 bold bg-white black'>
        <tr>
            <td id='back-button' class='pt3 pb3 pr3 pl3 hover-bg-light-gray pointer' @click.once='backToPicker'>◀</td>
            <td class='ttu pa3 pr4 ma0 drag'>
                <h1 id='title' class='ma0'>View</h1>
            </td>
        </tr>
    </table>
    <div id='map' class='no-drag bg-near-black w-100 vh-100'></div>
    <h4 v-if='shortFile' class='normal top-0 right-0 white code tr ma2 fixed drag' id='filename'>{{ shortFile }}</h4>
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

        mapboxgl.accessToken = 'pk.eyJ1IjoiYWFyb25saWRtYW4iLCJhIjoiNTVucTd0TSJ9.wVh5WkYXWJSBgwnScLupiQ';

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
    },
    methods: {
        backToPicker: function(event) {
            this.$router.push({
                path: '/'
            });
        }
    }
};
</script>

<style src='../../node_modules/mapbox-gl/dist/mapbox-gl.css'></style>

<style>
    .top-3 {
        top: 3rem;
    }

    #filename {
        font-size: 14px;
        text-shadow: 1px 1px 0px black;
    }
</style>
