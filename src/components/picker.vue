<template>
<div>
    <div id='description' class='fixed left-0 w-auto vh-100 dt'>
        <div class='dtc v-btm'>
            <h1 class='mb5 white f1 ttu tc rotate-270'>Pick</h1>
        </div>
    </div>
    <div v-show='!loading' class='fr w-auto'>
        <div class='w-100 dt vh-100'>
            <div class='dtc v-mid'>
                <li v-for='file in files' class='w-100 pl4 pr4 pa2 hover-bg-light-gray pointer'>
                    <div class='title f4 black'>{{ file.file }}</div>
                    <div class='details muted'>{{ file.size }}, {{ file.modified }}</div>
                </li>
            </div>
        </div>
    </div>
</div>
</template>

<style>
#description {
        background-color: #FFD659;
}

.muted {
        color: hsla(0,0%,0%,0.33);
}

.f1 {
        font-size: 4rem;
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
        }
    }
}
</script>
