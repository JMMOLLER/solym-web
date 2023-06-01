const { Readable } = require('stream');
const { logger } = require('../../Resources/pino');
const { getBucket } = require('../../Resources/multer');
const { shearchByName } = require('../../Resources/genius-api');

/* POST REQUESTS */

const shearchName = async (req, res) => {
    const results = await shearchByName(req.params.music);
    res.send(results)
};

const uploadFile = async (req, res) => {
    if (!req.file) {
        return res.status(400).send({ message: 'No file uploaded.', code: 400, returnTo: '/' });
    }
    //UPLOAD TRACK TO DB
    const filename = new Date().getTime()+"."+req.file.originalname.split('.').pop();
    const TrackStream = new Readable();

    TrackStream.push(req.file.buffer);
    TrackStream.push(null);


    const bucket = await getBucket();
    let uploadStream = bucket.openUploadStream(filename);

    TrackStream.pipe(uploadStream);

    uploadStream.on('error', () => {
        logger.error("File uploaded error.");
        return res.status(500).json({ message:'Error uploading file.', code: 500, returnTo: '/' });
    });

    uploadStream.on('finish', async() => {
        logger.info("File uploaded successfully.");
        return res.status(200).json({ message:"Stream finished" ,id: uploadStream.id, code: 200, returnTo: '/' })
    });
};

module.exports = {
    uploadFile,
    shearchName
};