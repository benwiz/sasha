'use strict';

// set environment variables
const Private = require('./private');
process.env.MOPIDY_HOST = '0.0.0.0';
process.env.WATSON_USERNAME = Private.watson_username;
process.env.WATSON_PASSWORD = Private.watson_password;

// external libraries
const Promise = require('bluebird');
const {app, BrowserWindow} = require('electron');
const Exec = require('child_process').exec;
// local libraries
const Server = require('./server');

//
// mopidy
//
// start mopidy
let processes = [];
const mopidy = Exec(__dirname + '/appendages/mopidy/mopidy', ['--config', './appendages/mopidy/mopidy.conf']);
processes.push(mopidy);

// mopidy event handlers
mopidy.on('exit', () => {

    processes.splice(processes.indexOf(newProcess), 1);
});
mopidy.stdout.on('data', data => {

    console.log(`mopidy_stdout: ${data}`);
});
mopidy.stderr.on('data', data => {

    console.log(`mopidy_stderr: ${data}`);
});

//
// electron
//
let mainWindow;

// App close handler
app.on('before-quit', () => {

    processes.forEach((proc) => {

        console.log('kill', proc);
        proc.kill();
    });
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd+Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('ready', () => {

    mainWindow = new BrowserWindow({
        height: 600,
        width: 800
    });
    // mainWindow.openDevTools();

    Server.start().then(() => {

        mainWindow.loadURL('http://localhost:8081/');
    });

    // embeded appendages
    require('./appendages/listener/service');
});
