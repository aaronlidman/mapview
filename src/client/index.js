'use strict';

var Vue = require('vue');
var Router = require('vue-router');
var log = require('electron-log');
var request = require('request');

var picker = require('../components/picker.vue');

Vue.use(Router);

var router = new Router({
    mode: 'history',
    routes: [
        {path: '/', component: picker}
    ]
});

var app = new Vue({
    router: router
}).$mount('#app');
