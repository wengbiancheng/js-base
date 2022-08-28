

function after(times, cb) {
    let school = {};
    return function (key, value) {
        school[key] = value;
        if (--times === 0) {
            cb(school);
        }
    }
}


// 2可以放在一个数组，本质上after就是Promise.all()的思想，也可以运行在一些加载页面，资源的判断上面，等所有都完成，才执行result方法
let out = after(2, function (result) {
    console.log(result);
});

// 类似 异步执行：fs.readFile等等
setTimeout(() => {
    out("name", "name");
}, 2000);


setTimeout(() => {
    out("age", "age");
}, 4000);