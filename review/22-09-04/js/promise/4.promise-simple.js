const PENDING = "PENDING";
const RESOLVED = "RESOLVED";
const REJECTED = "REJECTED";

class MyPromise {

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

                this.resolveCallback.forEach(fn => {
                    fn && fn(value);
                });
            }
        }

        let rejected = (reason) => {
            if (this.status === PENDING) {
                this.status = REJECTED;
                this.reason = reason;

                this.rejectCallback.forEach(fn => {
                    fn && fn(reason);
                });
            }
        }

        try {
            executor(resolved, rejected);
        } catch (e) {
            rejected(e);
        }
    }


    then(onfulfilled, onrejected) {
        if (this.status === RESOLVED) {
            onfulfilled(this.value);
        }

        if (this.status === REJECTED) {
            onrejected(this.reason);
        }

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