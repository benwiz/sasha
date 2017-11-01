const SnsPublish = require('aws-sns-publish');

exports.handler = (event, context, callback) => {

  console.log('EVENT:', event);
  console.log('BODY:', event.body);

  if (!evet.body) {
    const response = {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing payload!' }),
    };
    return callback(null, response);
  }

  const body = JSON.parse(event.body);
  console.log(body);

  const response = {
    statusCode: 200,
    body: JSON.stringify({ result: 'ok' }), // This is specifically what the Overland app expects (https://github.com/aaronpk/Overland-iOS/blob/e192244a76f3bcb1f495a3aee9cde816ca63de3d/GPSLogger/GLManager.m#L160)
  };
  return callback(null, response);

  /*
  const data = JSON.parse(message);
  const action = data.action;
  const payload = data.payload ? JSON.stringify(data.payload) : '';

  const options = {
    hostname: 'maker.ifttt.com',
    port: 443,
    path: `/trigger/${action}/with/key/${iftttSecretKey}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const req = Https.request(options, (res) => {
    res.on('data', (d) => {
      process.stdout.write(d);
    });
  });

  req.on('error', (e) => {
    console.error(e);
  });

  console.log('payload:', payload);
  req.write(payload);
  req.end();

  callback(null);
  */
};
