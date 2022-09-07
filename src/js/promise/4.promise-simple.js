// 实现基础的then、catch以及是三个状态


// ----------------------- Promise -----------------------

const PENDING = "PENDING";
const RESOLVED = "RESOVLED";
const REJECTED = "REJECTED";

class MyPromise {
    // 三种状态
    // 处理同步和异步的情况


    constructor(executor) {

        this.status = PENDING;
        // 为了executor方法马上执行，也就是同步的情况能够马上回调接口，传输数据value
        this.value = undefined;
        // 为了executor方法马上执行，也就是同步的情况能够马上回调接口，传输数据value
        this.reason = undefined;

        this.resolveCallback = [];
        this.rejectCallback = [];

        let resolved = (value) => {
            if (this.status === PENDING) {
                this.status = RESOLVED;
                this.value = value;

                this.resolveCallback.forEach(fn => fn(value));
            }
        }

        let rejected = (reason) => {
            if (this.status === PENDING) {
                this.status = REJECTED;
                this.reason = reason;

                this.rejectCallback.forEach(fn => fn(reason));
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
            this.resolveCallback.push((value) => {
                onfulfilled(value);
            });

            this.rejectCallback.push((reason) => {
                onrejected(reason);
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