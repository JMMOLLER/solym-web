require('dotenv').config({ path: './.env' });
const axios = require('axios');
const APIKEY = process.env.YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3/search';
const { logger } = require('./pino');

async function getVideoId(toSearch) {
    try{
        const response = await axios.get(BASE_URL, {
            params: {
                part: 'snippet',
                q: toSearch,
                type: 'video',
                key: APIKEY,
            }
        })
        return response?.data?.items[0]?.id?.videoId;
    } catch (error) {
        if(error.response.status === 403) logger.warn(error.response.data.error.message)
        else logger.error(error);
        return null;
    }
}

module.exports = { getVideoId };