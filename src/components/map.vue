<template>
<div>
    <table id='navigation' class='collapse left-0 z-max fixed top-3 bold bg-white black'>
        <tr>
            <td id='back-button' class='pa2 hover-bg-light-gray pointer' @click.once='backToPicker'>◀</td>
            <td class='ttu pa2 pr3 ma0 drag'>
                <h1 id='title' class='ma0'>View</h1>
            </td>
        </tr>
    </table>
    <h4 v-if='shortFile' class='z-max fixed top-0 right-0 normal white code ma2 drag' id='filename'>{{ shortFile }}</h4>
    <div id='modifiersButton' class='z-max fixed bottom-0 right-0'>
        <span v-if='!showModifiers' @click='showModifiers = true' class='fa fa-cog white-70 hover-white fa-2x pointer pa2 pt1 pb1'></span>
        <span v-if='showModifiers' @click='showModifiers = false' class='bg-white fa fa-close pointer fa-2x pa2 pt1 pb1'></span>
    </div>
    <modifierMenu :show='showModifiers'></modifierMenu>
    <div id='map' class='no-drag bg-near-black w-100 vh-100'></div>
</div>
</template>

<script>
var mapboxgl = require('mapbox-gl');
var qs = require('query-string');
var request = require('request');
var log = require('electron-log');
var mapStyle = require('../client/mapStyle');
var modifierMenu = require('./modifierMenu.vue');

module.exports = {
    components: {
        modifierMenu
    },
    mounted: function () {
        var that = this;
        var hash = qs.parse(window.location.hash);
        var filepath = encodeURIComponent(hash['/map?file']);
        var map, metadata;

        mapboxgl.accessToken = '';

        request('http://localhost:20009/metadata/' + filepath, function (err, resp, body) {
            if (err) return log.error(err);
            metadata = JSON.parse(body);
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
            shortFile: this.shortFile,
            showModifiers: this.showModifiers
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
