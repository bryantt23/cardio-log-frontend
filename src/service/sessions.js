import axios from 'axios'
import iso8601Duration from 'iso8601-duration'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const getSessions = async () => {
    try {
        const sessions = await axios.get(`${BASE_URL}/meditations`)
        return sessions.data
    } catch (error) {
        console.error(error)
        return []
    }
}

export const addSession = async (description, length) => {
    try {
        let postBody = { description, length, finishTime: Date.now() }
        if (description.includes("youtube.com")) {
            const videoId = description.split("v=")[1]
            const youTubeApiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=AIzaSyBRrQmXEXUOOYkXW_sa7Gd5dGJJkEbiT_Q&part=snippet,contentDetails`
            const response = await axios.get(youTubeApiUrl)
            const videoDetails = response.data.items[0];

            const youTubeTitle = videoDetails.snippet.title
            const youTubeDurationISO = videoDetails.contentDetails.duration
            const thumbnailUrl = videoDetails.snippet.thumbnails.default.url

            const durationParsed = iso8601Duration.parse(youTubeDurationISO)
            const durationInSeconds =
                (durationParsed.hours || 0) * 3600 +  // Convert hours to seconds
                (durationParsed.minutes || 0) * 60 +  // Convert minutes to seconds
                (durationParsed.seconds || 0);        // Seconds 

            postBody = {
                ...postBody,
                description: youTubeTitle,
                length: durationInSeconds,
                youTubeUrl: description,
                thumbnailUrl
            }
        }

        await axios.post(`${BASE_URL}/meditations`, postBody)
    } catch (error) {
        console.error(error)
    }
}

export const copySession = async (description, youTubeUrl, length, thumbnailUrl) => {
    try {
        let postBody = { description, youTubeUrl, length, finishTime: Date.now(), thumbnailUrl }
        await axios.post(`${BASE_URL}/meditations`, postBody)
    } catch (error) {
        console.error(error)
    }
}

export const toggleSession = async (id) => {
    try {
        const response = await axios.put(`${BASE_URL}/meditations/${id}/toggleFavorite`)
        return response.data
    } catch (error) {
        console.error("Error toggling session:", error);
        throw error
    }
}