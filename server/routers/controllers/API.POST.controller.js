const { Readable } = require('stream');
const { getBucket } = require('../../Resources/multer');
const { shearchByName } = require('../../Resources/genius-api');

/* POST REQUESTS */

const shearchName = async (req, res) => {
    const results = await shearchByName(req.params.music);
    res.send(results)
};

const uploadFile = async (req, res) => {
    if (!req.file) {
        return res.status(400).send({error: 'No file uploaded.'});
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
        console.log('\x1b[31m%s\x1b[0m', "File uploaded successfully.");
        return res.status(500).send('Error uploading file.');
    });

    uploadStream.on('finish', async() => {
        console.log('\x1b[32m%s\x1b[0m', "File uploaded successfully.");
        return res.status(200).json({id: uploadStream.id})
    });
};

module.exports = {
    uploadFile,
    shearchName
};