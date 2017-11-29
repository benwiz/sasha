const Promise = require('bluebird');
const Request = require('request');
const AWS = require('aws-sdk');

const rekognition = new AWS.Rekognition();

const indexFaces = records => Promise.map(records, record => new Promise((resolve, reject) => {
  const params = {
    CollectionId: 'faces',
    DetectionAttributes: [
    ],
    Image: {
      S3Object: {
        Bucket: 'sasha-faces',
        Name: record.s3.object.key,
      },
    },
  };
  rekognition.indexFaces(params, (err, data) => {
    if (err) {
      reject(err);
    } else {
      resolve(data);
    }
  });
}));

exports.handle = (event, context, callback) => {
  console.log('EVENT:', JSON.stringify(event));

  indexFaces(event.Records)
    .then((res) => {
      console.log('Result:', res);
      callback(null, res);
    })
    .catch((err) => {
      console.log('Error:', err);
      callback(null, err);
    });
};
