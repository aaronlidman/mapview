'use strict';

var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;

var mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        titleBarStyle: 'hidden'
    });

    mainWindow.loadURL('http://localhost:3000/');
    mainWindow.webContents.openDevTools();

    // on window close throw everything away
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

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
