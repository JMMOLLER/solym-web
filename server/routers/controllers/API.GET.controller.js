const { ObjectId } = require('mongoose').Types;
const DB = require('../../DB/DAO/SolymDatas.dao').UploadFile.returnSingleton();
const { getLyricsByID, getInfoByID } = require('../../Resources/genius-api');
const { getBucket, getConnection } = require('../../Resources/multer');
const { searchSong } = require('../../Resources/genius-api');
const { getMetadata } = require('../../Resources/music-metadata');
const ms= require('ms');


/* GET REQUESTS */

const select = async(req, res) => {
    const data = await DB.getDoc(req.cookies['Symly'].infoId);
    if(!data){
        return res.status(403).json({ message: "No Solym data found", code: 403, returnTo: '/' });
    }
    return res.status(200).send(data.results);
};

const lyrics = async(req, res) => {
    if(req.params.id < 1){
        return res.status(400).json({ message: 'Invalid ID', code: 400, returnTo: '/' });
    }
    const lyrics = await getLyricsByID(Number(req.params.id));
    return res.status(200).json({lyrics: lyrics});
}

const info = async(req, res) => {
    if(req.params.id < 1){
        return res.status(400).json({ message: 'Invalid ID', code: 400, returnTo: '/' });
    }
    const info = await getInfoByID(Number(req.params.id));
    return res.status(200).json(info);
};

const uploadFileInfo = async (req, res) => {
    console.log('\x1b[36m%s\x1b[0m', "Waiting for metadata...");
    const uploadStream = ObjectId(req.params.id);
    try {
        const bucket = await getBucket();
        const Track = bucket.openDownloadStream(uploadStream);
        const fullInfo = await getMetadata(Track);

        console.log(fullInfo)

        const partialInfo = {
            title: fullInfo.title,
            fullTitle: fullInfo.title + " " + (fullInfo.artist.split(",")[0]),
            artist: fullInfo.artists,
        }
        
        let results = [];
        
        if(partialInfo.title && partialInfo.artist){
            console.log('\x1b[34m%s\x1b[0m', "Waiting for matches...");
            results = await searchSong(partialInfo.fullTitle, partialInfo.artist[0]);
        }
        
        console.log(partialInfo);

        const Symly = await DB.saveDoc({results: results, fileId: uploadStream})
        
        res.cookie('Symly', {infoId: Symly._id}, { maxAge: ms('1h'), httpOnly: false });
        return res.status(200).json({code: 200, message: 'Metadata has been fetched successfully', status: true});
    } catch (error) {
        await DB.deleteTrack(uploadStream);
        console.log(error);
        return res.status(500).json({error: error.message});
    } 
}

const uploadFile = async(req, res) => {
    console.log('\x1b[31m%s\x1b[0m', "New request");
    const data = await DB.getDoc(req.cookies['Symly'].infoId);
    if(!data){
        return res.status(400).json({error: 'No data'});
    }
    res.set('content-type', 'audio/mpeg');
    res.set('content-range', 'bytes');
    res.set('Accept-Ranges', 'bytes');
    const bucket = await getBucket();
    const Track = bucket.openDownloadStream(ObjectId(data.fileId));
    await getConnection().then((connection) => {
        connection.collection('tracks.files').findOne({_id: ObjectId(data.fileId)}, (err, file) => {
            if(err){
                console.log(err);
                return res.status(500).json({error: 'Error'});
            }
            res.set('content-length', file.length);
            res.set('X-Content-Duration', file.length);
        })
    })
    console.log('\x1b[34m%s\x1b[0m', "Sending track...");
    Track.on('data', chunk => {
        res.write(chunk);
    })
    Track.on('field', (name, value) => {
        console.log("field");
        console.log(name, value);
    })
    Track.on('error', () => {
        console.log("error");
        res.status(404);
    });
    Track.on('end', () => {
        console.log('\x1b[31m%s\x1b[0m', "Request ended");
        res.end();
    });
};

module.exports = {
    select,
    lyrics,
    info,
    uploadFile,
    uploadFileInfo,
};