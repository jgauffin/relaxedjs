import "reflect-metadata";
import { Container } from "../../src/DependencyInjection/Container";
import { containerService, registrations } from "../../src/DependencyInjection/containerService";

class SimpleService {
    id: string = "nono";
}

class MyTest {
    constructor(public simpleService: SimpleService) {

    }
}

@containerService()
class AutoDependency {
    invoke() {

    }

    someNumber = 3;
}

@containerService()
class AutoService {
    constructor(public auto: AutoDependency) {

    }

    do() {
        this.auto.invoke();
    }
}

describe("Container", () => {

    var container = new Container();
    registrations.forEach(service => {
        container.register(service.type);
    });

    // beforeEach(() => {
    //     console.log('============================')
    // });

    test("to register a simple service", () => {
        var service = new SimpleService();
        service.id = "3";
        var sut = new Container();
        sut.register('nod', service);

        var actual = sut.resolve('nod');

        expect(actual).toHaveProperty('id', '3');
    });

    test("to resolve a service with an dependency", () => {
        var service = new SimpleService();
        service.id = "3";
        var sut = new Container();
        sut.register('SimpleService', service);
        sut.register(MyTest);

        var actual = sut.resolve('MyTest');

        expect(actual.simpleService).toHaveProperty('id', '3');
    });

    test("to resolve a a service and a dependency registered through the decorator", () => {
        var sut = container;


        var actual = <AutoService>sut.resolve(AutoService);

        expect(actual.auto).toHaveProperty('someNumber', 3);
    });
});

