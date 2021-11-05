const path = require('path');
const {readdir} = require('fs/promises');
const {createReadStream, createWriteStream} = require('fs');
const folder = (require.main === module) ? __dirname : path.dirname(require.main.filename);
const settings = {
  destinationFolder: 'project-dist',
  sourceFolder: 'styles',
  targetName: 'bundle.css',
  extensionRegExp: new RegExp(/\.css$/g)
};

function mergeFiles(settingsObj){
  const dest = path.resolve(folder, settingsObj.destinationFolder);
  const src = path.resolve(folder, settingsObj.sourceFolder);
  const writer = createWriteStream(path.resolve(dest, settingsObj.targetName), { encoding: 'utf-8' });

  readdir(src).then(files => files.filter(file => file.match(settingsObj.extensionRegExp)))
    .then(files => files.map(file => {
      const reader = createReadStream(path.resolve(src, file), { encoding: 'utf-8' });
      reader.pipe(writer);
      reader.read();
    }));
}
if(require.main === module) mergeFiles(settings);
module.exports.mergeFiles = mergeFiles;