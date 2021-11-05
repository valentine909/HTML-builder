const {createReadStream} = require('fs');
const path = require('path');
const {mergeFiles} = require('../05-merge-styles/index');
const {copyFiles} = require('../04-copy-directory/index');

const mergeSettings = {
  destinationFolder: 'project-dist',
  sourceFolder: 'styles',
  targetName: 'style.css',
  extensionRegExp: new RegExp(/\.css$/g)
};
const copySettings = {
  destinationFolder: 'project-dist/assets',
  sourceFolder: 'assets',
};

function getTagsFromHTML(html) {
  const pattern = new RegExp(/{{(\w+)}}/g);
  const tags = [];
  for (const match of html.matchAll(pattern))
    tags.push(match[1]);
  return tags;
}

async function readHTML(root, filename) {
  return new Promise((resolve, reject) => {
    const reader = createReadStream(path.resolve(root, filename), {encoding: 'utf-8'});
    let data = '';
    reader.on('readable', () => {
      let chunk = reader.read();
      if (chunk !== null) data += chunk;
    });
    reader.on('end', () => {
      resolve(data);
    });
    reader.on('error', () => {
      reject('Error reading file');
    });
  });
}
async function main() {
  await copyFiles(path.resolve(__dirname, copySettings.sourceFolder),
    path.resolve(__dirname, copySettings.destinationFolder));
  await mergeFiles(mergeSettings);
  readHTML(__dirname, 'template.html').then(res => console.log(getTagsFromHTML(res)));
}
if(require.main === module) main().catch(err => console.log(err));