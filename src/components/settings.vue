<template>
<div class='bg-cool-gray'>
    <table id='navigation' class='collapse left-0 z-max bg-white fixed top-3 bold black'>
        <tr>
            <td id='back-button' class='pa2 hover-bg-black-50 pointer' @click.once='backToPicker'>◀</td>
            <td class='ttu pa2 pr3 ma0 drag'>
                <h1 id='title' class='avenir ma0'>Settings</h1>
            </td>
        </tr>
    </table>
    <div class='dt vh-100 center w-100'>
        <div class='dtc v-mid'>
            <div class='w-30 fl'><br/></div>
            <div id='accessToken' class='w-40 pa3 fl'>
                <div class='bg-white pa3'>
                    <h2 class='mt0'>Mapbox access token</h2>
                    <p>Used for displaying street and satellite basemaps.</p>
                    <input type='text' v-model='accessToken' class='w-100 pa2 code f6'>
                </div>
            </div>
<!--             <div id='defaultpath' class='w-20 pa3 fl'>
                <div class='bg-white pa3 h5'>
                    <h2 class='mt0'>Default file path</h2>
                    <p>The location to search for available files. By default, your user directory `~/`.</p>
                    <input type='text' v-model='defaultPath'>
                </div>
            </div> -->
            <!--
                todo: add a setting for excluding node_modules and other common paths, just a checkbox
            -->
            <div class='w-30 fl'><br/></div>
        </div>
    </div>
</div>
</template>

<style>
.top-3 {
    top: 3rem;
}
</style>

<script>
module.exports = {
    data: function () {
        return {
            accessToken: '',
            defaultPath: '',
            socket: null
        };
    },
    watch: {
        'accessToken': 'change',
        'defaultPath': 'change'
    },
    mounted: function () {
        var socket = require('socket.io-client')('http://localhost:20009/settings');
        var that = this;

        socket.on('connect', function () {
            that.$data.socket = socket;
        });

        socket.on('got', function (settings) {
            // full list files
            console.log(settings)
            that.$data.accessToken = settings.accessToken;
            that.$data.defaultPath = settings.defaultPath;
        });
    },
    methods: {
        backToPicker: function(event) {
            if (this.$data.socket) this.$data.socket.close();
            this.$router.push('/');
        },
        change: function (value) {
            this.$data.socket.emit('set', {
                accessToken: this.$data.accessToken,
                defaultPath: this.$data.defaultPath
            });
        }
    }
}
</script>
