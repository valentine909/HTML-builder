const {createReadStream} = require('fs');
const path = require('path');

function getTagsFromHTML(html) {
  const pattern = new RegExp(/{{(\w+)}}/g);
  const tags = [];
  for (const match of html.matchAll(pattern))
    tags.push(match[1]);
  return tags;
}

async function readHTML(root, filename) {
  return new Promise((resolve, reject) =>{
    const reader = createReadStream(path.resolve(root, filename), {encoding: 'utf-8'});
    let data = '';
    reader.on('readable', () => {
      let chunk = reader.read();
      if (chunk !== null) data += chunk;
    });
    reader.on('end', () => {resolve(data);});
    reader.on('error', () => {reject('Error reading file');});
  });
}

readHTML(__dirname, 'template.html').then(res => console.log(getTagsFromHTML(res)));