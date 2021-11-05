const path = require('path');
const {readdir, copyFile, mkdir} = require('fs/promises');
const folder = (require.main === module) ? __dirname : path.dirname(require.main.filename);
const settings = {
  destinationFolder: path.resolve(folder, 'files-copy'),
  sourceFolder: path.resolve(folder, 'files'),
};

async function copyFiles(src, dest){
  await mkdir(dest, {recursive: true});
  let files = await readdir(src, {withFileTypes: true});
  for (const file of files) {
    const srcPath = path.resolve(src, file.name);
    const destPath = path.resolve(dest, file.name);
    if (file.isDirectory()) await copyFiles(srcPath, destPath);
    else await copyFile(srcPath, destPath);
  }
}

if(require.main === module) copyFiles(settings.sourceFolder, settings.destinationFolder);
module.exports.copyFiles = copyFiles;