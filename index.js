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
    var screenSize = electron.screen.getPrimaryDisplay().workAreaSize;
    var width = Math.round(screenSize.width * 0.75);
    var height = Math.round(screenSize.height * 0.75);

    mainWindow = new BrowserWindow({
        titleBarStyle: 'hidden',
        show: false,
        backgroundColor: '#000',
        width: width,
        height: height
    });

    mainWindow.loadURL('http://localhost:' + config.port);

    // on window close throw everything away
    mainWindow.on('closed', function () {
        mainWindow = null;
    });

    mainWindow.once('ready-to-show', function () {
        if (process.env.NODE_ENV && process.env.NODE_ENV === 'dev') {
            mainWindow.webContents.openDevTools();
        } else {
            mainWindow.show();
        }
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

    if (process.env.NODE_ENV && process.env.NODE_ENV === 'dev') {
        mainWindow.show();
    }
});
