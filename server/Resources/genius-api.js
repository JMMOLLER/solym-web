require('dotenv').config({ path: './.env' });
// CLIENT ACCESS TOKEN
const API = process.env.CLIENT_ACCESS_TOKEN;
//DEPENDENCY FOR GENIUS API LYRICS
const Genius = require("genius-lyrics");
const Client = new Genius.Client(API);
//DEPENDENCY FOR GENIUS API SEARCH
const api = require('genius-api');
const genius = new api(API);


async function shearchByName(title) {
    const response = await genius.search(title)
    return response.hits;
}

async function getInfoByID(id) {
    const info = {};
    try{
        const song = await Client.songs.get(id);
        info.cover = song.image || undefined;
        info.title = song.title;
        info.artist = song.artist.name;
        song.album
            ? info.album = song.album.name
            : info.album = song.title;
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