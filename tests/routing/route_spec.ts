import { Route } from "../../src/Routing/Implementation/Route";
import { IRouteContext } from "../../src/Routing/IRouteContext";

describe("Route", () => {

    test("matches url with parameter", () => {
        var ctx: IRouteContext = {
            url: '/users/10/edit'
        };

        var sut = new Route('/users/:id/edit')
        var actual = sut.isMatch(ctx);

        expect(actual).toBe(true);
    });
 
    test("should remove first/last slash to be able to match - part one", () => {
        var ctx: IRouteContext = {
            url: 'users/10/edit'
        };

        var sut = new Route('/users/:id/edit/')
        var actual = sut.isMatch(ctx);

        expect(actual).toBe(true);
    });

    test("should remove first/last slash to be able to match - part two", () => {
        var ctx: IRouteContext = {
            url: '/users/10/edit/'
        };

        var sut = new Route('users/:id/edit')
        var actual = sut.isMatch(ctx);

        expect(actual).toBe(true);
    });


    test("that route matches multiple arguments", () => {
        var ctx: IRouteContext = {
            url: '/users/10/edit'
        };

        var sut = new Route('/users/+id/:action')
        var actual = sut.isMatch(ctx);

        expect(actual).toBe(true);
    });    

    test("that routeData parameter is assigned from url", () => {
        var ctx: IRouteContext = {
            url: '/users/10/edit'
        };

        var sut = new Route('/users/+id/edit')
        var actual = sut.getRouteData(ctx);

        expect(actual).toHaveProperty('id', 10);
    });

    test("that multiple routeData parameters are assigned from url", () => {
        var ctx: IRouteContext = {
            url: '/users/10/edit'
        };

        var sut = new Route('/users/+id/:action')
        var actual = sut.getRouteData(ctx);

        expect(actual).toHaveProperty('id', 10);
        expect(actual).toHaveProperty('action', 'edit');
    });

});