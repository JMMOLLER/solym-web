require('dotenv').config({ path: './.env' });
const axios = require('axios');
const { logger } = require('./pino');
const TOKEN = process.env.CLIENT_ACCESS_TOKEN; // CLIENT ACCESS TOKEN
const Genius = require("genius-lyrics"); // DEPENDENCY FOR GENIUS API LYRICS
const Client = new Genius.Client(TOKEN); // CLIENT
const GENIUS = require('genius-api'); // DEPENDENCY FOR GENIUS API SEARCH
const GENIUS_API = new GENIUS(TOKEN);
const { getVideoId } = require("./youtubeAPI");


async function shearchByName(title) {
    const response = await GENIUS_API.search(title)
    return response.hits;
}

async function getInfoByID(id) {
    const info = {};
    try{
        const VIDEO_URL ="https://yewtu.be/latest_version?id=";
        const song = await Client.songs.get(id);
        info.cover = song._raw.song_art_image_url || undefined;
        info.title = song.title || undefined;
        info.artist = song.artist.name || undefined;
        song.album
            ? info.album = song.album.name
            : info.album = song.title;
        if(info.artist) {
            logger.debug('Searching for video URL');
            song._raw.media.forEach(element => {
                if(element.provider === "youtube" && element.type === "video" && element.url) {
                    info.videoURL = VIDEO_URL+element.url.slice(element.url.indexOf("v=")+2,element.url.length);
                }
            });
            if(!info.videoURL) info.videoURL = VIDEO_URL+await getVideoId(`${info.title} ${info.artist}`);
            logger.debug(`Video URL found: ${info.videoURL}`);
        }
        return info;
    }catch(error){
        console.log(error);
        return info;
    }
}

async function selectSong(results, artist, title){
    let bestFound = false;
    for (let i = 0; i < results.length; i++) {
        const CurrentArtist = (results[i].result.primary_artist.name).toLowerCase();
        const CurrentTitle = (results[i].result.full_title).toLowerCase();
        const indexArtist = CurrentArtist === artist.toLowerCase();
        const indexTitle = CurrentTitle === title.toLowerCase();
        if ((indexArtist || indexTitle) && !bestFound) {
            bestFound = true;
            const temp = results[i].result
            results.unshift({best: true,result: temp});
            results.splice(i+1,1);
        }
    }
    return results
}

async function getLyricsByID(id) {
    try{
        const response = await axios.get(`https://api-solym.onrender.com/lyric/${id}`);
        return await response.data;
    }catch(error){
        return {
            error: true,
            msg: error.toString(),
            trackID: id
        };
    }
}

module.exports = {
    searchSong: async(title, artist) => {
        const results = await shearchByName(title);
        return await selectSong(results, artist, title);
    },
    getLyricsByID,
    getInfoByID,
    shearchByName,
}