<template>
<div>
    <div class='bg-white-50 fixed w-50 vh-100 dt drag'>
        <div class='dtc v-mid bg-yellow'>
            <h1 class='mb5 white f1 ttu tc'>Pick</h1>
        </div>
    </div>
    <div id='file-list' class='pa4 w-50 fr bg-near-white drag' v-show='!loading'>
        <div class='dt vh-100 center'>
            <div class='dtc v-mid'>
                <table class='collapse'>
                    <tr v-for='file in files' :key='file.path' @click.once='selectFile(file.path)' class='w-100 pointer hover-bg-white'>
                        <td class='pl3'>
                            <span class='fa fa-photo black-70 fa-fw'></span>
                        </td>
                        <td class='pa3'>
                            <div>
                                <span class='filename black'>{{ file.basename }}</span> <span class='black-40 breaky'>in {{ file.dir }}</span>
                            </div>
                            <div>
                                <span class='black-40'>{{ file.size }}, {{ file.modified }}</span>
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

.f1 {
    font-size: 6rem;
}

.bg-lime {
    background-color: hsla(90, 70%, 55%, 1);
}

.hover-bg-light-yellow:hover {
    background-color: #ffb;
}
</style>

<script>
var request = require('request');

module.exports = {
    data: function () {
        return {
            loading: false,
            files: null,
            error: null
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
            that.error = that.files = null;
            that.loading = true;

            request('http://localhost:20009/mbtiles/', function(err, resp, body) {
                that.loading = false;
                that.files = JSON.parse(body);
            });
        },
        selectFile: function(filePath) {
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
