function ajaxGet(url) {

    return new Promise(function (resolve, reject) {
        const xmlHttpRequest = new XMLHttpRequest();
        xmlHttpRequest.open("GET", url);

        xmlHttpRequest.onreadystatechange = function (name) {
            if (xmlHttpRequest.readyState === 4) {
                if (xmlHttpRequest.status === 200) {
                    resolve(xmlHttpRequest.responseText);
                } else if (xmlHttpRequest.status === 404) {
                    reject("404 NOT FOUND");
                }
            }
        }


        xmlHttpRequest.send(null);
    });

}

function ajaxPost(url, email, password) {
    var xhr = new XMLHttpRequest();
    var data = "email=" + encodeURIComponent(email) + "&password=" + encodeURIComponent(password);
    xhr.open("POST", "http://www.example.com", true);

    xhr.onreadystatechange = function (name) {
        if (xmlHttpRequest.readyState === 4) {
            if (xmlHttpRequest.status === 200) {
                resolve(xmlHttpRequest.responseText);
            } else if (xmlHttpRequest.status === 404) {
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
        if (xmlHttpRequest.readyState === 4) {
            if (xmlHttpRequest.status === 200) {
                resolve(xmlHttpRequest.responseText);
            } else if (xmlHttpRequest.status === 404) {
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

