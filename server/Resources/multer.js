const ms = require("ms");
const { GridFSBucket } = require("mongodb");
const { getConnectionURI } = require("../DB/Service/Connection.service");
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
const multer = require("multer");
const storage = multer.memoryStorage({});
const upload = multer({
    storage: storage,
    limits: {
        fields: 1,
        fileSize: 100000000,
        files: 1,
        parts: 5,
    },
});

const getConnection = async() => {
    try{
        await mongoose.connect(getConnectionURI());
        return mongoose.connection.db;
    }catch(err){
        console.log("\x1b[31m%s\x1b[0m","Hubo un error al intentar conectar con la Base de Datos. Reintentando en 1 minuto.");
        await new Promise(resolve => setTimeout(resolve, ms("1m")));
        return await getConnection();
    }
};

module.exports = {
    getBucket: () => {
        return new Promise(async(resolve, reject) => {
            const bucket = new GridFSBucket(await getConnection(), {
                bucketName: "tracks",
            });
            resolve(bucket);
        });
    },
    upload,
    getConnection,
};
