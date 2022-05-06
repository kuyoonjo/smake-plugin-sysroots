const { Command } = require('commander');
const { command } = require('./lib');

const c = new Command('test');
command(c);

c.parse(process.argv);
