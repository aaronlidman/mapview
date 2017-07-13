<template>
<div>
    <div id='free-space' class='fl fixed bg-white w-100 vh-100 drag pa4 dt'>
    <!-- we're going to put a map here -->
        <div id='map' class='tc dtc v-mid'>
            <!-- <h1 class='tracked-tight avenir white f-headline ma0 ttu'>pick</h1> -->
        </div>
    </div>
    <div id='file-list' class='fr bg-white-50 drag absolute right-0' v-show='!loading'>
        <div class='dt vh-100 w-100'>
            <div class='dtc'>
                <table class='collapse w-100'>
                    <tr v-for='file in files' :key='file.path' @click.once='selectFile(file.path)' class='f6 w-100 hover-bg-white black'>
                        <td class='pr1 pv3 ph4'>
                            <div><span>{{ file.basename }}</span></div>
                            <div><span class='black-40'>{{ file.dir }}</span></div>
                        </td>
                        <td class='dtc black-40 tr pa1 pv3 v-btm'><span>{{ file.humanModified }}</span></td>
                        <td class='tr pa1 pv3 pr3 black-40 v-btm'><span>{{ file.size }}</span></td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</div>
</template>

<style src='../../node_modules/font-awesome/css/font-awesome.min.css'></style>
<style>
#free-space {
    padding-right: 382px;
}

#file-list {
    width: 382px;
}

.breaky {
    word-wrap: break-word;
    overflow-wrap: break-word;
    word-break: break-word;
}

.bg-hover-lime:hover, .bg-lime { background-color: hsla(90, 70%, 55%, 1); }
.bg-new-red { background-color: #D3312B;}
.bg-new-yellow { background-color: hsla(45, 87%, 60%, 1); }
.bg-newer-yellow { background-color: #FCE933; }
.bg-hover-another-yellow:hover, .bg-another-yellow { background-color: #FEC309; }

.hover-bg-black:hover .black-40 {
    color: rgba(255,255,255,0.5);
}
</style>

<script></script>
<script>
module.exports = {
    data: function () {
        return {
            loading: true,
            files: [],
            error: null,
            socket: null
        }
    },
    created: function () {
        this.fetchData();
    },
    mounted: function () {
        this.buildMap();
    },
    watch: {
        // call the method again if the route changes
        '$route': 'fetchData'
    },
    methods: {
        buildMap: function () {
            // derived from https://bl.ocks.org/mbostock/4183330
            var d3 = Object.assign({}, require('d3-selection'), require('d3-transition'), require('d3-geo'), require('d3-interpolate'));
            var topojson = require('topojson-client');
            var world = require('../../world-110m.json');

            // todo: get width and height from current size
            // todo: redraw on resize
            var res = window.devicePixelRatio || 1;
            var width = (window.innerWidth - 382);
            var height = window.innerHeight;

            console.log(width, height);

            var projection = d3.geoOrthographic()
                .translate([width / 2, height / 2])
                .scale(width / 2 - 20)
                .clipAngle(90)
                .precision(0.75);

            var canvas = d3.select('#map')
                .append('canvas')
                    .attr('width', width * res)
                    .attr('height', height * res)
                    .style('width', width)
                    .style('height', height)

            var c = canvas.node().getContext('2d');

            var path = d3.geoPath()
                .projection(projection)
                .context(c);

            var title = d3.select('h1');

            var globe = {type: 'Sphere'};
            var land = topojson.feature(world, world.objects.land);
            var countries = topojson.feature(world, world.objects.countries).features;
            var borders = topojson.mesh(world, world.objects.countries, function(a, b) {return a !== b;});
            var i = -1;
            var n = countries.length;

            (function transition() {
                d3.transition()
                    .duration(1250)
                    .each(function() {
                        console.log(countries[i = (i + 1) % n].name);
                    })
                    .tween('rotate', function() {
                        var p = d3.geoCentroid(countries[i]);
                        var r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);
                        return function(t) {
                            projection.rotate(r(t));
                            c.clearRect(0, 0, width, height);
                            c.fillStyle = '#ccc',

                            c.beginPath();
                            path(land);
                            c.fill();
                            c.fillStyle = '#f00';

                            c.beginPath();
                            path(countries[i]);
                            c.fill();
                            c.strokeStyle = '#fff';
                            c.lineWidth = .5;

                            c.beginPath();
                            path(borders);
                            c.stroke();
                            c.strokeStyle = '#000';
                            c.lineWidth = 1;

                            c.beginPath();
                            path(globe);
                            c.stroke();
                        };
                    })
                    .transition()
                    .each('end', transition);
            })();
        },
        fetchData: function () {
            var socket = require('socket.io-client')('http://localhost:20009/picker');
            var _ = require('lodash');
            var that = this;

            socket.on('connect', function () {
                that.socket = socket;
            });

            socket.on('files', function (files) {
                // full list files
                that.loading = false;
                that.files = files;
            });

            socket.on('update', function(files) {
                // incremental update of potentially new files
                // append and uniq against what is currently available
                that.loading = false;
                that.files = _.uniqWith(that.files.concat(files), _.isEqual);
            });
        },
        selectFile: function(filePath) {
            this.socket.close();
            this.$router.push({
                path: 'map',
                query: {
                    file: filePath
                }
            });
        }
    }
}
</script>
