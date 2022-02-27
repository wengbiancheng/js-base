// 与4.promise-simple.js相比较，
// (1) 这里主要是对多层then的处理，也就是promise.then().then()这种情况的处理：then直接返回一个promise
// (2) 这里是对then(res=> return 新的promise或者普通类型数据)的处理，也就是如果返回普通类型，就直接resolve()
// 如果then里面返回一个new Promise，则后续的then还需要再进行判断(可能有多层promise嵌套的情况)


// ----------------------- Promise -----------------------

const PENDING = "PENDING";
const RESOLVED = "RESOVLED";
const REJECTED = "REJECTED";

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
        // 同步的情况，也就是new Promise中的function执行完成后马上调用then方法
        if (this.status === RESOLVED) {
            onfulfilled(this.value);
        }

        if (this.status === REJECTED) {
            onrejected(this.reason);
        }

        // 异步的情况，也就是new Promise可能没有马上返回resolve/reject，导致状态是pending
        if (this.status === PENDING) {
            this.resolveCallback.push(() => {
                onfulfilled(this.value);
            });

            this.rejectCallback.push(() => {
                onrejected(this.reason);
            });
        }
    }

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