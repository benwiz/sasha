const Promise = require('bluebird');
const Request = require('request');
const AWS = require('aws-sdk');

exports.handle = (event, context, callback) => {
  console.log('EVENT:', event);

  const rek = new AWS.Rekognition();
  console.log('rek:', rek);

  const reply = { message: 'LOL.' };
  return callback(null, reply);
};
