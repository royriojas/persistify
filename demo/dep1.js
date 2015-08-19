var abc = require('./dep2');
console.log('hello world!!!!');

abc.showMetal(require('./deps/dep-3'));

abc.on('update', (x) => x * 2);