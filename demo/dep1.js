var abc = require('./dep2');
console.log('hello world!!!!');
console.log('another world');
abc.showMetal(require('./deps/dep-3'));

abc.on('update', (x) => x * 2);

var demoM = require('./deps/demo.m.less');

console.log(demoM.t('some-class'));