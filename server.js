const http = require('http');

const port = process.env.PORT || 8000;

const route = require('./routes/api');

const server = http.createServer((req, res) => {
    res.setHeader("Content-Type", "application/json");

    if (req.url === "/") {
        return route.handleApiUsage(req, res);
    }

    if (req.url.match(/^\/channel\/.*/)) {
        return route.handleGetVideos(req, res);
    }

    return route.handleNotFound(req, res);
})

server.listen(port, () => {
    console.info(`[INFO] Listening on - ${port}`);
})