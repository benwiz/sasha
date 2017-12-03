const Promise = require('bluebird');
const AWS = require('aws-sdk');
const SnsPublish = require('aws-sns-publish');
const Request = require('request');

const rekognition = new AWS.Rekognition();
const s3 = new AWS.S3();

// Use AWS Rekognition to identify faces
const searchFacesByImage = (bucket, key) => new Promise((resolve, reject) => {
  const params = {
    CollectionId: 'faces',
    FaceMatchThreshold: 95,
    Image: {
      S3Object: {
        Bucket: bucket,
        Name: key,
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

// Delete S3 Object
const deleteS3Object = (bucket, key) => new Promise((resolve, reject) => {
  const params = {
    Bucket: bucket,
    Key: key,
  };
  s3.deleteObject(params, (err, data) => {
    if (err) {
      reject(err);
    } else {
      resolve(data);
    }
  });
});

// Insert a substring into the string.
const insertSubstring = (sourceString, index, subString) => {
  return sourceString.slice(0, index) + subString + sourceString.slice(index);
};

exports.handle = (event, context, callback) => {
  console.log('EVENT:', JSON.stringify(event));

  // TODO: Handle multiple records.
  const record = event.Records[0];
  const bucket = record.s3.bucket.name;
  const key = record.s3.object.key;

  searchFacesByImage(bucket, key)
    .then((res) => {
      // TODO: Handle a bad response from `searchFacesByImage()`.
      console.log('searchFacesByImage.result:', JSON.stringify(res));

      // If no matches found
      if (res.FaceMatches.length === 0) {
        console.log('No face matches found.');
        return null;
      }

      // Extract person's name
      const name = res.FaceMatches[0].Face.ExternalImageId;

      // Get the origin location and timestamp of the image
      let [location, timestamp] = key.split('.jpg')[0].split('_');

      // Insert the missing colons into the timestamp.
      // The timestamp currently looks like `2008-09-15T1553000500` but
      // it needs to look like `2008-09-15T155300+0500`. So add colons into
      // the _th and _th indices. From back to front so indices don't change.
      timestamp = insertSubstring(timestamp, 17, '+');
      timestamp = insertSubstring(timestamp, 15, ':');
      timestamp = insertSubstring(timestamp, 13, ':');

      // Create the SNS message
      const body = {
        person: name,
        last_seen_location: location,
        last_seen_timestamp: timestamp,
      };
      const topic = 'people';
      const data = JSON.stringify(body);
      const params = { arn: `arn:aws:sns:us-east-1:778257796245:${topic}` };
      return SnsPublish(data, params);
    })
    .then((res) => {
      console.log('SnsPublish result:', res);
      // TODO: If `updateDynamoDB()` was not successful, then make sure I am alerted.
      // Probably move the image somewhere else so it can be debugged later.
      return deleteS3Object(bucket, key);
    })
    .then((res) => {
      // TODO: Handle bad response from `deleteS3Object()`
      return callback(null, { message: 'ok' });
    })
    .catch((err) => {
      console.log('Error:', JSON.stringify(err));
      callback(null, err);
    });
};
