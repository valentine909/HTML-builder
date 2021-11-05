const path = require('path');
const {readdir} = require('fs/promises');
const {createReadStream, createWriteStream} = require('fs');

const settings = {
  destinationFolder: 'project-dist',
  sourceFolder: 'styles',
  targetName: 'bundle.css',
  extensionRegExp: new RegExp(/\.css$/g)
};

function mergeFiles(settings){
  const dest = path.resolve(__dirname, settings.destinationFolder);
  const src = path.resolve(__dirname, settings.sourceFolder);
  const writer = createWriteStream(path.resolve(dest, settings.targetName), { encoding: 'utf-8' });

  readdir(src).then(files => files.filter(file => file.match(settings.extensionRegExp)))
    .then(files => files.map(file => {
      const reader = createReadStream(path.resolve(src, file), { encoding: 'utf-8' });
      reader.pipe(writer);
      reader.read();
    }));
}
if(require.main === module) mergeFiles(settings);
module.exports = mergeFiles;