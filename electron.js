'use strict';

const {app, BrowserWindow} = require('electron');
const Spawn = require('child_process').spawn;

process.env.MOPIDY_HOST='localhost';
process.env.WATSON_USERNAME='';
process.env.WATSON_PASSWORD='';

const mopidy = Spawn(__dirname + '/appendages/mopidy/mopidy', ['--config', './appendages/mopidy/mopidy.conf']);
mopidy.stdout.on('data', data => {

    console.log(`mopidy_stdout: ${data}`);
});
mopidy.stderr.on('data', data => {

    console.log(`mopidy_stderr: ${data}`);
});

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

    setTimeout(() => {

        mainWindow = new BrowserWindow({
            height: 600,
            width: 800
        });

        require('./server');
        mainWindow.loadURL('http://localhost:8081/config');
    }, 5000);

    // embeded appendages
    require('./appendages/listener/service');
});
