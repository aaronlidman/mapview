<template>
<div>
    <div id='modifiersButton' class='z-max fixed bottom-0 right-0'>
        <span v-show='!show' @click='show = true' class='fa fa-cog white-80 hover-white fa-2x pointer pa2 pt1 pb1'></span>
        <span v-show='show' @click='show = false' class='bg-white fa fa-close pointer fa-2x pa2 pt1 pb1'></span>
    </div>
    <div id='modifierMenu' v-show='show' class='z-9999 fixed bg-white bottom-0 right-0 pa3'>
        <!--
            - todo: select specific color pallettes
            - todo: change background/foreground color
        -->
        <li class='mb3'>
            <div class='mb1'>Basemap:</div>
            <form>
                <div v-for='map in basemaps' :key='map'>
                    <input v-bind:id='map.id' v-bind:value='map.id' type='radio' v-model='selectedBasemap' @change='$emit("update:basemap", $event.target.value)'>
                    <label v-bind:for='map.id' class='ml1'> {{ map.text }}</label>
                </div>
            </form>
        </li>
        <li>
            <div class='mb1'>Show:</div>
            <form>
                <div v-for='filter in filterChoices'>
                    <input type='radio' v-bind:id='filter.id' v-bind:value='filter.id' v-model='filtered' @change='$emit("update:filter", $event.target.value)'>
                    <label class='ml1' v-bind:for='filter.id'>{{ filter.text }}</label>
                </div>
            </form>
        </li>
    </div>
</div>
</template>

<script>
module.exports = {
    props: ['filter', 'basemap'],
    data: function() {
        return {
            filterChoices: [
                {id: 'none', text: 'all'},
                {id: 'points', text: 'points'},
                {id: 'lines', text: 'lines'},
                {id: 'polygons', text: 'polygons'}
            ],
            filtered: 'none',
            show: false,
            basemaps: [
                {id: 'no_basemap', text: 'none'},
                {id: 'light', text: 'light'},
                {id: 'dark', text: 'dark'},
                {id: 'satellite', text: 'satellite'},
                {id: 'streets', text: 'streets'}
            ],
            selectedBasemap: 'no_basemap'
        }
    }
}
</script>

<style>
    #modifierMenu {
        margin-bottom: 32px;
        line-height: 1.5rem;
    }
</style>
