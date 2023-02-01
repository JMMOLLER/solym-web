const mongoose = require('mongoose');
const Symly = require('../models/schema.requests');
const { getBucket } = require('../../multer');
let db;

class UploadFile {

    instance
    constructor(){
        this.url = process.env.MONGODB_URI;
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
            const newDoc = new Symly(data);
            return await newDoc.save();
        }catch(err){
            console.log(err);
            return false;
        }
    }

    async getDoc(id){
        try{
            this.mongodb(this.url);
            const doc = await Symly.findById(id);
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
            await Symly.findByIdAndDelete(id);
            return true;
        }catch(err){
            console.log(err);
            return false;
        }
    }

    async deleteTrack(id){
        try{
            const bucket = await getBucket();
            bucket.delete(mongoose.Types.ObjectId(id), (err) => {
                if(err){
                    console.log(err);
                    return false;
                }
            });
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