const Router = require('express').Router();
const { upload } = require('../Resources/multer');
const GetController = require('./controllers/API.GET.controller.js');
const PostController = require('./controllers/API.POST.controller.js');
const PutController = require('./controllers/API.PUT.controller.js');
const DeleteController = require('./controllers/API.DELETE.controller.js');
const cookie = require('./middlewares/authCookies');

/* GET REQUESTS */

Router.get('/healthz', GetController.healthCheck);

Router.get('/select', cookie.validateSolymCookie, GetController.select)

Router.get('/lyrics/:id', cookie.validateCookies, GetController.lyrics);

Router.get('/info/:id', cookie.validateCookies, GetController.info);

Router.get('/uploadFile', cookie.validateSolymCookie, GetController.uploadFile);

Router.get('/uploadFileInfo/:id', GetController.uploadFileInfo);

/* POST REQUESTS */

Router.post('/search/:music', PostController.shearchName);

Router.post('/uploadFile', upload.single('song'), PostController.uploadFile);

/* PUT REQUESTS */

Router.put('/updateCookie', /*cookie.validateSolymCookie,*/ PutController.updateCookie);

/* DELETE REQUESTS */

Router.delete('/delete', cookie.validateSolymCookie, DeleteController.deleteRoute);

Router.delete('/delete/:id', DeleteController.deleteByID);

module.exports = Router;