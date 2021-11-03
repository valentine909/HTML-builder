const path = require('path');
const {readdir} = require('fs/promises');
const {createReadStream, createWriteStream} = require('fs');

const dest = path.resolve(__dirname, 'project-dist');
const src = path.resolve(__dirname, 'styles');
const writer = createWriteStream(path.resolve(dest, 'bundle.css'), { encoding: 'utf-8' });

readdir(src).then(files => files.filter(file => file.match(/\.css$/g)))
  .then(files => files.map(file => {
    const reader = createReadStream(path.resolve(src, file), { encoding: 'utf-8' });
    reader.pipe(writer);
    reader.read();
  }));
