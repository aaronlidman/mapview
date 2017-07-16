<template>
<div>
    <div id='free-space' class='fl fixed bg-near-white w-100 vh-100 drag dt'>
    <!-- we're going to put a map here -->
        <div id='map' class='tc dtc v-mid'>
            <!-- <h1 class='tracked-tight avenir white f-headline ma0 ttu'>pick</h1> -->
        </div>
    </div>
    <div id='file-list' class='fr bg-near-white drag absolute right-0' v-show='!loading'>
        <div class='dt vh-100 w-100'>
            <div class='dtc v-mid'>
                <table class='collapse w-100'>
                    <tr v-for='file in files' :key='file.path' @click.once='selectFile(file.path)' class='f6 w-100 hover-bg-white black'>
                        <td class='pr1 pa3'>
                            <div><span>{{ file.basename }}</span></div>
                            <div><span class='black-40'>{{ file.dir }}</span></div>
                        </td>
                        <td class='dtc black-40 tr pa1 pv3 v-btm'><span>{{ file.humanModified }}</span></td>
                        <td class='tr pl1 pa3 black-40 v-btm'><span>{{ file.size }}</span></td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</div>
</template>

<style src='../../node_modules/font-awesome/css/font-awesome.min.css'></style>
<style>
#free-space { padding-right: 420px; }
#file-list { width: 420px; }

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

.country {
  fill: hsl(210,1%,85%);
  stroke: #fff;
  stroke-width: 0.5px;
  stroke-linejoin: round;
}

.graticule {
  fill: none;
  stroke: #000;
  stroke-opacity: 0.2;
  stroke-width: 0.5px;
}

.globe-outline {
  fill: none;
  stroke: #333;
  stroke-width: 1px;
}

.globe-fill {
  fill: #fff;
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
            window.addEventListener('resize', build);

            build();

            function build() {
                var d3 = Object.assign({}, require('d3-selection'), require('d3-transition'), require('d3-geo'), require('d3-interpolate'), require('d3-timer'));
                var topojson = require('topojson-client');
                var world = require('../../world-110m.json');

                // todo: get width and height from current size
                // todo: redraw on resize
                var width = (window.innerWidth - 420);
                var height = window.innerHeight;

                var centroid = d3.geoPath()
                    .projection(function(d) { return d; })
                    .centroid;

                var velocity = 0.01;
                var time = Date.now();
                var startLoc = [0, -10];

                var projection = d3.geoOrthographic()
                    .translate([width / 2, height / 2])
                    .scale(Math.min(height, width) / 2 - 20)
                    .clipAngle(90)
                    .precision(0.5)
                    .rotate([(startLoc[0] + velocity) * (Date.now() - time), startLoc[1]]);

                var path = d3.geoPath()
                    .projection(projection);

                var graticule = d3.geoGraticule()
                    .extent([[-180, -90], [180 - .1, 90 - .1]])
                    .step([20, 20]);

                d3.selectAll('#map svg *').remove();
                d3.selectAll('#map svg').remove();

                var svg = d3.select('#map').append('svg')
                    .attr('width', width)
                    .attr('height', height);

                svg.append('circle')
                    .attr('class', 'globe-fill')
                    .attr('cx', width / 2)
                    .attr('cy', height / 2)
                    .attr('r', projection.scale());

                var line = svg.append('path')
                    .datum(graticule)
                    .attr('class', 'graticule')
                    .attr('d', path);

                var countries = topojson.feature(world, world.objects.countries).features;

                var country = svg.selectAll('.country')
                    .data(countries)
                    .enter()
                        .append('path')
                        .attr('class', 'country')
                        .attr('d', path);

                svg.append('circle')
                    .attr('class', 'globe-outline')
                    .attr('cx', width / 2)
                    .attr('cy', height / 2)
                    .attr('r', projection.scale());

                d3.interval(function () {
                    var dt = Date.now() - time;
                    projection.rotate([startLoc[0] + velocity * dt, startLoc[1]]);
                    svg.selectAll('path').attr('d', path);
                }, 50);
            }
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

            socket.on('update', function (files) {
                // incremental update of potentially new files
                // append and uniq against what is currently available
                that.loading = false;
                that.files = _.uniqWith(that.files.concat(files), _.isEqual);
            });
        },
        selectFile: function (filePath) {
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
