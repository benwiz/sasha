const Promise = require('bluebird');
const AWS = require('aws-sdk');

const rekognition = new AWS.Rekognition();

const searchFacesByImage = records => Promise.map(records, record => new Promise((resolve, reject) => {
  // TODO: Determine if this will work if `records.length > 1`
  const params = {
    CollectionId: 'faces',
    FaceMatchThreshold: 95,
    Image: {
      S3Object: {
        Bucket: record.s3.bucket.name,
        Name: record.s3.object.key,
      },
    },
    MaxFaces: 5,
  };
  rekognition.searchFacesByImage(params, (err, data) => {
    if (err) {
      reject(err);
    } else {
      resolve(data);
    }
  });
}));

exports.handle = (event, context, callback) => {
  console.log('EVENT:', JSON.stringify(event));

  searchFacesByImage(event.Records)
    .then((res) => {
      console.log('Result:', JSON.stringify(res));
      // TODO: Instead of callback, write the learned data somewhere.
      // TODO: Delete the processed image from S3.
      callback(null, res);
    })
    .catch((err) => {
      console.log('Error:', JSON.stringify(err));
      callback(null, err);
    });
};
