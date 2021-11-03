const path = require('path');
const {readdir, copyFile, mkdir} = require('fs/promises');

(async () => {
  const src = path.resolve(__dirname, 'files');
  const dest = path.resolve(__dirname, 'files-copy');
  await mkdir(dest, {recursive: true});
  let files = await readdir(src);
  for (const file of files) {
    await copyFile(path.resolve(src, file), path.resolve(dest, file));
  }
})();
