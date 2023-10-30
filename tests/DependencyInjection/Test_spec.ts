import "reflect-metadata";

export interface Type<T> {
    new(...args: any[]): T;
}

export function someDecorator() {
    return function <T>(target: Type<T>) {
        console.log('params', Reflect.getMetadata("design:paramtypes", target));
    };
}

@someDecorator()
export class SomeClass {
    invoke() {
        console.log('hello');
    }
}

describe("Container", () => {

    beforeEach(() => {
        console.log('============================')
    });


    test("reproduce", () => {
        var actual = new SomeClass();


        actual.invoke();

    });
});
