'use strict'

// external libs
const RecordA = require('node-record-lpcm16');
const RecordB = require('node-record-lpcm16');
const {Detector, Models} = require('snowboy');
const Request = require('request');
const Fs = require('fs');
const Play = require('play');
const Chalk = require('chalk');
// internal libs
const Config = require('./config');


const ding = () => {

    Play.sound(__dirname + '/resources/ding.wav');
};

const dong = () => {

    Play.sound(__dirname + '/resources/dong.wav');
};

// create models object
const models = new Models();

// my sasha model
models.add({
    file: __dirname + '/resources/sasha-benwiz.pmdl',
    sensitivity: 0.5,
    hotwords: 'benwiz'
});

// // marg's sasha model
// models.add({
//     file: __dirname + '/resources/sasha-marg.pmdl',
//     sensitivity: 0.5,
//     hotwords: 'marg'
// });

// snowboy universal model as backup
models.add({
    file: __dirname + '/resources/snowboy.umdl',
    sensitivity: 0.5,
    hotwords: 'snowboy'
});

const detector = new Detector({
    models: models,
    resource: __dirname + '/resources/common.res',
    audioGain: 2.0,
    language: 'en-US'
});

let is_recording = false;
let started_recording = null;
let last_recorded_sound = null;

detector.on('silence', () => {

    process.stdout.write(Chalk.blue('silence\r'));
    if (is_recording) {
        const curr_time = new Date().getTime() / 1000;
        // if recording has been at least 10 seconds, allow to pass through all if statements
        if (curr_time - started_recording > 3 || curr_time - started_recording > 10) { // allow a 3 second pause in the beginning
            if (curr_time - last_recorded_sound > 1.5 || curr_time - started_recording > 10) { // 1.5 second pause at end
                RecordB.stop();
                is_recording = false;
                console.log('finished recording');
            }
        }
    }
});

detector.on('sound', () => {

    process.stdout.write(Chalk.red('sound\r'));
    if (is_recording) {
        last_recorded_sound = new Date().getTime() / 1000;
    }
});

detector.on('hotword', (index, hotword) => {

    // NOTE: different hotwords can be handled
    // TODO: pause or decrease volumn of music

    console.log('\n!');
    // reduce volume
    Request.post({
        url: `http://${Config.sasha_host}:8081/text`,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({text:'set the volume to 20'})
    },
    (err, response, body) => {

        console.log('reduce:', err, body);
        if (err) console.log(err);
    });

    ding();
    is_recording = true;
    started_recording = new Date().getTime() / 1000;
    RecordB.start({
        sampleRate: 16000,
        threshold: 0,
        device: null,
        recordProgram: 'rec',
        verbose: false
    }).pipe(Request.post({
        url: `http://${Config.sasha_host}:8081/audio`,
        headers: {
            'Content-Type': 'application/octet-stream'
        }
    }, (err, response, body) => {

        if (err) console.log(err);
        console.log('post complete');
        dong();

        // increase volume
        Request.post({
            url: `http://${Config.sasha_host}:8081/text`,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({text:'set the volume to 90'})
        },
        (err, response, body) => {

            console.log('increase:', err, body);
            if (err) console.log(err);
        });
    }));
});

RecordA.start({
    sampleRate: 16000,
    threshold: 0,
    device: null,
    recordProgram: 'rec',
    verbose: false
}).pipe(detector);
