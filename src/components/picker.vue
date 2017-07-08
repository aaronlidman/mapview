<template>
<div>
    <div id='free-space' class='fl fixed bg-new-yellow w-100 vh-100 drag pa4 dt'>
        <div class='tc dtc v-mid'>
            <h1 class='tracked-tight avenir white f-headline ma0 ttu'>pick</h1>
        </div>
    </div>
    <div id='file-list' class='fr bg-near-white drag absolute right-0' v-show='!loading'>
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
    watch: {
        // call the method again if the route changes
        '$route': 'fetchData'
    },
    methods: {
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
