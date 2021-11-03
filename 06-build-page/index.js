const {createReadStream} = require('fs');
const path = require('path');

const reader = createReadStream(path.resolve(__dirname, 'template.html'), {encoding: 'utf-8'});
const pattern = new RegExp(/{{(\w+)}}/g);
reader.on('readable', () => {
  let chunk = reader.read();
  if (chunk !== null) {
    for (const match of chunk.matchAll(pattern))
      console.log(match[1]);
  }
});
