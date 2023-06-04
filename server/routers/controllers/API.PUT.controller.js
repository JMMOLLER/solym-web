const DB = require('../../DB/DAO/SolymDatas.dao').UploadFile.returnSingleton();
const { logger } = require('../../Resources/pino');

const updateCookie = async (req, res) => {
    try {
        const { infoId } = req.cookies['Solym'];
        const { trackID } = req.body;
        const data = await DB.updateCookie(infoId, trackID);
        console.log(infoId, trackID)
        if (!data) {
            return res.status(400).json({ error: 'No data' });
        }
        return res.status(200).json({ message: 'OK' });
    } catch (error) {
        logger.error(error);
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    updateCookie,
};
