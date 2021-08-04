const http = require('http');

const route = require('./routes/api');

const port = process.env.PORT || 8000;

const server = http.createServer((req, res) => {
    res.setHeader("Content-Type", "application/json");

    if (req.url === "/") {
        return route.handleApiUsage(req, res);
    }

    if (req.url.match(/^\/channel\/.*/)) {
        return route.handleGetVideos(req, res);
    }

    return route.respondNotFount(req, res);
})

server.listen(port, () => {
    console.log(`Listening on - ${port}`);
})