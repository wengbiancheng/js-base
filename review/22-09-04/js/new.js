// new的几个步骤
// 1. 建立一个新的Object
// 2. 将新的object的隐形原型指向目前的显示原型
// 3. 进行构建函数的生成
// 4. 返回一个对象或者目前新建的object

const _new = function (...args) {

    const Constructor = args[0];
    const params = args.slice(1);

    const object = new Object();

    object.__proto__ = Constructor.prototype;

    const newObject = Constructor.apply(object, params);

    return typeof newObject === "object" ? newObject : object;
}


// apply
// 传递进来的是(context, paramsArray) 数组参数

const _apply = function () {
    // args是一个数组，...args = a, b, c, d
    // 还有一个潜在的！arguments
    // 将类数组转化为数组的两种方式: Array.prototype.slice.call(arguments) / Array.from(arguments)

    const args = Array.prototype.slice.call(arguments);
    const curContext = args[0];
    const params = args.slice(1) || [];

    const key = Symbol();
    curContext[key] = this; // 转化为传入的this，并且把当前function的内容变为传入this的一个属性

    const result = curContext[key](params);

    // 删除key
    delete curContext[key];

    return result;
}



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