const Promise = require('bluebird');
const Request = require('request');
const SnsPublish = require('aws-sns-publish');


const iftttSecretKey = process.env.IFTTT_SECRET_KEY;

const getIFTTTWebhook = (action, payload) => new Promise((resolve, reject) => {
  const data = JSON.stringify(payload);
  Request.get({
    headers: { 'content-type': 'application/json' },
    url: `https://maker.ifttt.com/trigger/${action}/with/key/${iftttSecretKey}`,
    body: data,
  }, (error, response, body) => {
    if (error) {
      return reject(error);
    }
    // TODO: Should try to parse json and catch an error. Not only is that the better way,
    // it will handle unexpected situations that have come up like html in response.
    console.log('IFTTT Response:', body);
    if (body !== 'Congratulations! You\'ve fired the record_overland_data event' &&
        body !== 'Request Entity Too Large') {
      body = JSON.parse(body);
    }
    return resolve(body);
  });
});

const getLatestLocation = (data) => {
  const latestData = data.locations[data.locations.length - 1];
  const coords = {
    latitude: latestData.geometry.coordinates[1],
    longitude: latestData.geometry.coordinates[0],
    timestamp: latestData.properties.timestamp,
    device_id: latestData.properties.device_id,
  };
  return coords;
};

const getGeofence = coords => new Promise((resolve, reject) => {
  Request.get({
    headers: { 'content-type': 'application/json' },
    url: `https://j635jiwp94.execute-api.us-east-1.amazonaws.com/prod/geofencer?lat=${coords.latitude}&lng=${coords.longitude}`,
  }, (error, response, body) => {
    if (error) {
      return reject(error);
    }
    body = JSON.parse(body);
    return resolve(body);
  });
});

exports.handle = (event, context, callback) => {
  console.log('EVENT:', JSON.stringify(event));
  console.log('BODY:', JSON.stringify(event.body));

  if (!event.body) {
    const response = {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing payload!' }),
    };
    return callback(null, response);
  }

  const overlandData = JSON.parse(event.body);
  const coords = getLatestLocation(overlandData);
  console.log('coords:', coords);

  Promise.resolve()
    // Update coordinates in DynamoDB
    .then(() => {
      const body = {
        person: coords.device_id,
        latitude: coords.latitude,
        longitude: coords.longitude,
        latest_coords_timestamp: coords.timestamp,
      };
      const topic = 'people';
      const data = JSON.stringify(body);
      const params = { arn: `arn:aws:sns:us-east-1:778257796245:${topic}` };
      return SnsPublish(data, params);
    })
    .then((res) => {
      // TODO: Handle SnsPublish() response
      console.log('SnsPublish() response:', res);
      // Calculate geofence location by making API request to util_geofencer.
      return getGeofence(coords);
    })
    .then((locations) => {
      // TODO: Handle locations by sending an SNS `Person` message to update DynamoDB as well
      // as be picked up by another service that runs logic.
      console.log('locations:', locations);

      // Send data to IFTTT -> Google Spreadsheet
      const action = 'record_overland_data';
      const payload = { value1: event.body.replace(/\n/g, '').replace(/ /g, '') };
      return getIFTTTWebhook(action, payload);
    })
    // HTTP Response via API Gateway
    .then((res) => {
      console.log('IFTTT RES:', res, typeof res);
      const reply = {};
      // If IFTTT responded with errors
      if (res.errors) {
        reply.statusCode = 500;
        reply.body = JSON.stringify({ message: 'IFTTT errors.', errors: res.errors });
      } else if (res === 'Request Entity Too Large') {
        reply.statusCode = 500;
        reply.body = JSON.stringify({ message: 'IFTTT payload too large.' });
      } else {
        reply.statusCode = 200;
        reply.body = JSON.stringify({ result: 'ok' }); // This is specifically what the Overland app expects (https://github.com/aaronpk/Overland-iOS/blob/e192244a76f3bcb1f495a3aee9cde816ca63de3d/GPSLogger/GLManager.m#L160)
      }
      callback(null, reply);
    })
    .catch((err) => {
      const reply = {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error.', error: err }),
      };
      callback(null, reply);
    });

  return null;
};
