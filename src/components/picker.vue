<template>
<div>
    <div class='bg-white-50 fixed w-50 vh-100 dt drag'>
        <div class='dtc v-mid bg-new-red'>
            <h1 class='avenir mb5 white f1 ttu tc'>Pick</h1>
        </div>
    </div>
    <div id='file-list' class='pa3 w-50 fr bg-white drag' v-show='!loading'>
        <div class='dt vh-100 center'>
            <div class='dtc v-mid'>
                <table class='collapse'>
                    <!-- todo: add sortable headers eventually -->
                    <tr v-for='file in files' :key='file.path' @click.once='selectFile(file.path)' class='w-100 pointer hover-bg-near-white ba1 b--black-025 bb black'>
                        <td class='pl3 pr3 black-40'>
                            <span v-if="file.format == 'jpg'" class='fa fa-th fa-fw fa-lr'></span>
                            <span v-if="file.format == 'jpeg'" class='fa fa-th fa-fw fa-lr'></span>
                            <span v-if="file.format == 'png'" class='fa fa-th fa-fw fa-lr'></span>
                            <span v-if="file.format == 'pbf'" class='fa fa-map-o fa-fw fa-lr'></span>
                        </td>
                        <td class='pr1 pv3'>
                            <div><span class='filename'>{{ file.basename }}</span></div>
                            <div><span class='black-40'> in {{ file.dir }}</span></div>
                        </td>
                        <td class='dtc show-narrow black-40 tr pa1 pv3 v-mid'><span>{{ file.date }}</span></td>
                        <td class='dtc hide-narrow black-40 tr pa1 pv3 v-mid'><span>{{ file.modified }}</span></td>
                        <td class='tr pa1 pv3 v-mid pr3 black-40'><span>{{ file.size }}</span></td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</div>
</template>

<style src='../../node_modules/font-awesome/css/font-awesome.min.css'></style>
<style>
.breaky {
    word-wrap: break-word;
    overflow-wrap: break-word;
    word-break: break-word;
}

.filename {
    font-size: 1.25em;
    font-weight: 500;
}

.f1 { font-size: 6rem; }
.bg-lime { background-color: hsla(90, 70%, 55%, 1); }
.bg-new-red { background-color: #D3312B;}
.bg-new-yellow { background-color: hsla(45, 87%, 60%, 1); }
.bg-newer-yellow { background-color: #FCE933; }
.show-narrow { display: none; }
.hide-narrow { display: table-cell; }

@media (max-width: 1100px) {
    .filename {
        font-size: 1em;
        font-weight: 500;
    }

    .pa3 { padding: .5rem; }
    .pl3 { padding-left: .5rem; }
    .pr3 { padding-right: .5rem; }
    .pv3 {
        padding-top: .5rem;
        padding-bottom: .5rem;
    }

    .show-narrow { display: table-cell; }
    .hide-narrow { display: none; }
}
</style>

<script>
var distanceInWordsToNow = require('date-fns/distance_in_words_to_now');

module.exports = {
    data: function () {
        return {
            loading: true,
            loaded: false,
            files: [],
            error: null,
            socket: null
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
            var socket = require('socket.io-client')('http://localhost:20009/picker');
            var that = this;
            var uniqueFiles = new Set();

            socket.on('connect', function () {
                that.socket = socket;
            });

            socket.on('files', function (foundFiles) {
                that.loading = false;

                foundFiles = foundFiles.filter(function(file) { return file.format; });
                that.files = foundFiles;
                uniqueFiles = new Set(foundFiles.map(JSON.stringify));

                // because Vue doesn't know Sets yet
                // I know, not ideal
                foundFiles
                    .filter(function(file) {
                        return file.format;
                    })
                    .map(JSON.stringify)
                    .map(function(file) {
                        uniqueFiles.add(file);
                    });

                that.files = Array.from(uniqueFiles)
                    .map(JSON.parse)
                    .sort(function (a, b) {
                        return +new Date(b.modified) - +new Date(a.modified);
                    }).map(function (file) {
                        file.date = new Date(file.modified).toLocaleDateString('en-US');
                        if (file.date.split('/')[2] === new Date().getFullYear().toString()) {
                            // shorten the date even more
                            file.date = file.date.split('/').slice(0,2).join('/');
                        }
                        file.modified = distanceInWordsToNow(file.modified, {
                            includeSeconds: true
                        }) + ' ago';
                        return file;
                    });
            });

            socket.on('done', function () {
                // todo: hide spinner completely
                this.loaded = true;
                // todo: cache the file list and prepopulate with it on next load
                    // to avoid the incrimental loading jitteryness and overall just be quicker
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
