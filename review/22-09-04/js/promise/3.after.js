// promise.all的核心代码

function after(times, cb) {
    let school = {};
    return function (key, value) {
        school[key] = value;
        times--;
        if (times === 0) {
            cb && cb(school);
        }
    }
}


let functionArray = after(2, (dataObject) => {
    console.log("执行多次获得", dataObject);
});

setTimeout(() => {
    functionArray("key1", "value1");
}, 2000);

setTimeout(() => {
    functionArray("key2", "value2");
}, 2000);