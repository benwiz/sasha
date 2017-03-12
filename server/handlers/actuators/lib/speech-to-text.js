'use strict';

// external libraries
const Promise = require('bluebird');
const SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
const Streamifier = require('streamifier');
// internal libraries
const Config = require('./config');

// TODO: look into session based websocket approach to watson speech api

const WatsonSTT = new SpeechToTextV1({
    username: Config.watson_username,
    password: Config.watson_password
});

const watson = (binary) => {

    return new Promise((resolve, reject) => {

        const params = {
            audio: Streamifier.createReadStream(binary),
            content_type: 'audio/l16; rate=16000',
            customization_id: '77148170-ece4-11e6-ba16-9d7ea578c8c5' // what is this?
        };

        WatsonSTT.recognize(params, (err, res) => {
            if (err) {
                reject(err)
            } else {
                console.log(JSON.stringify(res, null, 2));
                const result = res.results[res.result_index].alternatives[0].transcript;
                resolve(result);
            }
        });

        // the commented out code is to be able to diplay text as a stream
        // const chunks = [];
        // Streamifier.createReadStream(binary)
        //     .pipe(speech_to_text.createRecognizeStream(params))
        //     .on('data', (chunk) => {
        //
        //         console.log('chunk', chunk);
        //         chunks.push(chunk.toString());
        //     })
        //     .on('end', () => {
        //
        //         console.log('transcription:', chunks.join(''), '\n');
        //         const new_msg = {
        //             type: 'text',
        //             text: chunks.join('')
        //         };
        //
        //         console.log('new_msg:', new_msg);
        //         reply(new_msg);
        //     });
    });
};

module.exports = {
    watson: watson
};
