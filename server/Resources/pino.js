const { args } = require("./yargs");
const pino = require('pino');
let logger = pino({
    transport: {
        target: 'pino-pretty',
    }
});

/* =========== CONDITIONS FOR CHOOSE THE LEVEL LOGGER =========== */

if(args.export && args.mode === 'dev'){
    logger = pino('debug.log');
    logger.level = 'trace';
    console.warn('\x1b[33m%s\x1b[0m', '============ Writing to debug.log file ============');
}
else if(args.mode === 'dev'){
    logger.level = 'debug';
    logger.debug('logger set to debug mode');
}
else{
    logger.level = 'info';
    logger.info('logger set to info mode');
}
/* =============================================================== */

logger.info('logger initialized');

/* =========== EXPORT =========== */

module.exports = { logger };
