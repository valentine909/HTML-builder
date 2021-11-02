const {readdir} = require('fs/promises');
const path = require('path');
const {stat} = require('fs');

const pathToFolder = path.resolve(__dirname, 'secret-folder');
readdir(pathToFolder, {withFileTypes: true})
  .then(files => files.filter(file => file.isFile()))
  .then(files => files.map(x => stat(path.resolve(pathToFolder, x['name']), (err, st) => {
    console.log((()=>{
      return getFilenameAndExtension(path.resolve(pathToFolder, x['name'])).concat([st.size]).join(' - ');
    })()
    );
  })))
  .catch(error => console.error(error));

function getFilenameAndExtension(pathToFile){
  const fullFilename = path.basename(pathToFile);
  const extension = path.extname(pathToFile);
  const filename = path.basename(fullFilename, extension);
  return [filename, extension.replace('.', '')];
};