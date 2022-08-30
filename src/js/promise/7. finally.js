// 如果放的是普通值，会将这个
// Promise.resolve(1).then(data => {
//     console.log("得到的值是", data);
// });


// function returnPromise() {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             resolve("promise resolve测试");
//         }, 2000);
//     });
// }
// Promise.resolve(returnPromise()).then(data => {
//     console.log("resolve promise 得到的值是", data);
// });


// Promise.resolve 和 Promise.reject
// Promise.race 、Promise.catch 、Promise.try方法



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

function isPromise(p) {
    if (typeof p === "object" && p !== null || typeof p === "function") {
        if (typeof p.then === "function") {
            return true;
        }
    }

    return false;
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
            // value也有可能是promise呀！
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



// 下面多个函数的正确写法应该是变成MyPromise的static方法，如果使用使用ES5，就是下面这些写法，即
// function Person(name,age) {
// //构造函数里面的方法和属性
//         this.name=name;
//         this.age=age;
//         this.run=function(){
//             console.log(`${this.name}---${this.age}`)
//         }
// }
// //原型链上面的属性和方法可以被多个实例共享
// Person.prototype.sex='男';
// Person.prototype.work=function(){
//         console.log(`${this.name}---${this.age}---${this.sex}`);
//     }
// //静态方法
// Person.setName=function(){
//         console.log('静态方法');
// }
MyPromise.all = function (array) {
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

MyPromise.resolve = function (cb) {
    return new MyPromise((resolve, reject) => {
        resolve(cb);
    });
}

MyPromise.reject = function (cb) {
    return new MyPromise((resolve, reject) => {
        reject(cb);
    });
}

// 多个请求，哪个执行比较快就使用哪一个
MyPromise.race = function (array) {

    return new MyPromise((resolve, reject) => {
        for (let i = 0; i < array.length; i++) {
            let itemPromise = array[i];
            itemPromise.then(res => {
                return resolve(res);
            }, (error) => {
                return reject(error);
            });
        }
    });

}

// then(resolve, reject).catch()中catch的实现
MyPromise.catch = function (cb) {
    // this表示的是promise
    // 由于catch后面还可能跟.then().catch()等，因此得返回一个promise

    // then()方法中，如果status===pending，就会调用现在的cb()，如果已经被then(xx, reject)的reject捕获，就不会执行catch
    return this.then(null, cb);
}

// 无论执行then还是catch，都会执行finally方法
MyPromise.finally = function (cb) {
    return this.then((res) => {
        MyPromise.resolve(cb()).then(() => res);
    }, (error) => {
        // 这里是不是要catch呢？？
        // 可能是finally只是一个then或者catch的中转，最终finally前面是then还是catch，finally后面就是前面一样的then和catch，因此直接MyPromise.resolve(cb()).then即可
        MyPromise.resolve(cb()).then(() => { throw error; })
    });
}

// 使用nectTick代替setTimeout，因为真实Promise是微任务
const nextTick = (fn) => {
    if (process !== undefined && typeof process.nextTick === "function") {
        // node.js环境
        return process.nextTick(fn);
    } else {
        // 浏览器环境，用MutationObserver实现浏览器上的nextTick
        let counter = 1;
        const observer = new MutationObserver(fn);
        let textNode = document.createTextNode(String(counter));

        observer.observe(textNode, {
            characterData: true,
        });
        counter += 1;
        textNode.data = String(counter);
    }
}