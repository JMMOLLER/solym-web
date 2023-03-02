const yargs = require('yargs');
const args = yargs(process.argv.slice(2)).alias({
    a: 'address',
    p: 'port',
    s: 'storage',
}).default({
    address: 'localhost',
    port: 8080,
    storage: 'local',
}).argv;

module.exports = {args};