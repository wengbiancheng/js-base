function ajaxGet(url) {

    return new Promise(function (resolve, reject) {
        const xmlHttpRequest = new XMLHttpRequest();
        // readyState = 0;代理被创建，但尚未调用 open() 方法。
        xmlHttpRequest.open("GET", url);

        xmlHttpRequest.onreadystatechange = function (name) {
            // readyState = 3;下载中； responseText 属性已经包含部分数据。
            // readyState = 4;下载操作已完成。
            if (xmlHttpRequest.readyState === 4) {
                if (xmlHttpRequest.status === 200) {
                    resolve(xmlHttpRequest.responseText);
                } else if (xmlHttpRequest.status === 404) {
                    reject("404 NOT FOUND");
                }
            }
        }


        // readyState = 1;open() 方法已经被调用。
        xmlHttpRequest.send(null);
        // readyState = 2;send() 方法已经被调用，并且头部和状态已经可获得。
    });

}

function ajaxPost(url, email, password) {
    var xhr = new XMLHttpRequest();
    var data = "email=" + encodeURIComponent(email) + "&password=" + encodeURIComponent(password);
    xhr.open("POST", "http://www.example.com", true);

    xhr.onreadystatechange = function (name) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                resolve(xhr.responseText);
            } else if (xhr.status === 404) {
                reject("404 NOT FOUND");
            }
        }
    }


    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(data);
}

function ajaxPost(url, email, password) {
    var xhr = new XMLHttpRequest();
    var data = {
        email: email,
        password: password
    }
    xhr.open("POST", url, true);

    xhr.onreadystatechange = function (name) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                resolve(xhr.responseText);
            } else if (xhr.status === 404) {
                reject("404 NOT FOUND");
            }
        }
    }


    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Content-Length", JSON.stringify(data).length);
    xhr.send(JSON.stringify(data));
}


ajaxGet("https://www.jianshu.com/p/2b437e088980").then(res => {
    console.log("GET发送成功", res);
}).catch(error => {
    console.error("失败", error);
});

