const { createReadStream } = require('fs');
const path = require('path');
const { stdout } = require('process');

const stream = createReadStream(path.resolve(__dirname, 'text.txt'), { encoding: 'utf-8' });
stream.pipe(stdout);
stream.on('readable', () => {
  stream.read();
});
stream.on('error', (error) => {
  if (error.code === 'ENOENT') {
    console.log('No such file');
  } else {
    console.log(error);
  }
});