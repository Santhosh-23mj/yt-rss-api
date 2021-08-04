const https = require('https');
const logService = require('./logService');
const { parseString } = require('xml2js');

//
// A simple function to get the Usage of our API
//
function getApiUsage() {
    logService.log(`Requested API Usage`);
    const apiUsage = {
        error: "No Parameters sent",
        usage: "/channel/{{channelId}}",
        description: "Hit the above route with channelId to fetch videos of that specific youtube channel."
    }
    logService.log(`API Usage returned`);
    return apiUsage;
}

//
// function to hit the Youtube RSS feed to fetch XML Data
// params - URL
// returns - XML Response from the URL
//
function getXMLfromUrl(url) {
    return new Promise((resolve, reject) => {
        const httpsRequest = https.get(url, (response) => {
            logService.log(`Got response from the URL - ${url}`);

            if (response.statusCode != 200) {
                logService.log(`Server responded with status - ${response.statusCode}`, "info");
                const serverError = {
                    statusCode: 404,
                    message: "No Channel found for the given Channel Id"
                };
                
                reject(serverError);
                return;
            } 

            let rawData = "";
            response.on('data', function (dataStream) {
                // commenting the below line which pollutes log
                // logService.log(`Listening on data to accumulate the XML data`);
                rawData += dataStream;
            });

            response.on('error', (err) => {
                const responseError = {
                    statusCode: 500,
                    message: err.message
                };
                
                reject(responseError);
                return;
            });

            response.on('end', () => {
                logService.log(`Sending XML Response from server`);

                let unicodeResponse = Buffer.from(rawData);
                resolve(unicodeResponse);
            });
        })

        httpsRequest.on('error', (error) => {
            reject(error);
        })
    })
}

//
// function to convert XML Data into JSON
// params - XML data as String
// returns - JSON extracted from the XML
//
function xmlToJson(xmlData) {
    return new Promise((resolve, reject) => {
        logService.log(`Parsing the XML Data`);

        parseString(xmlData, { trim: true }, (error, jsonFromXml) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(jsonFromXml);
        })
    })
}

//
// function to extract out the videos from extracted JSON
// params - JSON extracted from XML
// returns - array of objects with video titles and links
//
function getVideosFromJson(json) {
    logService.log(`Populating necessary information to send as response`);
    let videos = [];

    const entries = json["feed"]["entry"];

    entries.forEach((video) => {
        let videoObject = {};
        videoObject.title = video.title[0];
        videoObject.link = video.link[0]["$"]["href"];
        videos.push(videoObject);
    })

    return videos;
}

//
// function fetches videos from the given ChannelId and returns JSON
// params - channelId
// returns - Array of objects with videos and links 
//
function fetchVideos(channelId) {
    return new Promise(async (resolve, reject) => {
        try {
            const rssFeedUrl = "https://www.youtube.com/feeds/videos.xml?channel_id=" + channelId;
            logService.log(`URL to fetch Videos from - ${rssFeedUrl}`);

            const xmlResponse = await getXMLfromUrl(rssFeedUrl);
            logService.log(`Got XML Response from the URL - ${rssFeedUrl}`);

            const jsonResponse = await xmlToJson(xmlResponse);
            logService.log(`Parsed the XML into JSON`);

            const videos = getVideosFromJson(jsonResponse);
            logService.log(`Constructed the response to send`);
    
            resolve(videos);
        } catch (err) {
            reject(err);
        }
    })
}

module.exports.getApiUsage = getApiUsage;
module.exports.fetchVideos = fetchVideos;