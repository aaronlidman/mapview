#!/usr/bin/env node
'use strict';
var electron = require('electron');
var log = require('electron-log');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var Menu = electron.Menu;

var server = require('./server');
var menus = require('./src/app/menus');

if (process.env.NODE_ENV === 'dev') {
    log.transports.file.level = 'debug';
} else {
    log.transports.file.level = 'info';
}

var mainWindow;
var openFile;

function createWindow() {
    var ratio = 0.58;
    var width = 1100;
    var height = Math.round(width * ratio);

    mainWindow = new BrowserWindow({
        titleBarStyle: 'hidden-inset',
        show: false,
        backgroundColor: 'hsla(210, 5%, 15%, 1)',
        width: width,
        height: height,
        minWidth: 720,
        minHeight: 420,
        devTools: (process.env.NODE_ENV === 'development'),
        webPreferences: {
            nodeIntegration: false
        }
    });

    // such a quick good bad idea
    var url = openFile ? createFileUrl(openFile) : 'http://localhost:20009';
    mainWindow.loadURL(url);

    // on window close throw everything away
    mainWindow.on('closed', function () {
        mainWindow = null;
    });

    mainWindow.once('ready-to-show', function () {
        if (process.env.NODE_ENV === 'development') {
            mainWindow.webContents.openDevTools();
        }
        mainWindow.show();
        Menu.setApplicationMenu(menus(mainWindow));
    });
}

function createFileUrl(filePath) {
    return 'http://localhost:20009/#/map?file=' + encodeURIComponent(filePath);
}

app.on('ready', function () {
    server(function (err) {
        if (err) return log.error(err);
        createWindow();
        log.info('Serving on http://localhost:20009');
    });
});

app.on('will-finish-launching', function () {
    app.on('open-file', function (e, filePath) {
        e.preventDefault();
        log.info('got an open-file event ' + filePath);
        if (mainWindow) mainWindow.loadURL(createFileUrl(openFile));
        openFile = filePath;
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
    if (mainWindow === null) createWindow();

    if (process.env.NODE_ENV && process.env.NODE_ENV === 'development') {
        mainWindow.show();
    }
});
