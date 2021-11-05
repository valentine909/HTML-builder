const {createReadStream, createWriteStream} = require('fs');
const {readdir} = require('fs/promises');
const path = require('path');
const {mergeFiles} = require('../05-merge-styles/index');
const {copyFiles} = require('../04-copy-directory/index');

// helper functions
const checkImport = () => {
  try {
    [mergeFiles, copyFiles].forEach(x => {
      if (typeof x !== 'function') throw new Error('В работе этого модуля используются функции из index.js заданий 04 и 05.');
    });
  }
  catch (err) {
    console.log(err + '\n');
    process.exit(1);
  }
};
async function checkTagsAndComponentsCompatibility(tags) {
  const components = await readdir(path.resolve(__dirname, 'components'));
  const str1 = components.map(x => x.split('.')[0]).sort().join('');
  const str2 = tags.sort().join('');
  return str1 === str2;
}

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
const buildSettings = {
  sourceFile: 'template.html',
  destinationFile: 'index.html',
  destinationFolder: 'project-dist',
  components: 'components'
};

function getTagsFromHTML(html) {
  const pattern = new RegExp(/{{(\w+)}}/g);
  const tags = [];
  for (const match of html.matchAll(pattern))
    tags.push(match[1]);
  return tags;
}
async function readHTML(filePath) {
  return new Promise((resolve, reject) => {
    const reader = createReadStream(filePath, {encoding: 'utf-8'});
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
async function replaceWithComponents(tags, mainHTML) {
  for await (const tag of tags) {
    try {
      const pathToComponent = path.resolve(__dirname, buildSettings.components, `${tag}.html`);
      const fileContent = await readHTML(pathToComponent);
      mainHTML = mainHTML.replace(`{{${tag}}}`, fileContent);
    }
    catch (err) {
      console.log(`No such file ${tag}.html.`, err);
    }
  }
  return mainHTML;
}

async function main() {
  const sourcePath = path.resolve(__dirname, buildSettings.sourceFile);
  const destinationPath = path.resolve(__dirname, buildSettings.destinationFolder, buildSettings.destinationFile);

  let mainFileContent = await readHTML(sourcePath);
  let tags = getTagsFromHTML(mainFileContent);
  const writer = createWriteStream(destinationPath);

  checkImport();
  const check = await checkTagsAndComponentsCompatibility(tags);
  if (!check) console.log('Tags in template.html and components are not fully compatible. Please check');

  await copyFiles(path.resolve(__dirname, copySettings.sourceFolder),
    path.resolve(__dirname, copySettings.destinationFolder));
  await mergeFiles(mergeSettings);
  const newHTML = await replaceWithComponents(tags, mainFileContent);
  writer.write(newHTML);
}

if(require.main === module) main().catch(err => console.log(err));
