'use strict';

const {app, BrowserWindow} = require('electron');

let mainWindow;

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd+Q
    if (process.platform !== 'darwin') {
        App.quit();
    }
});

app.on('ready', () => {

    mainWindow = new BrowserWindow({
        height: 600,
        width: 800
    });

    mainWindow.loadURL('http://localhost:8081/config');
    require('./server');
});
