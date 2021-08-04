// An on/off switch to the logging
const loggingEnabled = true;

// Enforce logging at different levels
const logMessageType = ["debug", "info", "error"];

// bringing logs to a unified map
const logFormatMap = {
    "debug": function (message) {
        console.debug(`[DEBUG] ${message}`)
    },
    "info": function (message) {
        console.info(`[INFO] ${message}`)
    },
    "error": function (message) {
        console.error(`[ERROR] ${message}`)
    }
}

//
// a helper function that invokes logging functions from the map
// defaulting to "debug" log mode
//
function log(message, messageType = "debug") {
    if (loggingEnabled && logMessageType.includes(messageType)) {
        logFormatMap[messageType](message);
    }
    return;
}

module.exports.log = log;