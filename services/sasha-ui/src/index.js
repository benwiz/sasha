const fs = require('fs');

const replaceTemplates = (replacements, html) => {
  let result = html;
  Object.keys(replacements).forEach((key) => {
    result = result.replace(`{{ ${key} }}`, replacements[key]);
  });
  return result;
};

exports.handler = (event, context) => {
  fs.readFile('index.html', 'utf-8', (err, data) => {
    const replacements = {
      current_state: { salt_lamp: { state: 'on' } },
      desired_state: { salt_lamp: { state: 'on' } },
    };
    const html = replaceTemplates(replacements, data);
    context.succeed(html);
  });
};
