const Promise = require('bluebird');
const AWS = require('aws-sdk');
const Request = require('request');

const rekognition = new AWS.Rekognition();

const searchFacesByImage = records => Promise.map(records, record => new Promise((resolve, reject) => {
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
      resolve(data);
    }
  });
}));

// Update DynamoDB
const updateDynamoDB = payload => new Promise((resolve, reject) => {
  const data = JSON.stringify(payload);
  console.log('PAYLOAD:', payload);
  Request.post({
    headers: { 'content-type': 'application/json' },
    url: 'https://sasha.benwiz.io/dynamo/people',
    body: data,
  }, (error, response, body) => {
    if (error) {
      return reject(error);
    }
    console.log('updateDynamoDB() raw response:', body);
    const obj = JSON.parse(body);
    return resolve(obj);
  });
});

exports.handle = (event, context, callback) => {
  console.log('EVENT:', JSON.stringify(event));

  searchFacesByImage(event.Records)
    .then((res) => {
      console.log('searchFacesByImage.result:', JSON.stringify(res));
      res = res[0];

      // Extract person's name and location from response
      console.log('res.FaceMatches:', res.FaceMatches);
      if (res.FaceMatches.length === 0) {
        return callback(null, { message: 'uh oh, no faces' });
      }
      const externalImageId = res.FaceMatches[0].Face.ExternalImageId;
      console.log('externalImageId:', externalImageId);
      if ((externalImageId.match(/_/g) || []).length !== 1) {
        return callback(null, { message: 'uh oh, not the expected number of forward slashes' });
      }
      const [location, name] = externalImageId.split('_');
      console.log('location, name:', location, name);

      // TODO: Update person record with the location of this image. Maybe a `last-seen` field as well.
      // TODO: Delete the processed image from S3.
      return callback(null, { location, name });
    })
    .catch((err) => {
      console.log('Error:', JSON.stringify(err));
      callback(null, err);
    });
};
