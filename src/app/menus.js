var electron = require('electron');
var app = electron.app;
var Menu = electron.Menu;

module.exports = function (mainWindow) {
    var template = [{
        label: 'View',
        submenu: [
            {role: 'reload'},
            {role: 'forcereload'},
            {role: 'toggledevtools'},
            {type: 'separator'},
            {role: 'resetzoom'},
            {role: 'zoomin'},
            {role: 'zoomout'},
            {type: 'separator'},
            {role: 'togglefullscreen'}
        ]
    }, {
        role: 'window',
        submenu: [
            {role: 'minimize'},
            {role: 'close'}
        ]
    }, {
        role: 'help',
        submenu: [{
            label: 'Learn More',
            click() {
                electron.shell.openExternal('https://github.com/aaronlidman/mapview');
            }
        }]
    }];

    if (process.platform === 'darwin') {
        template.unshift({
            label: app.getName(),
            submenu: [
                {role: 'about'},
                {type: 'separator'},
                {
                    label: 'Preferences',
                    click() {
                        mainWindow.loadURL('http://localhost:20009/#/settings');
                    }
                },
                {type: 'separator'},
                {role: 'hide'},
                {role: 'hideothers'},
                {role: 'unhide'},
                {type: 'separator'},
                {role: 'quit'}
            ]
        });

        // Window menu
        template[2].submenu = [
            {role: 'close'},
            {role: 'minimize'},
            {role: 'zoom'},
            {type: 'separator'},
            {role: 'front'}
        ];
    }

    return Menu.buildFromTemplate(template);
};