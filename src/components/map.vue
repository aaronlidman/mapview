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
    <div class='z-max tc w-100'>
        <h4 v-if='shortFile' class='z-max normal white code ma0 drag' id='filename'>{{ shortFile }}</h4>
    </div>
    <div id='selectors' class='z-max fixed fr bottom-0 right-0'>
        <span v-if='!showSelectors' @click='showSelectors = true' class='fa fa-cog white-70 hover-white fa-2x pointer pa2 pt1 pb1'></span>
        <span v-if='showSelectors' @click='showSelectors = false' class='bg-white fa fa-close pointer fa-2x pa2 pt1 pb1'></span>
    </div>
    <div id='selectorPanel' v-if='showSelectors' class='z-9999 fixed bg-white bottom-0 right-0 pa3 mb45'>
        <!--
            - todo: break into it's own component
            - todo: persist state on menu close and repopen
            - todo: fix filter labels
            - todo: select specific color pallettes
            - todo: change background/foreground color
        -->
        <li class='mb2'>
            <div class='mb1'>Filter:</div>
            <form>
                <input type='checkbox' name='inspect' value='inspect' id='inspect'><label for='inspect'> show attributes</label>
            </form>
        </li>
        <li>
            <div class='mb1'>Show:</div>
            <form>
                <input type='radio' name='chooseone' value='all'><label for='all'> all</label><br>
                <input type='radio' name='chooseone' value='points'><label for='points'> only points</label><br>
                <input type='radio' name='chooseone' value='lines'><label for='lines'> only lines</label><br>
                <input type='radio' name='chooseone' value='polygons'><label for='polygons'> only polygons</label><br>
            </form>
        </li>
        <li></li>
    </div>
    <div id='map' class='no-drag bg-near-black w-100 vh-100'></div>
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
            showSelectors: this.showSelectors
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

    .mb45 {
        margin-bottom: 2.5rem;
    }

    #filename {
        font-size: 14px;
        text-shadow: 1px 1px 0px black;
    }
</style>
