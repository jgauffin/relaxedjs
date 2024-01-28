import { GotParent, ProxyValueHandler, configuration, isProxy } from "../../src/Objects/ProxyTools";

class ProxyHandlerStub implements GotParent{
    parentThatGotSet: GotParent|undefined;

    set parent(value: GotParent) {
        this.parentThatGotSet=value;
    }
}

configuration.DefaultObjectProxyHandler = (value: any, path: string) => new ProxyHandlerStub();

describe("ProxyValueHandler", () => {

    test("that a proxy is created for an accessed property.", () => {
        var obj = {address: {city: 'Falun'}};
        var parent = new ProxyHandlerStub();
        var sut = new ProxyValueHandler(parent, '');
        var prop = sut.get(obj, 'address');

        var actual = prop.isProxy;

        expect(actual).toBeTruthy();
    });

    test("that a proxy is not created for an accessed property of primitive type.", () => {
        var obj = {age: 10};
        var parent = new ProxyHandlerStub();
        var sut = new ProxyValueHandler(parent, '');

        var prop = sut.get(obj, 'age');

        expect(prop.isProxy).toBeFalsy();
    });

    test("that a proxy is not wrapped in another proxy.", () => {
        var obj = {address: {city: 'Falun'}};
        var parent = new ProxyHandlerStub();
        var sut = new ProxyValueHandler(parent, '');

        var prop1 = sut.get(obj, 'address');
        var prop2 = sut.get(obj, 'address');

        expect(prop2).toBe(prop1);
    });

    test("that a proxy returns true on proxy query.", () => {
        var obj = {address: {city: 'Falun'}};
        var parent = new ProxyHandlerStub();
        var sut = new ProxyValueHandler(parent, '');

        var actual = sut.get(obj, isProxy);

        expect(actual).toBeTruthy();
    });

    test("that setting the same value doesn't trigger change.", () => {
        var obj = {age: 10};
        var parent = new ProxyHandlerStub();
        var sut = new ProxyValueHandler(parent, '');

        var actual = sut.set(obj, 'age', 10);

        expect(actual).toBeFalsy();
    });

    test("that setting a new value trigger change.", () => {
        var obj = {age: 10};
        var parent = new ProxyHandlerStub();
        var sut = new ProxyValueHandler(parent, '');

        var actual = sut.set(obj, 'age', 11);

        expect(actual).toBeTruthy();
    });

});
