// 转化为数组后，参数塞入也需要转化为a,b,c,d的模式
const _call = function () {
    const args = Array.from(arguments); // 传入的参数是 (this, 参数数组)
    const Context = args[0] || window;  // 记得可能为空
    const params = args.slice(1);


    const key = Symbol();
    Context[key] = this;

    if (arguments === "void 0") {
        const result = Context[key]();
        delete Context[key];
        return result;
    }


    const result = Context[key](...params);
    delete Context[key];
    return result;
}



// bind函数：传入一个this，改变整个指向，但是只返回一个function，等待合适的时机再进行调用
const _bind = function () {
    const args = Array.from(arguments);
    const Context = args[0];
    const params = args.slice(1);

    const me = this;

    // 考虑bind之后的函数可能会被new()，因此我们需要更改下逻辑，进行this指针的判断
    return function newFn() {
        var innerArgs = Array.prototype.slice.call(arguments);
        var finalArags = params.concat(innerArgs);
        return me.apply(this instanceof newFn ? this : Context, finalArags);
    }
}