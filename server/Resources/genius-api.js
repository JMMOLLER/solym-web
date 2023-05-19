require('dotenv').config({ path: './.env' });
const API = process.env.CLIENT_ACCESS_TOKEN; // CLIENT ACCESS TOKEN
const Genius = require("genius-lyrics"); // DEPENDENCY FOR GENIUS API LYRICS
const Client = new Genius.Client(API);
const api = require('genius-api'); // DEPENDENCY FOR GENIUS API SEARCH
const genius = new api(API);
const { getVideoId } = require("./youtubeAPI");


async function shearchByName(title) {
    const response = await genius.search(title)
    return response.hits;
}

async function getInfoByID(id) {
    const info = {};
    try{
        const song = await Client.songs.get(id);
        info.cover = song._raw.song_art_image_url || undefined;
        info.title = song.title || undefined;
        info.artist = song.artist.name || undefined;
        song.album
            ? info.album = song.album.name
            : info.album = song.title;
        if(info.artist) {
            const videoId = await getVideoId(`${info.title} ${info.artist}`);
            videoId ? info.videoURL = "https://yewtu.be/latest_version?id="+videoId : undefined;
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
        const song = await Client.songs.get(id);
        return await song.lyrics();
    }catch(error){
        console.log(error);
        return null;
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