const { GridFSBucket } = require('mongodb');
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

const multer = require('multer');
const storage = multer.memoryStorage({});
const upload = multer({ 
    storage: storage,
    limits: { 
        fields: 1,
        fileSize: 100000000,
        files: 1,
        parts: 5
    }
});


mongoose.connect(process.env.MONGODB_URI, (err) => {
    if(err){
        console.log(err);
        process.exit(0);
    }
    db = mongoose.connection.db;
    console.log('\x1b[35m%s\x1b[0m','Conexión establecida con la Base de Datos')
});

const getConnection = () => db;


module.exports = {
    getBucket: () => {
        return new Promise((resolve, reject) => {
            const bucket = new GridFSBucket(getConnection(), {
                bucketName: 'tracks'
            });
            resolve(bucket);
        });
    },
    upload,
    getConnection
}