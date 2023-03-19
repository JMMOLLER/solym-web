const yargs = require('yargs');
const args = yargs(process.argv.slice(2)).alias({
    h: 'host',
    p: 'port',
    s: 'storage',
}).default({
    host: 'localhost',
    port: 8080,
    storage: 'local',
}).argv;

module.exports = { args };