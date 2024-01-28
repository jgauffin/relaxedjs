import { ArrayProxyHandler, ListNotification, ListNotificationType } from "../../src/Objects/ArrayProxy";

const EmptyNotification: ListNotification<any> = { index: -9999, items: [], notificationType: ListNotificationType.Added, key: undefined };

describe("ArrayProxyHandler", () => {

    test("Can notify on push.", () => {
        var obj = [{ age: 10 }];
        var sut = new ArrayProxyHandler();
        var actual: ListNotification<any> = EmptyNotification;
        sut.subscribe((o, e) => {
            actual = e;
        });
        var myProxy = new Proxy(obj, sut);

        myProxy.push({ age: 30 })

        expect(actual.index).toBe(1);
        expect(actual.items[0]).toHaveProperty('age', 30);
    });

    test("added object is wrapped in a proxy.", () => {
        var obj = [{ age: 10 }];
        var sut = new ArrayProxyHandler();
        var actual: ListNotification<any> = EmptyNotification;
        sut.subscribe((o, e) => {
            actual = e;
        });
        var myProxy = new Proxy(obj, sut);

        myProxy.push({ age: 30 })
        actual = EmptyNotification;
        myProxy[1].age = 31;

        expect(actual.index).toBe(1);
        expect(actual.items[0]).toHaveProperty('age', 31);
    });

    // test("that setting the same value doesnt generate change detection.", () => {
    //     var obj = [{age: 10}];
    //     var propThatChanged: string|symbol = "";
    //     var sut = new ArrayProxyHandler();
    //     sut.subscribe({propertyChanged(instance, propertyName) {
    //         propThatChanged = propertyName;
    //     }});
    //     var myProxy = new Proxy(obj, sut);

    //     myProxy.age = 10;

    //     expect(propThatChanged).toBe('');
    // });

    // test("accessing the child works in two steps.", () => {
    //     var obj = [{age: 10}];
    //     var propThatChanged: string|symbol = "";
    //     var sut = new ArrayProxyHandler();
    //     sut.subscribe({propertyChanged(instance, propertyName) {
    //         propThatChanged = propertyName;
    //     }});
    //     var myProxy = new Proxy(obj, sut);

    //     var addr = myProxy.address;
    //     addr.city = 'avesta';

    //     expect(propThatChanged).toBe('address');
    // });    

    // test("that a nested object generates change detection.", () => {
    //     var obj = [{age: 10}];
    //     var propThatChanged: string|symbol = "";
    //     var sut = new ArrayProxyHandler();
    //     sut.subscribe({propertyChanged(instance, propertyName) {
    //         propThatChanged = propertyName;
    //     }});
    //     var myProxy = new Proxy(obj, sut);

    //     myProxy.address.city = 'Avesta';

    //     expect(propThatChanged).toBe('address');
    //     expect(obj.address.city).toBe('Avesta');
    // });

    // test("that no notification is sent when just accessing nested property", () => {
    //     var obj = [{age: 10}];
    //     var propThatChanged: string|symbol = "";
    //     var sut = new ArrayProxyHandler();
    //     sut.subscribe({propertyChanged(instance, propertyName) {
    //         propThatChanged = propertyName;
    //     }});
    //     var myProxy = new Proxy(obj, sut);  

    //     console.log(myProxy.address.city);

    //     expect(propThatChanged).toBe('');
    // });

    // test("that assigning a new child object still generates detection.", () => {
    //     var obj = [{age: 10}];
    //     var propThatChanged: string|symbol = "";
    //     var sut = new ArrayProxyHandler();
    //     sut.subscribe({propertyChanged(instance, propertyName) {
    //         propThatChanged = propertyName;
    //     }});
    //     var myProxy = new Proxy(obj, sut);

    //     myProxy.address = {city: 'Avesta3'};
    //     propThatChanged = '';
    //     myProxy.address.city = 'Hedemora';

    //     expect(propThatChanged).toBe('address');
    //     expect(obj.address.city).toBe('Hedemora');
    // });   


});