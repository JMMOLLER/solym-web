const Router = require('express').Router();
const {UploadFile} = require('../DB/DAO/DAO');
const DB = UploadFile.returnSingleton();


Router.get('/', (req, res) => {
    if(req.cookies['Symly']){
        res.clearCookie('Symly');
    }if(req.cookies['selectedTrack']){
        res.clearCookie('selectedTrack');
    }
    res.render('index',{title: 'Home', layout: 'home' });
});

Router.get('/select', async(req, res) => {
    if(!req.cookies['Symly']){
        return res.redirect('/');
    }
    const data = await DB.getDoc(req.cookies['Symly'].infoId);
    if(!data){
        return res.redirect('/');
    }
    if(data.results.length > 0){
        res.render('index',{title: 'Select', layout: 'select', songs: data.results })
    }else{
        await DB.deleteTrack(data.fileId);
        await DB.deleteDoc(data._id);
        res.render('index',{title: 'Select', layout: 'select', error: true });
    }
})

Router.get('/start', async(req, res) => {
    if(!req.cookies['selectedTrack']){
        return res.status(400).redirect('/');
    }if(!req.cookies['Symly']){
        return res.status(400).redirect('/');
    }
    res.render('index',{title: 'Start', layout: 'start'});
});

module.exports = Router;