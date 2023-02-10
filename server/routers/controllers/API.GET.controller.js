const mongoose = require('mongoose');
const { UploadFile } = require('../../DB/DAO/DAO');
const DB = UploadFile.returnSingleton();
const {
    getLyricsByID, 
    getInfoByID,
} = require('../../Resources/genius-api');
const {
    getBucket, 
    getConnection 
} = require('../../Resources/multer');


/* GET REQUESTS */
const home = (req, res) => {
    res.status(200).json({});
};

const select = async(req, res) => {
    const data = await DB.getDoc(req.cookies['Symly'].infoId);
    if(!data){
        return res.redirect('/');
    }
    res.status(200).send(data.results);
};

const start = (req, res) => {
    res.status(200).json({});
};

const lyrics = async(req, res) => {
    if(req.params.id < 1){
        return res.status(400).json({error: 'Invalid ID'});
    }
    const lyrics = await getLyricsByID(Number(req.params.id));
    res.status(200).json({lyrics: lyrics});
}

const info = async(req, res) => {
    if(req.params.id < 1){
        return res.status(400).json({error: 'Invalid ID'});
    }
    const info = await getInfoByID(Number(req.params.id));
    res.status(200).json(info);
};

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
    const Track = bucket.openDownloadStream(mongoose.Types.ObjectId(data.fileId));
    await getConnection().collection('tracks.files').findOne({_id: mongoose.Types.ObjectId(data.fileId)}, (err, file) => {
        if(err){
            console.log(err);
            return res.status(500).json({error: 'Error'});
        }
        res.set('content-length', file.length);
        res.set('X-Content-Duration', file.length);
    } )
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
        res.sendStatus(404);
    });
    Track.on('end', () => {
        console.log('\x1b[31m%s\x1b[0m', "Request ended");
        res.end();
    });
};

module.exports = {
    home,
    select,
    start,
    lyrics,
    info,
    uploadFile,
};