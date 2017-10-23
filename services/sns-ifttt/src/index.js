const Https = require('https');
const Querystring = require('querystring');

const iftttSecretKey = process.env.IFTTT_SECRET_KEY;
// 'https://maker.ifttt.com/trigger/' + iftttMakerEventName + '/with/key/' + iftttSecretKey

// Display the contents of the index.html file
const handler = (event, context) => {
  const message = event.Records[0].Sns.Message;
  console.log('From SNS:', message);
};

exports.handler = handler;
