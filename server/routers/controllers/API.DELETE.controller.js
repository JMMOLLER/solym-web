const { UploadFile } = require('../../DB/DAO/DAO');
const DB = UploadFile.returnSingleton();

/* DELETE REQUESTS */

const deleteRoute = async(req, res) => {
    const data = await DB.getDoc(req.cookies['Symly'].infoId);
    if(!data){
        return res.status(400).json({error: 'No data'});
    }
    // Delete cookieInfo from DB
    if(await DB.deleteDoc(data._id)){
        console.log('\x1b[31m%s\x1b[0m', "File Cookie deleted successfully.");
    }else{
        console.log('\x1b[31m%s\x1b[0m', "File Cookie not found...");
    }
    // Delete file and chunks from DB
    if(await DB.deleteTrack(data.fileId)){
        console.log('\x1b[31m%s\x1b[0m', "File deleted successfully.");
        res.status(200).json({message: "File deleted successfully."})
    }else{
        console.log('\x1b[31m%s\x1b[0m', "Error deleting file...");
        res.status(500).json({message: "Error deleting file."});
    }
};

const deleteByID = async(req, res) => {
    if(await DB.deleteTrack(req.params.id)){
        await DB.deleteDocByFileId(req.params.id);
        console.log('\x1b[31m%s\x1b[0m', "File deleted successfully.");
        res.status(200).json({message: "File deleted successfully."});
    }else{
        console.log('\x1b[31m%s\x1b[0m', "Error deleting file...");
        res.status(500).json({message: "Error deleting file."});
    }
};

module.exports = {
    deleteRoute,
    deleteByID,
};