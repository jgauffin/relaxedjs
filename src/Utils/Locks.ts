class PromiseWrapper {
    constructor() {

    }

    resolve: () => void = function () { };
    reject: (reason: void) => void = function () { };
}

export class Semaphore {

    constructor(private numberOfItems: number, initialCount: number) {
        this.freeItems = initialCount;
    }

    freeItems: number;
    waiters: PromiseWrapper[] = [];

    release(): void {
        if (this.numberOfItems == this.freeItems){
            throw new Error(`Have already freed ${this.freeItems} which is the maximum.`);
        }

        this.freeItems++;

        var promise = this.waiters.shift();
        if (promise) {
            promise?.resolve();
        }

    }

    async wait(): Promise<void> {
        if (this.freeItems > 0) {
            this.freeItems--;
            return;
        }

        var wrapper = new PromiseWrapper();
        var promise = new Promise<void>((reject, resolve) => {
            wrapper.resolve = resolve;
            wrapper.reject = reject;
        });

        this.waiters.push(wrapper);

        await promise;
        this.freeItems--;
        return;
    }
}

export class InitLock {

    constructor() {
    }

    inited = false;
    waiters: PromiseWrapper[] = [];

    release(): void {
        this.inited = true;
        this.waiters.forEach(x=> {
            x.resolve();
        });
    }

    async wait(): Promise<void> {
        if (this.inited) {
            return;
        }

        var wrapper = new PromiseWrapper();
        var promise = new Promise<void>((reject, resolve) => {
            wrapper.resolve = resolve;
            wrapper.reject = reject;
        });

        this.waiters.push(wrapper);

        await promise;
        return;
    }
}
