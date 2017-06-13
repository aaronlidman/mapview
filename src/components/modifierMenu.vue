<template>
<div id='modifierMenu' v-if='show' class='z-9999 fixed bg-white bottom-0 right-0 pa3 mb45'>
    <!--
        - todo: persist state on menu close and repopen
        - todo: fix filter labels
        - todo: select specific color pallettes
        - todo: change background/foreground color
    -->
    <li class='mb3'>
        <div class='mb1'>Filter:</div>
        <form>
            <input type='checkbox' name='inspect' value='inspect' id='inspect'><label for='inspect'> show attributes</label>
        </form>
    </li>
    <li>
        <div class='mb1'>Show:</div>
        <form>
            <input type='radio' name='chooseone' value='all'><label for='all'> all</label><br>
            <input type='radio' name='chooseone' value='points'><label for='points'> only points</label><br>
            <input type='radio' name='chooseone' value='lines'><label for='lines'> only lines</label><br>
            <input type='radio' name='chooseone' value='polygons'><label for='polygons'> only polygons</label><br>
        </form>
    </li>
    <li></li>
</div>
</template>

<script>
module.exports = {
    props: ['show'],
    data: function() {
        return {}
    }
}
</script>

<style>
    .mb45 {
        margin-bottom: 2.5rem;
    }
</style>
