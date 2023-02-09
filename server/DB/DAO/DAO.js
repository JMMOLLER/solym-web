const mongoose = require('mongoose');
const Somly = require('../models/schema.requests');
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

    async saveDoc(data){
        try{
            this.mongodb(this.url);
            const newDoc = new Somly(data);
            return await newDoc.save();
        }catch(err){
            console.log(err);
            return false;
        }
    }

    async getDoc(id){
        try{
            this.mongodb(this.url);
            const doc = await Somly.findById(id);
            if(doc==null){throw new Error('ID not found')}
            return doc;
        }catch(err){
            console.log(err);
            return false;
        }
    }

    async deleteDoc(id){
        try{
            this.mongodb(this.url);
            await Somly.findByIdAndDelete(id);
            return true;
        }catch(err){
            console.log(err);
            return false;
        }
    }

    async deleteTrack(id){
        try{
            const bucket = await getBucket();
            await bucket.delete(mongoose.Types.ObjectId(id));
            return true;
        }catch(err){
            console.log(err);
            return false;
        }
    }
}


module.exports = { 
    UploadFile
};