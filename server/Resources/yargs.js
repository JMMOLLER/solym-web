const yargs = require('yargs');
const args = yargs(process.argv.slice(2)).alias({
    h: 'host',
    p: 'port',
    s: 'storage',
    m: 'mode',
    e: 'export'
}).default({
    host: 'localhost',
    port: 8080,
    storage: 'local',
    mode: 'prod',
    export: false
}).argv;

module.exports = { args };