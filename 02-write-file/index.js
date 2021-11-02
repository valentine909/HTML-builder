const path = require('path');
const {createWriteStream} = require('fs');
const readline = require('readline');

const writer = createWriteStream(path.resolve(__dirname, 'write.txt'), {flags: 'a'});
const readlineInterface = readline.createInterface({
  input: process.stdin,
  output: writer,
  terminal: false
});
console.log('Start receiving message: ');
readlineInterface.on('line', line => {
  if (line === 'exit') {
    readlineInterface.close();
  } else {
    writer.write(line + '\n');
    console.log('Type more: ');
  }
});
process.on('SIGINT', ()=> {
  readlineInterface.close();
});
readlineInterface.on('close', ()=> {
  console.log('Goodbye! Have a nice day!');
});