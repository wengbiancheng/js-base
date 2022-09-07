const http = require("http");
const url = require("url");


const server = http.createServer(function (request, response) {
    // 如果是请求网站的图片，直接返回
    if (request.url === "/favicon.io") {
        return;
    }

    // response写入常见的head
    response.writeHead(200, {
        "Content-Type": "text/plain;charset=UTF-8"
    });

    // 拼接数据
    const parseUrl = url.parse(request.url, true);
    const returnData = JSON.stringify({
        age: 23
    });
    const str = parseUrl.query.callback + `(${returnData})`;

    // response返回数据
    response.end(str);
});

server.listen(3002, function () {
    console.log("server is running in 3002");
});