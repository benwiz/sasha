const Promise = require('bluebird');
const Request = require('request');
const AWS = require('aws-sdk');

const rekognition = new AWS.Rekognition();

const indexFaces = () => new Promise((resolve, reject) => {
  const params = {
    CollectionId: 'faces',
    DetectionAttributes: [
    ],
    Image: {
      S3Object: {
        Bucket: 'sasha-faces',
        Name: 'ben.jpg',
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
});

exports.handle = (event, context, callback) => {
  console.log('EVENT:', event);

  indexFaces()
    .then((res) => {
      console.log('Result:', res);
      callback(null, res);
    })
    .catch((err) => {
      console.log('Error:', err);
      callback(null, err);
    });
};
