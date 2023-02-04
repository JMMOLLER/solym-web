const Router = require('express').Router();
const ms= require('ms');
const mongoose = require('mongoose');
const { getMetadata } = require('../Resources/music-metadata');
const { upload, getBucket, getConnection } = require('../Resources/multer');
const { searchSong, getLyricsByID, getInfoByID, shearchByName } = require('../Resources/genius-api');
const {UploadFile} = require('../DB/DAO/DAO');
const DB = UploadFile.returnSingleton();
const { Readable } = require('stream');

Router.get('/lyrics/:id', async(req, res) => {
    if(req.params.id < 1){
        return res.status(400).json({error: 'Invalid ID'});
    }
    const lyrics = await getLyricsByID(Number(req.params.id));
    res.status(200).json({lyrics: lyrics});
});

Router.get('/info/:id', async(req, res) => {
    if(req.params.id < 1){
        return res.status(400).json({error: 'Invalid ID'});
    }
    const info = await getInfoByID(Number(req.params.id));
    res.status(200).json(info);
});

Router.get('/play', async(req, res) => {
    console.log('\x1b[31m%s\x1b[0m', "New request");
    if(!req.cookies['Symly']){
        return res.status(400).json({error: 'No cookie'});
    }
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
});

Router.post('/search/:music', async(req, res) => {
    const results = await shearchByName(req.params.music);
    res.send(results)
});

Router.post('/uploadFile', upload.single('song'), async(req, res) => {
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

});

Router.delete('/delete', async(req, res) => {
    if(!req.cookies['Symly']){
        return res.status(400).json({error: 'No cookie'});
    }
    const data = await DB.getDoc(req.cookies['Symly'].infoId);
    if(!data){
        return res.status(400).json({error: 'No data'});
    }
    await DB.deleteDoc(data._id);
    await DB.deleteTrack(data.fileId)
        ? res.status(200).json({message: "File deleted successfully."})
        : res.status(500).json({message: "Error deleting file."});
});

Router.delete('/delete/:id', async(req, res) => {
    await DB.deleteTrack(req.params.id)
        ? res.status(200).json({message: "File deleted successfully."})
        : res.status(500).json({message: "Error deleting file."});
});

module.exports = Router;