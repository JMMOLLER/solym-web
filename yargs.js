const yargs = require('yargs');
const args = yargs(process.argv.slice(2)).alias({
    p: 'port',
    s: 'storage',
}).default({
    port: 8080,
    storage: 'local',
}).argv;

module.exports = {args};