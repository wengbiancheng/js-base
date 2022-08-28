// 防抖(debounce):多次触发，只在最后一次触发时，执行目标函数。
function debounce(fn, wait = 50) {
    let timer = null;

    return function () {
        var args = Array.prototype.slice(arguments);
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }

        timer = setTimeout(() => {
            // this指针是在调用时才能判断是属于谁的作用域
            fn.apply(this, args);
        }, wait);
    }
}


// 简易版本
// 节流（throttle）:限制目标函数调用的频率，比如：1s内不能调用2次。
function throttle(fn, wait = 50) {
    let previous = 0;
    return function () {
        let args = Array.prototype.slice(arguments);
        let now = +new Date();
        if (now - previous > wait) {
            previous = now;
            fn.apply(this, args);
        }
    }
}

// DEMO
// 执行 throttle 函数返回新函数
const betterFn = throttle(() => console.log('fn 函数执行了'), 1000)
// 每 10 毫秒执行一次 betterFn 函数，但是只有时间差大于 1000 时才会执行 fn
setInterval(betterFn, 10)


// 还有复杂版本: underscore
// 配置是否需要响应事件刚开始的那次回调（ leading 参数，false 时忽略）
// 配置是否需要响应事件结束后的那次回调（ trailing 参数，false 时忽略）