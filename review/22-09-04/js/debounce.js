function debounce(fn, wait = 50) {
    let timer = null;

    return function () {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }

        timer = setTimeout(() => {
            fn && fn();
        }, wait);
    }
}


function throttle(fn, wait = 50) {
    let prev = 0;

    return function () {
        // call(this, ...args)第一个参数相当于新的this
        // 因此下面可以变为: arguments.slice()
        let args = Array.prototype.slice.call(arguments);

        console.log("args", args);
        let now = +new Date();
        if (now - prev > wait) {
            prev = now;
            fn && fn.apply(this, args);
        }
    }
}

const readyFn = throttle(() => {
    // 这里的function会在一定时间内执
    console.log("执行了" + new Date().getTime());
}, 1000);

let count = 0;
let temp = setInterval(() => {
    // 只会1秒执行一次
    readyFn(3, 4, 5);
    count++;
    if (count > 100) {
        clearInterval(temp);
    }

}, 10);