const metadata = require("music-metadata");

async function getMetadata(file) {
    return new Promise(async(resolve, reject) => {
        try{
            const parser = await metadata.parseStream(file);
            return resolve(parser.common);
        }catch(err){
            return reject(err);
        }
    });
}

module.exports = {
    getMetadata
}