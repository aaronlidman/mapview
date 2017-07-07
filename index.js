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
    var ratio = 0.58;
    var width = 1100;
    var height = Math.round(width * ratio);

    mainWindow = new BrowserWindow({
        titleBarStyle: 'hidden',
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
