'use strict';

var Vue = require('vue');
var Router = require('vue-router');
var log = require('electron-log');

var picker = require('../components/picker.vue');
var map = require('../components/map.vue');

Vue.use(Router);

var router = new Router({
    routes: [
        {path: '/', component: picker},
        {path: '/map', component: map}
    ]
});

var app = new Vue({
    router: router
}).$mount('#app');
