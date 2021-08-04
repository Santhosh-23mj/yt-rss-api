const apiService = require("../services/apiService");
const logService = require("../services/logService");

// route handler for returning usage
function handleApiUsage(req, res) {
    try {
        const apiUsage = apiService.getApiUsage();

        res.end(JSON.stringify(apiUsage));
    } catch (err) {
        handleError(err, req, res);
    }
}

// route handler to get videos
async function handleGetVideos(req, res) {
    try {
        const channelIdArr = req.url.split("/");
        const channelId = channelIdArr[channelIdArr.length - 1];

        logService.log(`About to fetch videos for channel id - ${channelId}`);

        if (!channelId) {
            const noChannelIdError = { 
                statusCode: 400, 
                message: "Channel Id not specified" 
            };
            handleError(noChannelIdError);
        }

        const videosOnChannel = await apiService.fetchVideos(channelId);

        logService.log(`Videos for channel - ${channelId} - ${JSON.stringify(videosOnChannel)}`);

        res.end(JSON.stringify(videosOnChannel));
    } catch (err) {
        handleError(err, req, res);
    }
}

// route handler to handle 404
function handleNotFound(req, res) {
    logService.log(`Path not found - ${req.url}`, "info");
    
    res.writeHead(404, "Not found", { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
}

// function to bring error handling to a single location
function handleError(err, req, res) {
    logService.log(`${err}`, "error");
    
    const statusCode = err.statusCode || 500;
    const errorMessage = err.message || "Internal Server Error";

    res.writeHead(statusCode, errorMessage, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: errorMessage }));
}

module.exports.handleApiUsage = handleApiUsage;
module.exports.handleGetVideos = handleGetVideos;
module.exports.handleNotFound = handleNotFound;
