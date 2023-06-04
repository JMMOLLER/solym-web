const mongoose = require('mongoose');
const Somly = require('../models/schema.requests');
const { logger } = require('../../Resources/pino');
const { getBucket } = require('../../Resources/multer');
const { getConnectionURI } = require('../Service/Connection.service');

class UploadFile {

    instance
    constructor(){
        this.url = getConnectionURI();
        this.mongodb = mongoose.connect;
    }

    static returnSingleton(){
        if(!this.instance){
            this.instance = new UploadFile();
        }
        return this.instance;
    }

    async getAllFiles(){
        try{
            this.mongodb(this.url).catch(err => logger.error("DataBase connection error."));
            const bucket = await getBucket();
            return await bucket.find({}).toArray();
        }catch(err){
            logger.error(err);
            return false;
        }
    }

    async saveDoc(data){
        try{
            this.mongodb(this.url).catch(err => logger.error("DataBase connection error."));
            const newDoc = new Somly(data);
            return await newDoc.save();
        }catch(err){
            logger.error(err);
            return false;
        }
    }

    async updateCookie(id, value){
        try{
            this.mongodb(this.url).catch(err => logger.error("DataBase connection error."));
            const doc = await Somly.findById(id);
            if(doc==null){throw new Error('ID not found')}
            doc["trackID"] = value;
            await doc.save();
            return true;
        }catch(err){
            logger.error(err);
            return false;
        }
    };

    async getDoc(id){
        try{
            this.mongodb(this.url).catch(err => logger.error("DataBase connection error."));
            const doc = await Somly.findById(id);
            if(doc==null){throw new Error('ID not found')}
            return doc;
        }catch(err){
            logger.error(err);
            return false;
        }
    }

    async deleteDoc(id){
        try{
            this.mongodb(this.url).catch(err => logger.error("DataBase connection error."));
            await Somly.findByIdAndDelete(id);
            return true;
        }catch(err){
            logger.error(err);
            return false;
        }
    }

    async deleteDocByFileId(id){
        try{
            this.mongodb(this.url).catch(err => logger.error("DataBase connection error."));
            const doc = await Somly.findOne({fileId: id});
            if(doc==null){throw new Error('ID not found')}
            doc.delete();
            return true;
        }catch(err){
            logger.error(err);
            return false;
        }
    }

    async deleteTrack(id){
        try{
            const bucket = await getBucket();
            await bucket.delete(mongoose.Types.ObjectId(id));
            return true;
        }catch(err){
            logger.error(err);
            return false;
        }
    }
}


module.exports = { 
    UploadFile
};