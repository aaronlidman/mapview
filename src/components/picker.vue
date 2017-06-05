<template>
<div>
    <div class='bg-lime fixed w-50 vh-100 dt'>
        <div class='dtc v-mid'>
            <h1 class='mb5 white f1 ttu tc'>Pick</h1>
        </div>
    </div>
    <div id='file-list' class='pl4 pr4 w-50 fr bg-white' v-show='!loading'>
        <div class='dt vh-100 center'>
            <div class='dtc v-mid'>
                <li v-for='file in files' :key='file.path' @click.once='selectFile(file.path, file.format)' class='w-100 pa3 hover-bg-near-white pointer'>
                    <div>{{ file.basename }} <span class='black-30 breaky'>in {{ file.dir }}</span></div>
                    <div class='black-30'>{{ file.size }}, {{ file.modified }}</div>
                </li>
            </div>
        </div>
    </div>
</div>
</template>

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
        selectFile: function(filePath, format) {
            this.$router.push({
                path: 'map',
                query: {
                    file: filePath,
                    format: format
                }
            });
        }
    }
}
</script>
