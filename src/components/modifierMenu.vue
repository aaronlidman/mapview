<template>
<div>
    <div id='modifiersButton' class='z-max fixed bottom-0 right-0'>
        <span v-show='!show' @click='show = true' class='fa fa-cog white-70 hover-white fa-2x pointer pa2 pt1 pb1'></span>
        <span v-show='show' @click='show = false' class='bg-white fa fa-close pointer fa-2x pa2 pt1 pb1'></span>
    </div>
    <div id='modifierMenu' v-show='show' class='z-9999 fixed bg-white bottom-0 right-0 pa3 mb45'>
        <!--
            - todo: select specific color pallettes
            - todo: change background/foreground color
        -->
        <li class='mb3'>
            <div class='mb1'>Basemap:</div>
            <form>
                <div v-for='map in basemaps' :key='map'>
                    <input  v-bind:id='map' v-bind:name='map' v-bind:value='map' type='radio' v-model='selectedBasemap'>
                    <label v-bind:for='map' class='ml1'> {{ map }}</label>
                </div>
            </form>
        </li>
        <li>
            <div class='mb1'>Show:</div>
            <form>
                <input type='radio' id='none' value='none' v-model='filtered' @change='$emit("update:filter", $event.target.value)'>
                <label class='ml1' for='none'> all</label><br>
                <input type='radio' id='points' value='points' v-model='filtered' @change='$emit("update:filter", $event.target.value)'>
                <label class='ml1' for='points'> only points</label><br>
                <input type='radio' id='lines' value='lines' v-model='filtered' @change='$emit("update:filter", $event.target.value)'>
                <label class='ml1' for='lines'> only lines</label><br>
                <input type='radio' id='polygons' value='polygons' v-model='filtered' @change='$emit("update:filter", $event.target.value)'>
                <label class='ml1' for='polygons'> only polygons</label><br>
            </form>
        </li>
    </div>
</div>
</template>

<script>
module.exports = {
    props: ['filter'],
    data: function() {
        return {
            filtered: 'none',
            show: false,
            basemaps: [
                'no basemap',
                'light',
                'dark',
                'satellite',
                'streets'
            ],
            selectedBasemap: 'no basemap'
        }
    }
}
</script>

<style>
    .mb45 {
        margin-bottom: 2.5rem;
    }
</style>
