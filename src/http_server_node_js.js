const http = require("http");
const url = require("url");

const server = http.createServer(function (req, res) {
    if (req.url === "/favicon.io") {
        return;
    }


    const parseUrl = url.parse(req.url, true);
    console.log("parseUrl", parseUrl);
    res.writeHead(200, { "Content-Type": "text/plain;charset=UTF-8" });

    const data = "{age:27}";
    const str = parseUrl.query.callback + "(" + data + ")"
    res.end(str);
});


server.listen(3002, function () {
    console.log("server is starting on port 3002");
});