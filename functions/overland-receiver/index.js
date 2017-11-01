const Request = require('request');

const iftttSecretKey = process.env.IFTTT_SECRET_KEY;

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

  // Send data to IFTTT -> Google Spreadsheet.
  // Currently we are just packaing the entirety of payload into a JSON string and storing that.
  // It will need to be extracted and parsed at a later date. This function may change over time.
  // TODO: Plenty to clean up here. Mostly turning this into a promisified function.
  const action = 'record_overland_data';
  const payload = { value1: event.body };
  const data = json.dumps(payload);
  Request.get({
    headers: { 'content-type': 'application/json' },
    url: `https://maker.ifttt.com/trigger/${action}/with/key/${iftttSecretKey}`,
    body: data,
  }, (error, response, body) => {
    if (error) {
      return reject(error);
    }
    console.log('IFTTT RESPONSE:', body);
    // const obj = JSON.parse(body);
    const response = {
      statusCode: 200,
      body: JSON.stringify({ result: 'ok' }), // This is specifically what the Overland app expects (https://github.com/aaronpk/Overland-iOS/blob/e192244a76f3bcb1f495a3aee9cde816ca63de3d/GPSLogger/GLManager.m#L160)
    };
    return callback(null, response);
  });
};
