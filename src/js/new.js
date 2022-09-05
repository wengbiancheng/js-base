const _new = function (...args) {

    // 类数组：arguments-> 可以转化为数组
    const Constructor = args[0];
    const params = args.slice(1);

    // 1. 创建一个空的对象
    const object = new Object();


    // 2. 将function的原型链进行继承
    object.__proto__ = Constructor.prototype;

    // 3. 将新创建对象作为this上下文进行执行并且返回一个新的对象
    const newObject = Constructor.apply(object, params);


    // 4. 返回该对象或者返回上面创建的Object
    return typeof newObject === "object" ? newObject : object;
}


const mockApply = function (context, args) {
    // 传递的参数args是一个数组
    context = context || window; // 传入的上下文
    args = args ? args : [];

    // 需不需要判断context是不是对象呢？？因为context.key需要context是一个对象

    const key = Symbol();
    context[key] = this; // this本质上是一个function，就是Array.prototype.slice.apply(object)中 this = Array.prototype.slice

    const result = context[key](args);

    delete context[key];

    return result;
}

const mockCall = function (context, ...args) {
    // 传递的参数args是一个一个传递过来的，也就是 call(this, a, b, c);
    context = context || window;

    // TODO 这里得到的args是参数的数组形式

    // 需不需要判断context是不是对象呢？？因为context.key需要context是一个对象

    const key = Symbol();
    context[key] = this;

    if (arguments === "void 0") {
        delete context[key];
        const result = context[key]();
        return result;
    }

    // TODO 将args数组转化为(a, b, c, d)的形式
    const result = context[key](...args);

    delete context[key];
    return result;
}


Function.prototype.mockBind = function (context) {

    // 基础版本
    var me = this;
    var args = Array.prototype.slice.call(arguments, 1);

    // return function() {
    //     var innerArgs = Array.prototype.slice.call(arguments);
    //     var finalArgs = args.contact(innerArgs);
    //     return me.apply(context, finalArgs);
    // }

    // 进阶版本
    // 就如同之前 this 优先级分析所示：
    // bind 返回的函数如果作为构造函数，搭配 new 关键字出现的话，我们的绑定 this 就需要“被忽略”

    return function newFn() {
        var innerArgs = Array.prototype.slice.call(arguments);
        var finalArgs = args.concat(innerArgs);
        return me.apply(this instanceof newFn ? this : context, finalArgs);
    }
}

function testFn() {
    console.log(this.context);
}

const temp = testFn.mockBind({ context: "xixixi" });
temp();


