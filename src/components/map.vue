<template>
<div>
    <h1>Yo</h1>
    <div id='map' class='w-100 vh-100'></div>
</div>
</template>

<script>
var mapboxgl = require('mapbox-gl');
mapboxgl.accessToken = '';

module.exports = {
    mounted: function() {
        new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v9',
            maxZoom: 30
        });
    }
};

</script>

<style src='../../node_modules/mapbox-gl/dist/mapbox-gl.css'></style>
