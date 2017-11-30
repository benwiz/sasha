const Promise = require('bluebird');
const AWS = require('aws-sdk');
const Request = require('request');

const rekognition = new AWS.Rekognition();

const searchFacesByImage = record => new Promise((resolve, reject) => {
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
});

// Update DynamoDB
const updateDynamoDB = payload => new Promise((resolve, reject) => {
  const data = JSON.stringify(payload);
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

  // TODO: Handle multiple records.
  const record = event.Records[0];
  const bucket = record.s3.bucket.name;
  const key = record.s3.object.key;

  // TODO: don't pass in entire record, just pass bucket and key.
  searchFacesByImage(record)
    .then((res) => {
      console.log('searchFacesByImage.result:', JSON.stringify(res));

      // Extract person's name
      if (res.FaceMatches.length === 0) {
        return callback(null, { message: 'uh oh, no faces' });
      }
      const name = res.FaceMatches[0].Face.ExternalImageId;

      // Get the origin location and timestamp of the image
      const [location, timestamp] = key.split('.jpg')[0].split('_');

      // TODO: Update person record with the location of this image. Maybe a `last-seen` field as well.
      const payload = {
        person: name,
        last_seen_location: location,
        last_seen_timestamp: timestamp,
      };
      console.log('payload:', payload);
      // return updateDynamoDB(payload);
      return callback(null, { location, name, timestamp });
    })
    .then((res) => {
      // TODO: Delete the processed image from S3.
      return callback(null, { message: 'ok' });
    })
    .catch((err) => {
      console.log('Error:', JSON.stringify(err));
      callback(null, err);
    });
};
