<template>
<div>
    <div id='free-space' class='fl fixed bg-blue w-100 vh-100 drag dt'>
        <globe v-bind:bounds.sync='bounds' v-bind:focus.sync='focus'></globe>
    </div>
    <div id='file-list' class='fr bg-blue drag absolute right-0 overflow-scroll'>
        <div @mouseleave='hoverFile(false)' class='w-100 overflow-scroll'>
            <div v-for='file in files' :key='file.path' @click.once='selectFile(file.path)' @mouseenter='hoverFile(file.path)' class='f6 w-100 hover-bg-white-20 white-50 pointer pa3'>
                <div>
                    <span class='fw-500 white'>{{ file.basename }}</span>
                </div>
                <div>
                    <span>{{ file.dir }}</span>
                    <div class='w-40 fr nowrap tr'>
                        <div class='w-50 fl ph2'>
                            <span>{{ file.humanModified }}</span>
                        </div>
                        <div class='w-50 fr ph2'>
                            <span>{{ file.size }}</span>
                        </div>
                    </div>
                </div>
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

.hover-bg-black:hover .black-40 { color: rgba(255,255,255,0.5); }
</style>

<script>
var globe = require('./globe.vue');
var socket = require('socket.io-client')('http://localhost:20009/picker');
var _ = require('lodash');

module.exports = {
    components: {
        globe
    },
    data: function () {
        return {
            files: [],
            error: null,
            socket: null,
            bounds: null,
            focus: null
        }
    },
    created: function () {
        this.fetchData();
    },
    watch: {
        // call the method again if the route changes
        '$route': 'fetchData'
    },
    methods: {
        fetchData: function () {
            var that = this;

            socket.on('connect', function () {
                that.socket = socket;
            });

            socket.on('files', function (files) {
                // full list files
                that.files = prepFiles(files);
                createBboxes(that.files);
            });

            socket.on('update', function (files) {
                // incremental update of potentially new files
                // append and uniq against what is currently available
                that.files = prepFiles(files, that.files);
                createBboxes(that.files);
            });

            function prepFiles(files, compareTo) {
                files.forEach(function (file) {
                    console.log(file.path, file.humanModified);
                });

                if (compareTo) {
                    files = _.uniqWith(compareTo.concat(files), function (value, anotherValue) {
                        return value.path === anotherValue.path;
                    });
                }

                return files;
            }

            function createBboxes(files) {
                that.bounds = {
                    'type': 'FeatureCollection',
                    'features': that.files.map(function (file) {
                        return {
                            'type': 'Feature',
                            'properties': {
                                path: file.path
                            },
                            'geometry': {
                                'type': 'Polygon',
                                'coordinates': [[
                                    [file.bounds[0], file.bounds[1]],
                                    [file.bounds[0], file.bounds[3]],
                                    [file.bounds[2], file.bounds[3]],
                                    [file.bounds[2], file.bounds[1]],
                                    [file.bounds[0], file.bounds[1]]
                                ]]
                            }
                        };
                    })
                };
            }
        },
        selectFile: function (filePath) {
            this.socket.close();
            this.$router.push({
                path: 'map',
                query: {
                    file: filePath
                }
            });
        },
        hoverFile: function (filePath) {
            this.focus = filePath;
        }
    }
}
</script>
