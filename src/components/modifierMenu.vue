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
            <div class='mb1'>Filter:</div>
            <form>
                <input type='checkbox' name='inspect' value='inspect' id='inspect' v-model='showAttributes' @change='$emit("update:inspect", $event.target.checked)'><label for='inspect'> show attributes</label>
            </form>
        </li>
        <li>
            <div class='mb1'>Show:</div>
            <form>
                <input type='radio' id='all' value='all' v-model='filtered' @change='$emit("update:filter", $event.target.value)'>
                <label for='all'> all</label><br>
                <input type='radio' id='points' value='points' v-model='filtered' @change='$emit("update:filter", $event.target.value)'>
                <label for='points'> only points</label><br>
                <input type='radio' id='lines' value='lines' v-model='filtered' @change='$emit("update:filter", $event.target.value)'>
                <label for='lines'> only lines</label><br>
                <input type='radio' id='polygons' value='polygons' v-model='filtered' @change='$emit("update:filter", $event.target.value)'>
                <label for='polygons'> only polygons</label><br>
            </form>
        </li>
    </div>
</div>
</template>

<script>
module.exports = {
    props: ['filter', 'inspect'],
    data: function() {
        return {
            filtered: 'all',
            showAttributes: false,
            show: false
        }
    }
}
</script>

<style>
    .mb45 {
        margin-bottom: 2.5rem;
    }
</style>
