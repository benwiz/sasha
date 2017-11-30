const Promise = require('bluebird');
const Request = require('request');
const fs = require('fs');

// Replace jinja style double bracket templates in a string. Replacements will also convert data
// a string if necessary.
const replaceTemplates = (replacements, html) => {
  let result = html;
  Object.keys(replacements).forEach((key) => {
    let replacement = replacements[key];
    if (typeof replacement === 'object') {
      replacement = JSON.stringify(replacement);
    }
    result = result.replace(`{{ ${key} }}`, replacement);
  });
  return result;
};

// Get the current coordinates from DynamoDB via the API.
const getCoordinates = person => new Promise((resolve, reject) => {
  Request.get({
    headers: { 'content-type': 'application/json' },
    url: `https://sasha.benwiz.io/dynamo/people?person=${person}`,
  }, (error, response, body) => {
    if (error) {
      return reject(error);
    }
    console.log('getCoordinates() raw response:', body);
    const obj = JSON.parse(body);
    const reply = {
      latitude: obj.latitude,
      longitude: obj.longitude,
      timestamp: obj.latest_coords_timestamp,
    };
    return resolve(reply);
  });
});

// Get locations
const getLocations = () => new Promise((resolve, reject) => {
  Request.get({
    headers: { 'content-type': 'application/json' },
    url: 'https://sasha.benwiz.io/dynamo/locations',
  }, (error, response, body) => {
    if (error) {
      return reject(error);
    }
    console.log('getLocations() raw response:', body);
    const obj = JSON.parse(body);
    return resolve(obj);
  });
});

// Display the contents of the index.html file
exports.handle = (event, context, callback) => {
  fs.readFile('index.html', 'utf-8', (err, data) => {
    const replacements = {};

    getLocations()
      .then((res) => {
        replacements.shapes = JSON.stringify(res);
        return getCoordinates('benwisialowski');
      })
      .then((res) => {
        replacements.latitude = res.latitude;
        replacements.longitude = res.longitude;
        replacements.timestamp = res.timestamp;
        console.log('replacements:', replacements);

        const html = replaceTemplates(replacements, data);
        context.succeed(html); // TODO: use callback instead
      })
      .catch((err) => {
        console.log('Error:', err);
      });
  });
};
