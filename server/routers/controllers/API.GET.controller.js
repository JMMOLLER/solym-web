const { ObjectId } = require('mongoose').Types;
const { logger } = require('../../Resources/pino');
const { searchSong } = require('../../Resources/genius-api');
const DB = require('../../DB/DAO/SolymDatas.dao').UploadFile.returnSingleton();
const { getLyricsByID, getInfoByID } = require('../../Resources/genius-api');
const { getBucket, getConnection } = require('../../Resources/multer');
const { getMetadata } = require('../../Resources/music-metadata');
const ms= require('ms');


/* GET REQUESTS */

const healthCheck = async (req, res) => {
    try{
        const response = await getLyricsByID(5160124);
        if(response.error) return res.status(400).json({ message: response.msg, code: 503, status: 'server dosen\'t work correctly' });
        return res.status(200).json({lyrics: response.lyric, status: 'OK'});
    }catch(error){
        return res.status(400).json({ message: error.toString(), code: 503, status: 'server health is worst!' });
    }
};

const select = async(req, res) => {
    const data = await DB.getDoc(req.cookies['Solym'].infoId);
    if(!data){
        return res.status(403).json({ message: "No Solym data found", code: 403, returnTo: '/' });
    }
    return res.status(200).send(data.results);
};

const lyrics = async(req, res) => {
    const data = await DB.getDoc(req.cookies['Solym'].infoId);
    if(!data.trackID){
        return res.status(400).json({ message: 'TrackID not found', code: 400, returnTo: '/' });
    }
    const response = await getLyricsByID(data.trackID);
    if(response.error){
        return res.status(400).json({ message: response.msg, code: 400, returnTo: '/' });
    }
    return res.status(200).json({lyrics: response.lyric, code: 200, returnTo: ''});
}

const info = async(req, res) => {
    const data = await DB.getDoc(req.cookies['Solym'].infoId);
    if(!data.trackID){
        return res.status(400).json({ message: 'TrackID not found', code: 400, returnTo: '/' });
    }
    const info = await getInfoByID(data.trackID);
    return res.status(200).json(info);
};

const uploadFileInfo = async (req, res) => {
    logger.info("Waiting for metadata...");
    const uploadStream = ObjectId(req.params.id);
    try {
        const bucket = await getBucket();
        const Track = bucket.openDownloadStream(uploadStream);
        const fullInfo = await getMetadata(Track);

        fullInfo.picture = undefined;
        logger.debug(fullInfo)

        const partialInfo = {
            title: fullInfo.title,
            fullTitle: fullInfo.title + " " + (fullInfo?.artist?.split(",")[0]),
            artist: fullInfo.artists,
        }
        
        let results = [];
        
        if(partialInfo.title && partialInfo.artist){
            logger.info("Waiting for matches...");
            results = await searchSong(partialInfo.fullTitle, partialInfo.artist[0]);
        }
        
        logger.debug(partialInfo);

        const Solym = await DB.saveDoc({results: results, fileId: uploadStream})
        
        res.cookie('Solym', {infoId: Solym._id}, { maxAge: ms('1h'), httpOnly: false, sameSite: 'none', secure: true });
        return res.status(200).json({code: 200, message: 'Metadata has been fetched successfully', status: true});
    } catch (error) {
        logger.error(error);
        await DB.deleteTrack(uploadStream);
        return res.status(500).json({error: error.message});
    } 
}

const uploadFile = async (req, res) => {
    try {
        const data = await DB.getDoc(req.cookies['Solym'].infoId);
        if (!data) {
            return res.status(400).json({ error: 'No data' });
        }

        res.set('content-type', 'audio/mpeg');
        res.set('content-range', 'bytes');
        res.set('Accept-Ranges', 'bytes');

        const bucket = await getBucket();
        const Track = bucket.openDownloadStream(ObjectId(data.fileId));

        const connection = await getConnection();
        const collection = connection.collection('tracks.files');
        const file = await collection.findOne({ _id: ObjectId(data.fileId) });

        if (!file) {
            logger.error('File not found');
            return res.status(404).json({ error: 'File not found' });
        }

        res.set('content-length', file.length);
        res.set('X-Content-Duration', file.length);

        logger.info('Sending track...');

        Track.on('data', chunk => {
            res.write(chunk);
        });
        Track.on('error', () => {
            logger.error('error');
            res.status(404);
        });
        Track.on('end', () => {
            logger.info('Request ended');
            res.end();
        });
    } catch (error) {
        logger.error('An error occurred:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
  

module.exports = {
    select,
    lyrics,
    info,
    uploadFile,
    healthCheck,
    uploadFileInfo,
};