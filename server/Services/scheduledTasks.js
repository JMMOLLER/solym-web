const ms = require('ms');
const cron = require('node-cron');
const { logger } = require('../Resources/pino');
const DB = require('../DB/DAO/SolymDatas.dao').UploadFile.returnSingleton();

// Run every 5 minutes
cron.schedule('*/30 * * * *', async() => {
    logger.warn('Running a scheduled task...');
    const docs = await DB.getAllFiles();
    docs.forEach(async (element) => {
        if(element.uploadDate.getTime() + ms('1h') < new Date().getTime()){
            await DB.deleteTrack(element._id);
        }
    });
});
