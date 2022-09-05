function ajaxGet(url) {


    return new Promise(function (resolve, reject) {

        // readyState = 0;代理被创建，但是尚未调用open()方法
        const xmlHttpRequest = new XMLHttpRequest();

        xmlHttpRequest.open("GET", url);

        // readyState = 1; open()方法已经被调用

        xmlHttpRequest.onreadystatechange = function (name) {
            // readyState=3 下载中
            // reasponseText属性已经包含部署数据
            // readyState=4 下载操作已经完成
            if (xmlHttpRequest.readyState === 4) {
                if (xmlHttpRequest.status === 200) {
                    resolve(xmlHttpRequest.responseText);
                } else if (xmlHttpRequest.status === 404) {
                    reject("404 NOT FOUND");
                }
            }
        }

        xmlHttpRequest.send(null);
        // readyState = 2; send()方法已经被调用，并且头部和状态已经可以获得
    });
}


function ajaxPost(url, email, password) {
    const xmlHttpRequst = new XMLHttpRequest();
    // readyState=0；代理已经被创建，但是尚未调用open()方法

    xmlHttpRequest.open("POST", url, true);

    // readyState=1; open()方法已经被调用

    xmlHttpRequst.onreadystatechange = function (name) {
        // readyState=3；请求已经发送，下载中
        if (xmlHttpRequst.readyState === 4) {
            // readyState=4; 请求已经完成
            if (xmlHttpRequst.status === 200) {
                resolve(xmlHttpRequst.responseText);
            } else if (xmlHttpRequst.status === 404) {
                reject("404 NOT FOUND");
            }
        }
    }

    const data = "email=" + encodeURIComponent(email) + "&password=" + encodeURIComponent(password);
    xmlHttpRequst.setRequestHeader("Content-Type", "application/x-www-form-ulrencoded");
    xmlHttpRequst.send(data);

    // readyState=2; send()方法已经被调用
}


function ajaxPostJSON(url, name, password) {

    const xhr = new XMLHttpRequest();
    // readyState=0
    xhr.open("POST", url, true);
    // readyState=1

    xhr.onreadystatechange = function (name) {
        // readyState=3

        // readyState=4
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                resolve(xhr.responseText);
            } else if (xhr.staus === 404) {
                reject("404 NOT FOUND");
            }
        }
    }


    const data = JSON.stringify({
        name, password
    });
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Content-Length", JSON.stringify(data).length);

    xhr.send(data);
    // readyState=2
} 