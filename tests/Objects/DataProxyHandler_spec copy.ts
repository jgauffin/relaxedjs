import {DataProxyHandler} from "../../src/Objects/DataProxy";

describe("DataProxyHandler", () => {

    test("Can wrap a simple object with one property.", () => {
        var obj = {age: 10};
        var propThatChanged: string|symbol: string|symbol = "";
        var sut = new DataProxyHandler();
        sut.subscribe({propertyChanged(instance, propertyName) {
            propThatChanged = propertyName;
        }});
        var myProxy = new Proxy(obj, sut);

        myProxy.age = 13;

        expect(propThatChanged).toBe('age');
        expect(obj.age).toBe(13);
    });

    test("that setting the same value doesnt generate change detection.", () => {
        var obj = {age: 10};
        var propThatChanged: string|symbol = "";
        var sut = new DataProxyHandler();
        sut.subscribe({propertyChanged(instance, propertyName) {
            propThatChanged = propertyName;
        }});
        var myProxy = new Proxy(obj, sut);

        myProxy.age = 10;

        expect(propThatChanged).toBe('');
    });

    test("accessing the child works in two steps.", () => {
        var obj = {address: {city: 'Falun'}};
        var propThatChanged: string|symbol = "";
        var sut = new DataProxyHandler();
        sut.subscribe({propertyChanged(instance, propertyName) {
            propThatChanged = propertyName;
        }});
        var myProxy = new Proxy(obj, sut);

        var addr = myProxy.address;
        addr.city = 'avesta';

        expect(propThatChanged).toBe('address');
    });    

    test("that a nested object generates change detection.", () => {
        var obj = {address: {city: 'Falun'}};
        var propThatChanged: string|symbol = "";
        var sut = new DataProxyHandler();
        sut.subscribe({propertyChanged(instance, propertyName) {
            propThatChanged = propertyName;
        }});
        var myProxy = new Proxy(obj, sut);

        myProxy.address.city = 'Avesta';

        expect(propThatChanged).toBe('address');
        expect(obj.address.city).toBe('Avesta');
    });
    
    test("that no notification is sent when just accessing nested property", () => {
        var obj = {address: {city: 'Falun'}};
        var propThatChanged: string|symbol = "";
        var sut = new DataProxyHandler();
        sut.subscribe({propertyChanged(instance, propertyName) {
            propThatChanged = propertyName;
        }});
        var myProxy = new Proxy(obj, sut);  

        console.log(myProxy.address.city);

        expect(propThatChanged).toBe('');
    });

    test("that assigning a new child object still generates detection.", () => {
        var obj = {address: {city: 'Falun3'}};
        var propThatChanged: string|symbol = "";
        var sut = new DataProxyHandler();
        sut.subscribe({propertyChanged(instance, propertyName) {
            propThatChanged = propertyName;
        }});
        var myProxy = new Proxy(obj, sut);

        myProxy.address = {city: 'Avesta3'};
        propThatChanged = '';
        myProxy.address.city = 'Hedemora';

        expect(propThatChanged).toBe('address');
        expect(obj.address.city).toBe('Hedemora');
    });   


});