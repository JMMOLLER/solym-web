const { UploadFile } = require('../../DB/DAO/DAO');
const DB = UploadFile.returnSingleton();

/* DELETE REQUESTS */

const deleteRoute = async(req, res) => {
    const data = await DB.getDoc(req.cookies['Symly'].infoId);
    if(!data){
        return res.status(400).json({error: 'No data'});
    }
    await DB.deleteDoc(data._id);
    await DB.deleteTrack(data.fileId)
        ? res.status(200).json({message: "File deleted successfully."})
        : res.status(500).json({message: "Error deleting file."});
};

const deleteByID = async(req, res) => {
    if(await DB.deleteTrack(req.params.id)){
        await DB.deleteDocByFileId(req.params.id);
        res.status(200).json({message: "File deleted successfully."});
    }else{
        res.status(500).json({message: "Error deleting file."});
    }
};

module.exports = {
    deleteRoute,
    deleteByID,
};