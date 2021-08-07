# yt-rss-api

A Simple Node.js API which fetches Youtube RSS Feed as XML and returns videos as JSON.
    - route
        - /channel/{{channelId}}

Hitting the above route with curl / postman will return an array of objects
```
    [
        {
            title: "Video Title",
            link: "Link to the Video" 
        }
    ]
```
This Project is done without using Express / other frameworks for serving / routing. 
Node's default HTTP module is used for those purposes.

This also explains the layer seperation in the request - response cycle
```
Request  => API Route -> Service
Response => Service   -> API Route
```

We use the xml2js, a popular library to parse XML data, to parse the feed fetched from the URL.