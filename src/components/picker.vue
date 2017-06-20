<template>
<div>
    <div class='bg-white-50 fixed w-50 vh-100 dt drag'>
        <div class='dtc v-mid bg-new-yellow'>
            <h1 class='mb5 white f1 ttu tc'>Pick</h1>
        </div>
    </div>
    <div id='file-list' class='pa4 w-50 fr bg-white drag' v-show='!loading'>
        <div class='dt vh-100 center'>
            <div class='dtc v-mid'>
                <table class='collapse'>
                    <tr v-for='file in files' :key='file.path' @click.once='selectFile(file.path)' class='w-100 pointer hover-bg-near-white'>
                        <td class='pl3'>
                            <span class='fa fa-photo black-70 fa-fw fa-lg'></span>
                        </td>
                        <td class='pa3'>
                            <div>
                                <span class='black filename'>{{ file.basename }} </span><span class='black-40 breaky'>in {{ file.dir }}</span>
                            </div>
                            <div class='black-40'>
                                <span>{{ file.modified }} ago</span> &#8226; <span>{{ file.size }}</span>
                            </div>
                        </td>
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
}

.f1 {
    font-size: 6rem;
}

.bg-lime {
    background-color: hsla(90, 70%, 55%, 1);
}

.bg-new-red {
    background-color: #C94336;
}

.bg-new-yellow {
    background-color: hsla(45, 87%, 60%, 1);
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
                if (!that.files.length) {
                    that.files = foundFiles;
                    uniqueFiles = new Set(foundFiles.map(JSON.stringify));
                } else {
                    // because Vue doesn't know Sets yet
                    // I know, not ideal
                    foundFiles
                        .map(JSON.stringify)
                        .map(function(file) {
                            uniqueFiles.add(file);
                        });

                    that.files = Array.from(uniqueFiles)
                        .map(JSON.parse)
                        .sort(function (a, b) {
                            return +new Date(b.modified) - +new Date(a.modified);
                        }).map(function (file) {
                            file.modified = distanceInWordsToNow(file.modified, {
                                includeSeconds: true
                            });
                            return file;
                        });
                }
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
