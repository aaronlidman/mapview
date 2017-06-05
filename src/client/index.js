'use strict';

var Vue = require('vue');
var Router = require('vue-router');
var log = require('electron-log');

var dragbar = require('../components/dragbar.vue');
var picker = require('../components/picker.vue');
var map = require('../components/map.vue');

Vue.component('dragbar', dragbar);

Vue.use(Router);

var router = new Router({
    mode: 'history',
    routes: [
        {path: '/', component: picker},
        {path: '/map', component: map}
    ]
});

var app = new Vue({
    router: router,
    data: {
        electronWindow: window.navigator.userAgent.indexOf('mapview') > -1
    }
}).$mount('#app');
