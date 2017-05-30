'use strict';

var Vue = require('vue');
var log = require('electron-log');
var request = require('request');

var picker = require('../components/picker.vue');

// need to make a request for the files
request('http://localhost:20009/mbtiles/', function (err, resp, body) {
    if (err) return log(err);

    new Vue({
        el: '#app',
        data: {
            electron: window.navigator.userAgent.indexOf('mapview') > -1,
            files: JSON.parse(body)
        },
        render: function (createElement) {
            return createElement(picker);
        }
    });
});
