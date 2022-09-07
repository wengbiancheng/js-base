function say(whoA, whoB) {
    console.log("现在说话的人是", whoA, whoB);
}


Function.prototype.before = function (beforeFn) {
    return () => {
        const args = Array.prototype.slice.call(arguments);

        beforeFn && beforeFn();

        this(...args);
    }
}


const newFn = say.before(function () {
    // 说话前调用的参数，进行参数的处理
    console.log("说话前处理参数中...");
});


newFn("我", "他");