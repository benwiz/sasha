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
    MaxFaces: 1,
  };
  rekognition.searchFacesByImage(params, (err, data) => {
    if (err) {
      reject(err);
    } else {
      // TODO: Parse `record.s3.object.key` to get location (folder)
      resolve(data);
    }
  });
}));

exports.handle = (event, context, callback) => {
  console.log('EVENT:', JSON.stringify(event));

  searchFacesByImage(event.Records)
    .then((res) => {
      console.log('Result:', JSON.stringify(res));

      // Extract person's name from response
      if (res.FaceMatches.length == 0) {
        return callback(null, 'uh oh, no faces');
      }
      const person = res.FaceMatches[0].Face.ExternalImageId;

      // TODO: Update person record with the location of this image. The location will
      // need to be stored in the file key.
      // TODO: Delete the processed image from S3.
      callback(null, res);
    })
    .catch((err) => {
      console.log('Error:', JSON.stringify(err));
      callback(null, err);
    });
};
