#!/usr/bin/env node
'use strict';
var server = require('./server');
var electron = require('electron');
var log = require('electron-log');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var Menu = electron.Menu;
var menus = require('./src/app/menus');

var mainWindow;

function createWindow() {
    var screenSize = electron.screen.getPrimaryDisplay().workAreaSize;
    var width = Math.round(screenSize.width * 0.618);
    var height = Math.round(screenSize.height * 0.618);

    mainWindow = new BrowserWindow({
        titleBarStyle: 'hidden-inset',
        show: false,
        backgroundColor: '#fff',
        width: width,
        height: height,
        webPreferences: {
            nodeIntegration: false
        }
    });

    mainWindow.loadURL('http://localhost:20009');

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
        Menu.setApplicationMenu(menus(mainWindow));
    });
}

app.on('ready', function () {
    server(function (err) {
        if (err) return log.error(err);
        createWindow();
        log.info('Serving on http://localhost:20009');
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
