const http = require('http');

function getApiUsage() {
    const usage = {
        error: "No Parameters sent",
        usage: "/channel/{{channelId}}",
        description: "Hit the above route with channelId to fetch videos of the channel."
    }
    return JSON.stringify(usage);
}

function fetchVideos(channelId) {
    return new Promise(async (resolve, reject) => {
        const response = {
            "error": false,
            "success": channelId
        }

        const xmlResponse = await new Promise((resolve, reject) => {
            http.get("http://www.youtube.com/feeds/videos.xml?channel_id=UCTl3QQTvqHFjurroKxexy2Q", (res) => {
                let data = "";
                res.on('data', function (stream) {
                    data += stream;
                });
                resolve(data);
            })
        })

        console.log(Buffer.from(xmlResponse));
        resolve(xmlResponse);
    })
}

module.exports.getApiUsage = getApiUsage;
module.exports.fetchVideos = fetchVideos;