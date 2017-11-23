const Promise = require('bluebird');
const Request = require('request');


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
    if (body !== 'Congratulations! You\'ve fired the record_overland_data event') {
      body = JSON.parse(body);
    }
    return resolve(body);
  });
});

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
    console.log('updateDynamoDB() respnose:', body);
    const obj = JSON.parse(body);
    return resolve(obj);
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

exports.handle = (event, context, callback) => {
  console.log('EVENT:', event);
  console.log('BODY:', event.body);

  if (!event.body) {
    const response = {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing payload!' }),
    };
    return callback(null, response);
  }

  Promise.resolve()
    // Update coordinates in DynamoDB
    .then(() => {
      const data = JSON.parse(event.body);
      const coords = getLatestLocation(data);
      console.log('coords:', coords);

      const payload = {
        person: coords.device_id,
        latitude: coords.latitude,
        longitude: coords.longitude,
        latest_coords_timestamp: coords.timestamp,
      };
      return updateDynamoDB(payload);
    })
    // TODO: Handle updateDynamoDB() repsonse
    .then(() => {

    })
    // Send data to IFTTT -> Google Spreadsheet
    .then(() => {
      const action = 'record_overland_data';
      const payload = { value1: event.body.replace(/\n/g, '').replace(/ /g, '') };
      return getIFTTTWebhook(action, payload);
    })
    // HTTP Response
    .then((res) => {
      console.log('IFTTT RES:', res, typeof res);
      const reply = {};
      // If IFTTT responded with errors
      if (res.errors) {
        reply.statusCode = 500;
        reply.body = JSON.stringify({ message: 'IFTTT errors.', errors: res.errors });
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
