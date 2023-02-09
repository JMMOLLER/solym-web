const Router = require('express').Router();
const {UploadFile} = require('../DB/DAO/DAO');
const DB = UploadFile.returnSingleton();


Router.get('/', (req, res) => {
    if(req.cookies['Symly']){
        res.clearCookie('Symly');
    }if(req.cookies['selectedTrack']){
        res.clearCookie('selectedTrack');
    }
    res.status(200).json({data: "Hello index"});
});

Router.get('/select', async(req, res) => {
    if(!req.cookies['Symly']){
        return res.redirect('/');
    }
    const data = await DB.getDoc(req.cookies['Symly'].infoId);
    if(!data){
        return res.redirect('/');
    }
    res.status(200).send(data.results);
})

Router.get('/start', async(req, res) => {
    if(!req.cookies['selectedTrack']){
        return res.status(400).redirect('/');
    }if(!req.cookies['Symly']){
        return res.status(400).redirect('/');
    }
    res.status(200).json({});
});

module.exports = Router;