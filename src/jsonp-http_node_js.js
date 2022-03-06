// 本地服务器手写

var http = require('http');
http.createServer(function (req, res) {
    // req url  callback=?
    console.log(req.url); //结果： /?a=1&callback=callback
    let data = { a: 1 };
    res.writeHead(200, { 'Content-type': 'text/json' })
    const reg = /callback=([\w]+)/
    if (reg.test(req.url)) {
        let padding = RegExp.$1
        res.end(`${padding}(${JSON.stringify(data)})`)
    } else {
        res.end(JSON.stringify(data));
    }

    res.end(JSON.stringify(data));
}).listen(3000);

function jsonp(url, data = {}, callback = 'callback') {
    //处理json对象，拼接url
    data.callback = callbak
    let params = []
    for (let key in data) {
        params.push(key + '=' + data[key])
    }
    let script = document.creatElement('script')
    script.src = url + '?' + params.join('&')
    document.body.appendChild(script)

    //返回Promise
    return new Promise((resolve, reject) => {
        window[callback] = (data) => {
            try {
                resolve(data)
            } catch (e) {
                reject(e)
            } finally {
                //移除script元素
                script.parentNode.removeChild(script)
                console.log(script)
            }
        }
    })
}

//请求数据
jsonp('http://photo.sina.cn/aj/index', {
    page: 1,
    cate: 'recommend',
}, 'jsoncallback').then(data => {
    console.log(data)
})


