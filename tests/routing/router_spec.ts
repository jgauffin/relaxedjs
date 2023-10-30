import { Router } from "../../src/Routing/Implementation/Router";
import { Container, IContainer } from "../../src/DependencyInjection/Container";
import { IComponent, IComponentContext } from "../../src/Components/Exports";
import { EmptyContext } from "../../src/Components/Implementation/EmptyContext";

class MyComponent implements IComponent {
    initialize(): Promise<void> {
        return Promise.resolve();
    }

    context: IComponentContext = new EmptyContext();

    me = "ey";
}

describe("Router", () => {
    const container: IContainer = new Container();
    container.register(MyComponent)

    test("that route matches manual registration", () => {
        var sut = new Router([]);
        sut.mapRoute('/url/+id/', MyComponent);

        let actual = sut.match('/url/3');

        expect(actual?.routeData).toHaveProperty('id', 3);
    });

    test("that route data is retreived", () => {
        var mapping = {className: 'MyComponent', componentConstructor: MyComponent, tagName: 'my', route: {path: '/url/:userName'}};
        var sut = new Router([mapping]);

        var actual = sut.match('/url/jonas');

        expect(actual?.routeData).toHaveProperty('userName', 'jonas')
    });

});