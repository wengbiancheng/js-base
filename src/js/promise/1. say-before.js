// 重写一些原生方法：使用高阶函数，进行AOP面向切片编程
// AOP面向切片编程的作用是把一些跟核心业务逻辑模块无关的功能抽离出来，其实就是给原函数增加一层，不用管原函数内部实现

// 对原生的say进行封装，在调用say之前先调用其它方法
function say(whoA, whoB) {
    console.log("说话", whoA, whoB);
}


// 跟Vue的Object.defineProperty一样，对所有函数进行劫持
Function.prototype.before = function (beforeFunc) {
    // 要注意：这里是剩余运算符，将所有的参数组合成一个数组，只能在最后一个参数里用，args是一个数组
    return (...args) => { // 箭头函数没有this，没有arguments，没有原型，会向上查找，this=function say()

        // 箭头函数里面不能用arguments这个变量啊！
        console.log("args的类型是：" + Object.prototype.toString.call(args));
        beforeFunc();

        // https://babeljs.io中可以查询到
        // 展开运算符，将数组params展开进行一个一个参数传递进去
        this(...args); // 最终ES5会转化为 this(...args) => this.apply(void 0, arguments);
    }
}


let newFn = say.before(function () {
    console.log("说话前");
});


// 演示证明：在参数中...表示剩余参数，只能放在最后一个参数，是一个数组类型
// 在函数体中，...表示展开参数，是将参数一个一个放进去
newFn("我", "数组");