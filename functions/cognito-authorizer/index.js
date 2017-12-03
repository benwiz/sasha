const Promise = require('bluebird');
const fs = require('fs');

// TODO: Get the `id_token`, run the js auth communications with cognito,

// module.exports.handle = (event, context, callback) => Promise.resolve(event)
//   .then(() => console.log(JSON.stringify(event)))
//   .then(() => callback(null, {
//     statusCode: 302,
//     headers: {
//       Location: 'https://sasha.benwiz.io',
//       Authorization: '999',
//     },
//   }))
//   .catch(callback);

module.exports.handle = (event, context, callback) => {
  fs.readFile('index.html', 'utf-8', (err, data) => {
    // const replacements = {};
    // const html = replaceTemplates(replacements, data);
    const html = data;
    context.succeed(html); // TODO: use callback instead
  });
};
