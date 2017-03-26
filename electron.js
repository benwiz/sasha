'use strict';

// external libraries
const FixPath = require('fix-path')();
const Promise = require('bluebird');
const Electron = require('electron');
const Exec = require('child_process').exec;
const _ = require('lodash');
const Fs = require('fs');
// local
const Private = require('./private');

const app = Electron.app;
const BrowserWindow = Electron.BrowserWindow;
const ipcMain = Electron.ipcMain;

// set environment configuration env vars
process.env.MOPIDY_HOST = '0.0.0.0';
process.env.SASHA_HOST = 'localhost';

//
// electron
//
let mainWindow;

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
    if (data.includes('MPD server running')) {
        console.log('start!');

        const Server = require('./server');
        Server.start().then(() => {

            mainWindow.loadURL('http://localhost:8081/');

            // embeded appendages
            require('./appendages/listener/service');
        });
    }
});

//
// electron
//
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
        width: 800,
        preload: __dirname + '/prompt.js'
    });
    // mainWindow.openDevTools();

    // handle any string replacements for mopidy.conf
    const tags = [
        {tag: '[%SPOTIFY_USERNAME%]', value: Private.spotify_username},
        {tag: '[%SPOTIFY_PASSWORD%]', value: Private.spotify_password},
    ];
    replaceTags('./appendages/mopidy/mopidy.conf', tags);

    // set environment variables for server
    process.env.WATSON_USERNAME = Private.watson_username;
    process.env.WATSON_PASSWORD = Private.watson_password;
    process.env.LUIS_KEY = Private.luis_key;
});


const replaceTags = (filepath, tags) => {

    console.log('readWriteSync()\n');
    const data = Fs.readFileSync(filepath, 'utf-8');
    let new_value = data;
    tags.forEach((tag) => {

        new_value = new_value.replace(tag.tag, tag.value);
    });
    Fs.writeFileSync(filepath, new_value, 'utf-8');
};
