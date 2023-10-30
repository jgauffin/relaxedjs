import { InvokerNodeContext } from "../../src/Views/Engine2/Invokers/Invokers";
import { IBuildContext, ViewEngine } from "../../src/Views/Engine2/ViewEngine";
import { FakeComponentMeta } from "./Engine2/FakeComponentMeta";

let jsonResponse = { test: 100 };
let textResponse = '<div>Hello {{world}}</div>';
let calls = 0;

const fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve(jsonResponse),
        text: () => { calls++; return Promise.resolve(textResponse) }
    }),
) as jest.Mock;
global.fetch = fetch;

describe("ViewEngine", () => {

    beforeEach(() => {
        fetch.mockClear();
        calls = 0;
    });


    test("show fetch view from backend", async () => {
        var meta = new FakeComponentMeta();
        var context: IBuildContext = {
            viewPath: '/',
            templateFields: undefined
        };

        var sut = new ViewEngine()
        var actual = await sut.build(meta, context)

        expect(actual).toBeDefined();
    });

    test("show fetch view from backend once and then use cache", async () => {
        var meta = new FakeComponentMeta();
        var context: IBuildContext = {
            viewPath: '/',
            templateFields: undefined
        };

        var sut = new ViewEngine()
        await sut.build(meta, context)
        await sut.build(meta, context)

        expect(calls).toBe(1);
    });


    test("should be able to render generated node", async () => {
        var meta = new FakeComponentMeta();
        var buildContext: IBuildContext = {
            viewPath: '/',
            templateFields: undefined
        };
        var target = document.createElement('div');
        var callback: any = {};

        var sut = new ViewEngine()
        var actual = await sut.build(meta, buildContext)
        var context = new InvokerNodeContext(actual, {}, callback);
        actual.invoke(target, context);

        console.log('generated: ', target);
        expect(actual).toBeDefined();
    });



});