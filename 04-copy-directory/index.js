const path = require('path');
const {readdir, copyFile, mkdir} = require('fs/promises');
const folder = (require.main === module) ? __dirname : path.dirname(require.main.filename);
const settings = {
  destinationFolder: 'files-copy',
  sourceFolder: 'files',
};

async function copyFiles(settingsObj){
  const src = path.resolve(folder, settingsObj.sourceFolder);
  const dest = path.resolve(folder, settingsObj.destinationFolder);
  await mkdir(dest, {recursive: true});
  let files = await readdir(src);
  for (const file of files) {
    await copyFile(path.resolve(src, file), path.resolve(dest, file));
  }
}

if(require.main === module) copyFiles(settings);
module.exports.copyFiles = copyFiles;