const http = require("http");
const url = require("url");

const server = http.createServer(function (request, response){

    if(request.url === "/favicon.io") {
        return;
    }

    const parseUrl = url.parse(request.url, true);
    response.writeHead(200, {
        "Content-Type": "text/plain;charset=UTF-8"
    });

    const data = "{age: 27}";
    const str = parseUrl.query.callback + "(" + data + ")";
    res.end(str);
});

server.listen(3002, function () {
    console.log("server is starting on port 3002");
});
