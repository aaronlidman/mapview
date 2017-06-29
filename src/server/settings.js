'use strict';

var Store = require('electron-store');
var store = new Store();

module.exports = {
    get: function (socket) {
        socket.emit('got', store.get('settings', {
            accessToken: '',
            defaultPath: '~/'
        }));
    },
    set: function (obj) {
        store.set('settings', obj);
    }
};
