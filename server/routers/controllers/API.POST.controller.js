const { UploadFile } = require('../../DB/DAO/DAO');
const DB = UploadFile.returnSingleton();
const { Readable } = require('stream');
const { getBucket } = require('../../Resources/multer');
const { searchSong, shearchByName } = require('../../Resources/genius-api');
const { getMetadata } = require('../../Resources/music-metadata');
const ms= require('ms');

/* POST REQUESTS */

const shearchName = async (name) => {
    const results = await shearchByName(req.params.music);
    res.send(results)
};

const uploadFile = async (req, res) => {
    if (!req.file) {
        return res.status(400).send({error: 'No file uploaded.'});
    }
    //UPLOAD TRACK TO DB
    const filename = new Date().getTime()+"."+req.file.originalname.split('.').pop();
    const TrackStream = new Readable();
    TrackStream.push(req.file.buffer);
    TrackStream.push(null);


    const bucket = await getBucket();


    let uploadStream = bucket.openUploadStream(filename);
    TrackStream.pipe(uploadStream);
    uploadStream.on('error', () => {
        return res.status(500).send('Error uploading file.');
    });
    uploadStream.on('finish', async() => {
        console.log('\x1b[36m%s\x1b[0m', "File uploaded successfully.\nWaiting for metadata...");
        try {
            const bucket = await getBucket();
            const Track = bucket.openDownloadStream(uploadStream.id);
            const fullInfo = await getMetadata(Track);
            const partialInfo = {
                title: fullInfo.title,
                fullTitle: fullInfo.title+" by "+fullInfo.artist[0],
                artist: fullInfo.artist,
                duration: fullInfo.duration,
            }
            console.log(partialInfo);
            const results = await searchSong(partialInfo.fullTitle, partialInfo.artist[0]);
            const Symly = await DB.saveDoc({results: results,fileId: uploadStream.id})
            res.cookie('Symly', {infoId: Symly._id}, { maxAge: ms('1h'), httpOnly: true });
            res.status(200).send("OK");
        } catch (error) {
            await DB.deleteTrack(uploadStream.id);
            console.log(error);
            res.status(500).json({error: error.message});
        } 
    });
};

module.exports = {
    uploadFile,
    shearchName,
};