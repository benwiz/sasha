const Https = require('https');

const iftttSecretKey = process.env.IFTTT_SECRET_KEY;

// Pass along the payload to the correct IFTTT action.
const handler = (event, context, callback) => {
  const message = event.Records[0].Sns.Message;
  console.log('From SNS:', message);

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
};

exports.handler = handler;
