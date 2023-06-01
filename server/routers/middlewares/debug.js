const { logger } = require("../../Resources/pino");

const debug = (req, res, next) => {
    logger.debug("Request to "+req.originalUrl+" from "+req.ip+" with "+req.method+" method");
    next();
};

module.exports = debug;