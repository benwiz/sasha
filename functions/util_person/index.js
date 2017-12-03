const SnsPublish = require('aws-sns-publish');

/*
TODO:
- Consume the People topic
- Based on location.name, trigger actions
  - This may mean multiple SNS messages to different topics
  - Start with messages to the Lights topic. Then maybe the Music topic.

*/

exports.handle = (event, context, callback) => {
  console.log('Event:', JSON.stringify(event));
  callback(null, 1);
};
