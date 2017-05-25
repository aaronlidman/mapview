#!/usr/bin/env node
'use strict';

var fs = require('fs');
var utils = require('./utils');
var mapview = require('./server');
var argv = require('minimist')(process.argv.slice(2));

var electron = require('electron');
var log = require('electron-log');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;

var mbtiles = argv._;

if (argv.version || argv.v) {
    return log.info(utils.version());
} else if (!mbtiles.length) {
    return log.info(utils.usage());
}

try {
    mbtiles.forEach(function (f) {
        fs.statSync(f).isFile();
    });
} catch (e) {
    return log.error(e);
}

var params = {
    mbtiles: mbtiles,
    port: argv.port || 20009
};

var mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        titleBarStyle: 'hidden',
        show: false,
        backgroundColor: '#000',
        width: 1024,
        height: 640
    });

    mainWindow.loadURL('http://localhost:' + params.port + '/');

    // on window close throw everything away
    mainWindow.on('closed', function () {
        mainWindow = null;
    });

    mainWindow.once('ready-to-show', mainWindow.show);
}

app.on('ready', function () {
    mapview.serve(params, function (err, config) {
        if (err) return log.error(err);
        createWindow();
        log.info('Serving on http://localhost:' + config.port);
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});
