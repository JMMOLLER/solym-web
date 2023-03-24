const cron = require('node-cron');
const ms = require('ms');
const DB = require('../DB/DAO/SolymDatas.dao').UploadFile.returnSingleton();

// Run every 5 minutes
cron.schedule('*/30 * * * *', async() => {
    console.log('\x1b[35m%s\x1b[0m','Running a scheduled task...');
    const docs = await DB.getAllFiles();
    docs.forEach(async (element) => {
        if(element.uploadDate.getTime() + ms('1h') < new Date().getTime()){
            await DB.deleteTrack(element._id);
        }
    });
});
