<template>
<!--
    todo: break out different rendering for different platforms
    right now it's just binary macOS or web
 -->
<div id='dragbar' class='w-100 fixed'></div>
</template>

<style>
#dragbar {
    -webkit-app-region: drag;
    height: 23px;
    background-color: hsla(0,0%,0%,0.05);
    z-index: 999;
}
</style>
