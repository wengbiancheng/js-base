// AOP的高阶函数的应用，跟setState类似的原理，传入一个核心函数，然后执行其它wrapper，一种比较常用的编程思想
function perform(anyMethod, wrappers) {

    return function () {
        wrappers.forEach(wrapper => wrapper.init());
        anyMethod();
        wrappers.forEach(wrapper => wrapper.close());
    }
}



let newFn = perform(function () {
    // 主要的核心代码，先执行wrapper1:init-> wrapper2:init -> 核心代码 -> wrapper1: close -> wrapper2: close
}, [
    // wrapper1
    {
        init() { },
        close() { }
    },
    // wrapper2
    {
        init() { },
        close() { }
    }
]);