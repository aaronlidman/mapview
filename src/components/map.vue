<template>
<div>
    <div id='titlebar' class='z-9999 fixed top-0 drag w-100 bg-black white caption fw-500'>
        <div id='leftButtons' class='dt h-inherit fl w-third'>
            <div class='dtc v-mid'>
                <div class='di br2 bg-white-20 hover-bg-white-30' style='padding: 5px 10px; margin-left: 80px;' @click.once='backToPicker'><span class='f5'>‹</span> Files</div>
            </div>
        </div>
        <div id='fileName' class='dt fl w-third h-inherit tc nowrap'>
            <div class='dtc v-mid'>
                <span v-if='metadata'>{{ metadata.shortFile }}</span>
            </div>
        </div>
        <div class='w-third fl h-inherit dt'></div>
    </div>
    <modifierMenu v-bind:filter.sync='filter' v-bind:basemap.sync='basemap'></modifierMenu>
    <div id='map' class='bg-near-black w-100 vh-100'></div>
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

        mapboxgl.accessToken = 'pk.eyJ1IjoiYWFyb25saWRtYW4iLCJhIjoiNTVucTd0TSJ9.wVh5WkYXWJSBgwnScLupiQ';

        // this should eventually be abstracted into a global mixin

        var that = this;
        // todo: convert /metadata to websocket
        // todo: get accesstoken from store via server
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

            that.map.addControl(new MapboxInspect({
                popup: new mapboxgl.Popup({
                    closeButton: true,
                    closeOnClick: false
                }),
                showInspectMap: false,
                showInspectButton: false,
                showMapPopupOnHover: false,
                showMapPopup: true,
                showInspectMapPopupOnHover: false
            }));
        });
    },
    data: function () {
        return {
            backgroundColor: null,
            foregroundColor: null,
            metadata: null,
            filter: 'none',
            basemap: 'no_basemap',
            selectedBasemap: false,
            filepath: null,
            map: null
        };
    },
    methods: {
        backToPicker: function(event) {
            this.$router.push({
                path: '/'
            });
        },
        setStyle: function() {
            var that = this;
            var style = mapStyle(that.filepath, that.metadata, that.filter, that.foregroundColor).style;

            // set a basemap
            if (that.basemap === 'no_basemap') {
                that.map.setStyle(style);
            } else {
                that.map.setStyle('mapbox://styles/mapbox/' + that.basemap + '-v9');
                // wait for ^ style to finish loading
                that.map.on('sourcedata', sourceUpdate);

                function sourceUpdate (event) {
                    // insert items from `style` individually
                    if (event.isSourceLoaded) {
                        // wait for the style to finish loading
                        Object.keys(style.sources).map(function (sourceKey) {
                            if (!that.map.getSource(sourceKey)) {
                                that.map.addSource(sourceKey, style.sources[sourceKey]);
                            }
                            // add all the layers for the source
                            style.layers.map(function(layer) {
                                if (layer.source && (layer.source == sourceKey)) {
                                    that.map.addLayer(layer);
                                }
                            });
                        });

                        that.map.off('sourcedata', sourceUpdate);
                    }
                }

            }
        }
    },
    watch: {
        // computed property just wasn't updating, could never track down why
        filter: function () {
            this.setStyle();
        },
        basemap: function () {
            this.setStyle();
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
    #titlebar {
        border: 1px solid #222;
        border-bottom: none;
        height: 38px;
        text-shadow: 0px 0px 1px black;
        min-width: 720px;
    }
</style>
