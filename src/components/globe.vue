<template>
    <div>
        <div id='map' class='tc dtc v-mid'></div>
    </div>
</template>

<style>
    .country {
      fill: #ddd;
      stroke: #ddd;
      stroke-width: 0.2px;
      stroke-linejoin: round;
    }

    .graticule {
      fill: none;
      stroke: rgba(0,0,0,0.1);
      stroke-width: 0.5px;
    }

    .globe-outline {
      fill: none;
      stroke: rgba(0,0,0,0.1);
      stroke-width: 0.5px;
    }

    .globe-fill {
        fill: #fff;
    }

    .bbox {
        fill: #FF0000;
        stroke: #FF0000;
        stroke-width: 1px;
    }
</style>

<script>
    var d3 = require('d3');
    var topojson = require('topojson-client');
    var world = require('../../world-110m.json');

    module.exports = {
        props: ['bounds', 'focus'],
        data: function () {
            return {
                projection: null,
                path: null,
                d3: null,
                rotationTimer: null
            }
        },
        watch: {
            bounds: function () {
                if (!this.focus) this.setBounds(this.bounds);
            },
            focus: function () {
                var that = this;
                var bounds = this.bounds.features.filter(function (feature) {
                    return (feature.properties.path == that.focus);
                })[0]; // should only ever be one match

                if (bounds) {
                    var svgPath = d3.selectAll('#map svg path');
                    that.rotationTimer.stop();
                    var centroid = d3.geoCentroid(bounds);
                    var coords = [centroid[0], centroid[1]];
                    this.setBounds([bounds]);
                    that.projection
                        .precision(1)
                        .scale(((window.innerWidth - 380)/2 * 2.25) - 20)
                        .rotate([-coords[0], -coords[1]]);
                    svgPath.attr('d', that.path);
                } else {
                    this.drawGlobe();
                }
            }
        },
        mounted: function () {
            this.drawGlobe();
            window.addEventListener('resize', this.drawGlobe);
        },
        beforeDestroy: function () {
            window.removeEventListener('resize', this.drawGlobe);
        },
        methods: {
            drawGlobe: function () {
                var that = this;

                var width = (window.innerWidth - 380);
                var height = window.innerHeight;

                var velocity = 0.01;
                var startLoc = [0, -10];

                that.projection = d3.geoOrthographic()
                    .translate([width / 2, height / 2])
                    .scale(Math.min(width, height) / 2 - 25)
                    .clipAngle(90)
                    .precision(0.5)
                    .rotate([(startLoc[0] + velocity) * Date.now(), startLoc[1]]);

                that.path = d3.geoPath()
                    .projection(that.projection);

                var graticule = d3.geoGraticule()
                    .extent([[-180, -90], [180 - .1, 90 - .1]])
                    .step([20, 20]);

                d3.selectAll('#map svg *').remove();
                d3.selectAll('#map svg').remove();

                var svg = d3.select('#map').append('svg')
                    .attr('width', width)
                    .attr('height', height);

                svg.append('path')
                    .datum({type: 'Sphere'})
                    .attr('class', 'globe-fill')
                    .attr('d', that.path);

                svg.append('path')
                    .datum(graticule)
                    .attr('class', 'graticule')
                    .attr('d', that.path);

                svg.selectAll('.country')
                    .data(topojson.feature(world, world.objects.countries).features)
                    .enter()
                        .append('path')
                        .attr('class', 'country')
                        .attr('d', that.path);

                svg.append('path')
                    .datum({type: 'Sphere'})
                    .attr('class', 'globe-outline')
                    .attr('d', that.path);

                that.setBounds(this.bounds);

                that.rotationTimer = d3.interval(function () {
                    that.projection.rotate([startLoc[0] + velocity * Date.now(), startLoc[1]]);
                    svg.selectAll('path').attr('d', that.path);
                }, 50);
            },
            setBounds: function (bounds) {
                // bounds must be an array of features
                bounds = (bounds && bounds.features) ? bounds.features : bounds;
                if (bounds) {
                    var bbox = d3.select('#map svg').selectAll('.bbox').data(bounds);
                    bbox.enter()
                        .append('path')
                        .attr('class', 'bbox')
                        .attr('d', this.path);
                    bbox.exit().remove();
                }
            }
        }
    }
</script>
