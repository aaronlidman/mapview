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
    <h4 v-if='metadata' class='z-max fixed top-0 right-0 normal white code ma2 drag' id='filename'>{{ metadata.shortFile }}</h4>
    <modifierMenu :filter.sync='filter' :inspect.sync='inspect'></modifierMenu>
    <div id='map' class='no-drag bg-near-black w-100 vh-100'></div>
</div>
</template>

<script>
var mapboxgl = require('mapbox-gl');
var qs = require('query-string');
var request = require('request');
var log = require('electron-log');
var MapboxInspect = require('mapbox-gl-inspect');

var mapStyle = require('../client/mapStyle');
var modifierMenu = require('./modifierMenu.vue');

module.exports = {
    components: {
        modifierMenu
    },
    mounted: function () {
        var hash = qs.parse(window.location.hash);
        this.filepath = encodeURIComponent(hash['/map?file']);

        mapboxgl.accessToken = '';

        var that = this;
        request('http://localhost:20009/metadata/' + that.filepath, function (err, resp, body) {
            if (err) return log.error(err);
            that.metadata = JSON.parse(body);
            var style = mapStyle(that.filepath, that.metadata);
            that.backgroundColor = style.backgroundColor;
            that.foregroundColor = style.foregroundColor;
            that.map = new mapboxgl.Map({
                container: 'map',
                maxZoom: 30,
                style: style.style
            });
        });
    },
    data: function () {
        return {
            backgroundColor: null,
            foregroundColor: null,
            metadata: null,
            filter: 'none',
            inspect: false,
            filepath: null,
            map: null,
            inspect: null
        };
    },
    methods: {
        backToPicker: function(event) {
            this.$router.push({
                path: '/'
            });
        }
    },
    watch: {
        // computed property just wasn't updating, could never track down why
        filter: function () {
            var style = mapStyle(this.filepath, this.metadata, this.filter, this.foregroundColor);
            this.map.setStyle(style.style);
        },
        inspect: function() {
            if (!this.inspectControl) {
                this.inspectControl = new MapboxInspect({
                    popup: new mapboxgl.Popup({
                        closeButton: false,
                        closeOnClick: false
                    }),
                    showInspectMap: false,
                    showInspectButton: false,
                    showMapPopupOnHover: false,
                    showInspectMapPopupOnHover: false,
                    useInspectStyle: false
                });
            }

            if (this.inspect) {
                this.map.addControl(this.inspectControl);
            } else {
                this.map.removeControl(this.inspectControl);
            }
        }
    }
};
</script>

<style src='../../node_modules/mapbox-gl/dist/mapbox-gl.css'></style>
<style src='../../node_modules/mapbox-gl-inspect/dist/mapbox-gl-inspect.css'></style>

<style>
    .top-3 {
        top: 3rem;
    }
    #filename {
        font-size: 14px;
        text-shadow: 1px 1px 0px black;
    }
</style>
