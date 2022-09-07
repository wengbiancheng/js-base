function perform(anyMethod, wrappers) {
    return () => {
        const args = Array.prototype.slice.call(arguments);

        wrappers.forEach((item) => item.init());
        anyMethod(...args);
        wrappers.forEach((item) => item.close());
    }
}


let newFn = perform(function () {
    // 核心代码执行！
}, [
    {
        init() {
            console.log("插件1初始化");
        },
        close() {
            console.log("插件1关闭");
        }
    },
    {
        init() {
            console.log("插件2初始化");
        },
        close() {
            console.log("插件2关闭");
        }
    }
]);

