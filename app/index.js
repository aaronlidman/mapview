#!/usr/bin/env node
'use strict';

var server = require('./server');
var argv = require('minimist')(process.argv.slice(2));

var electron = require('electron');
var log = require('electron-log');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;

var config = {
    port: argv.port || 20009
};

var mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        titleBarStyle: 'hidden',
        show: false,
        backgroundColor: '#000',
        width: 1024,
        height: 640,
        x: 0,
        y: 0
    });

    mainWindow.loadURL('http://localhost:' + config.port + '/index.html');

    // on window close throw everything away
    mainWindow.on('closed', function () {
        mainWindow = null;
    });

    mainWindow.once('ready-to-show', function () {
        mainWindow.maximize();
        mainWindow.show();
    });
}

app.on('ready', function () {
    server(config, function (err, config) {
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
