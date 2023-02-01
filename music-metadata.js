const Metadata = require("musicmetadata");

async function getMetadata(file) {
    return new Promise((resolve, reject) => {
        Metadata(file, function (err, metadata) {
            if (err) reject(err);
            resolve(metadata);
        });
    });
}

module.exports = {
    getMetadata
}