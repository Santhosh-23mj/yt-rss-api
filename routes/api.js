const apiService = require('../services/apiService')

function handleApiUsage(req, res) {
    const apiUsage = apiService.getApiUsage();

    res.end(apiUsage);
}

async function handleGetVideos(req, res) {
    let channelIdArr = req.url.split('/')
    const channelId = channelIdArr[channelIdArr.length-1];

    if (!channelId) {
        const noChannelIdError = {error: true, message: "No channel Id supplied"}
        res.end(JSON.stringify(noChannelIdError));
    }

    const videosOnChannel = await apiService.fetchVideos(channelId);
    res.end(videosOnChannel);
}

function handleNotFound(req, res) {
    res.writeHead(404, "Not found", {"Content-Type": "application/json"});
    res.end(JSON.stringify({"error": "Not found"}));
}

module.exports.handleApiUsage = handleApiUsage;
module.exports.handleGetVideos = handleGetVideos;
module.exports.handleNotFound = handleNotFound;