const Promise = require('bluebird');
const Request = require('request');


const iftttSecretKey = process.env.IFTTT_SECRET_KEY;
const phoneNumber = process.env.PHONE_NUMBER;

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
    console.log(body);
    return resolve(body);
  });
});

const sendSNS = (topic, payload) => new Promise((resolve, reject) => {
  const data = JSON.stringify(payload);
  Request.post({
    headers: { 'content-type': 'application/json' },
    url: `https://sasha.benwiz.io/sns?topic=${topic}`,
    body: data,
  }, (error, response, body) => {
    if (error) {
      return reject(error);
    }
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

  const data = JSON.parse(event.body);
  // const coords = getLatestLocation(data);

  // Send data to IFTTT -> Google Spreadsheet.
  // Currently we are just packaing the entirety of payload into a JSON string and storing that.
  // It will need to be extracted and parsed at a later date. This function may change over time.
  Promise.resolve() // TODO: Write coords to database (DynamoDB, either directly or via api)
    .then(() => {
      const action = 'record_overland_data';
      const payload = { value1: event.body };
      return getIFTTTWebhook(action, payload);
    })
    // .then(() => {
    //   const snsPayload = {
    //     phone: phoneNumber,
    //     message: `Latitude: ${coords.latitude}\n` +
    //              `Longitude: ${coords.longitude}\n` +
    //              `Timestamp: ${coords.timestamp}`,
    //   };
    //   console.log('Send SMS:', JSON.stringify(snsPayload));
    //   return sendSNS('sms', snsPayload);
    // })
    .then(() => {
      const reply = {
        statusCode: 200,
        body: JSON.stringify({ result: 'ok' }), // This is specifically what the Overland app expects (https://github.com/aaronpk/Overland-iOS/blob/e192244a76f3bcb1f495a3aee9cde816ca63de3d/GPSLogger/GLManager.m#L160)
      };
      callback(null, reply);
    })
    .catch((err) => {
      const reply = {
        statusCode: 500,
        body: JSON.stringify({ message: 'Bad response from IFTTT.', error: err }),
      };
      callback(null, reply);
    });

  return null;
};
