const DB = require('../../DB/DAO/SolymDatas.dao').UploadFile.returnSingleton();
const { logger } = require('../../Resources/pino');

/* DELETE REQUESTS */

const deleteRoute = async(req, res) => {
    logger.debug("Request to "+req.originalUrl+" from "+req.ip+" with "+req.method+" method");
    const data = await DB.getDoc(req.cookies['Solym'].infoId); // Get cookieInfo from DB
    if(!data){
        return res.status(400).json({error: 'No data'}); // If cookieInfo not found, return error
    }
    // Delete cookieInfo from DB
    if(await DB.deleteDoc(data._id)){
        logger.info("File Cookie deleted successfully."); // If cookieInfo deleted successfully, log it
    }else{
        logger.warn("File Cookie not found..."); // If cookieInfo not found, log it
    }
    // Delete file and chunks from DB
    if(await DB.deleteTrack(data.fileId)){
        logger.info("File deleted successfully."); // If file and chunks deleted successfully, log it
        res.status(200).json({message: "File deleted successfully."}) // If file and chunks deleted successfully, return message
    }else{
        logger.error("Error deleting file..."); // If file and chunks not found, log it
        res.status(500).json({message: "Error deleting file."}); // If file and chunks not found, return error
    }
};

const deleteByID = async(req, res) => {
    logger.debug("Request to "+req.originalUrl+" from "+req.ip+" with "+req.method+" method");
    if(await DB.deleteTrack(req.params.id)){
        await DB.deleteDocByFileId(req.params.id); // Delete cookieInfo from DB
        logger.info("File deleted successfully."); // If file and chunks deleted successfully, log it
        res.status(200).json({message: "File deleted successfully."}); // If file and chunks deleted successfully, return message
    }else{
        logger.error("Error deleting file..."); // If file and chunks not found, log it
        res.status(500).json({message: "Error deleting file."}); // If file and chunks not found, return error
    }
};

module.exports = {
    deleteRoute,
    deleteByID,
};