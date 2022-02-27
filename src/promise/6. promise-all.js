// 与4.promise-simple.js相比较，
// (1) 这里主要是对多层then的处理，也就是promise.then().then()这种情况的处理：then直接返回一个promise
// (2) 这里是对then(res=> return 新的promise或者普通类型数据)的处理，也就是如果返回普通类型，就直接resolve()
// 如果then里面返回一个new Promise，则后续的then还需要再进行判断(可能有多层promise嵌套的情况)

// 与5.promise-then.js相比较，
// (1) 


// ----------------------- Promise -----------------------

const PENDING = "PENDING";
const RESOLVED = "RESOVLED";
const REJECTED = "REJECTED";

function commonResolve(promise2, x, resolve, reject) {

    if (promise2 === x) {
        // 避免形成 let promise2 = xxx.then(()=> return promise2)的循环嵌套情况
        return reject(new TypeError("Chaining cycle detected for promise #<Promise>"));
    }

    if (typeof x === "object" && x !== null || typeof x === "function") {
        // 内部测试时，成功和失败会同时调用，因此得阻止不同状态的变化
        let called;
        try {
            let then = x.then;
            if (typeof then !== "function") {
                // then的两个params就是onfulfilled, onrejected两个函数
                then.call(x, (y) => {
                    // resolve(y); // 考虑可能存在y也是一个Promise的情况，因此得递归
                    if (called) {
                        return;
                    }
                    called = true;
                    commonResolve(promise2, y, resolve, reject);
                }, (r) => {
                    if (called) {
                        return;
                    }
                    called = true;
                    reject(r);
                });
            } else {
                // then不是function就是object，如果是object，直接返回结果
                resolve(x);
            }
        } catch (e) {
            // 为了兼容，可能有些人的then是通过Object.defineProperty定义的get然后get方法返回错误，会报错，直接返回reject
            if (called) {
                return;
            }
            called = true;
            reject(e);
        }
    } else {
        // 基本类型
        resolve(x);
    }

}

class MyPromise {
    // 三种状态
    // 处理同步和异步的情况


    constructor(executor) {

        this.status = PENDING;
        this.value = undefined;
        this.reason = undefined;

        this.resolveCallback = [];
        this.rejectCallback = [];

        let resolved = (value) => {
            if (this.status === PENDING) {
                this.status = RESOLVED;
                this.value = value;

                this.resolveCallback.forEach(fn => fn());
            }
        }

        let rejected = (reason) => {
            if (this.status === PENDING) {
                this.status = REJECTED;
                this.reason = reason;

                this.rejectCallback.forEach(fn => fn());
            }
        }

        try {
            executor(resolved, rejected);
        } catch (e) {
            rejected(e)
        }

    }


    then(onfulfilled, onrejected) {
        // 可选类型，如果是 p.then().then(function(data){})要将p的值传递给第二个then
        onfulfilled = (typeof onfulfilled === "function") ? onfulfilled : (data) => { return data };
        onrejected = (typeof onrejected === "function") ? onrejected : (error) => { return error };

        let promise2 = new MyPromise((resolve, reject) => {
            // 同步的情况，也就是new Promise中的function执行完成后马上调用then方法
            if (this.status === RESOLVED) {

                // 异步处理为了拿到promise2这个对象
                setTimeout(() => {
                    // 根promise进行resolve()的调用
                    let x = onfulfilled(this.value); // 返回的可能是一个promise,使用公共的方法处理
                    commonResolve(promise2, x, resolve, reject);
                }, 0);

            }

            if (this.status === REJECTED) {

                // 根promise进行reject()的调用
                onrejected(this.reason);
            }

            // 异步的情况，也就是new Promise可能没有马上返回resolve/reject，导致状态是pending
            if (this.status === PENDING) {
                this.resolveCallback.push(() => {
                    // 异步处理为了拿到promise2这个对象
                    setTimeout(() => {
                        // 由于error不能在异步中捕获，因此还需要再加个try-catch
                        try {
                            // 根promise进行resolve()的调用
                            let x = onfulfilled(this.value); // 返回的可能是一个promise,使用公共的方法处理
                            commonResolve(promise2, x, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    }, 0);
                });

                this.rejectCallback.push(() => {
                    onrejected(this.reason);
                });
            }
        });


        return promise2;
    }

}

const isPromise = (p) => {
    if (typeof p === "object" && p !== null || typeof p === "function") {
        if (typeof p.then === "function") {
            return true;
        }
    }

    return false;
}

MyPromise.prototype.all = function (array) {
    return new MyPromise((resolve, reject) => {
        let results = [];
        let index = 0;
        function processData(key, value) {
            index++;
            results[key] = value;
            if (index === array.length) {
                resolve(results);
            }
        }

        for (let i = 0; i < array.length; i++) {
            let itemPromise = array[i];
            if (isPromise(itemPromise)) {
                itemPromise.then((data) => {
                    processData(i, data);
                }, reject);
            } else {
                processData(i, itemPromise);
            }
        }
    });
}

// ----------------------- Promise -----------------------




let promise = new MyPromise((resolve, reject) => {
    // setTimeout(() => {
    //     reject("33")
    // }, 1000);

    // reject("33");

    // a.b.c = 1;

});

promise.then(data => {
    console.log(data);
}, err => {
    console.log("err", err);
});

promise.then(data => {
    console.log(data);
}, err => {
    console.log("err", err);
});

promise.then(data => {
    console.log(data);
}, err => {
    console.log("err", err);
});