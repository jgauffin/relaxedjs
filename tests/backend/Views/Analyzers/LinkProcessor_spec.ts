import { LinkProcessor } from "../../../../src/Backend/Views/Analyzers/AttributeAnalyzers";
import { registrations } from "../../../../src/Components/Implementation/Decorator";
import { FakeComponentMeta } from "../../Stubs/FakeComponentMeta";
import { ViewStubBuilder } from "../../Stubs/ViewBuilderProcessorContextStub";


describe("LinkProcessor", () => {
    var meta = new FakeComponentMeta();
    var contextBuilder = new ViewStubBuilder();
    contextBuilder.componentMeta = meta;

    beforeEach(() => {
        registrations.length = 0;
        meta.functions.push({
            name: 'AddUser',
            arguments: []
        });
    });

    test("LinkProcessor should attach HREF to links without it.", () => {
        var e = document.createElement("A");
        var context= contextBuilder.build('a');

        var sut = new LinkProcessor();
        sut.process(e, context);

        expect(e.getAttribute("href")).toBe('#');
    });

    test("LinkProcessor should not attach HREF to links with it.", () => {
        var e = document.createElement("A");
        e.setAttribute('href', 'http://ada')
        var context= contextBuilder.build('a');

        var sut = new LinkProcessor();
        sut.process(e, context);

        expect(e.getAttribute("href")).toBe('http://ada');
    });    

    test("LinkProcessor should warn when method not found.", () => {
        var e = document.createElement("A");
        e.setAttribute('name', 'NoMethod')
        var context= contextBuilder.build('a');
        context.viewPath = 'aa';
        context.viewResult.component = meta;

        var sut = new LinkProcessor();
        sut.process(e, context);

        expect(context.logEntries[0].source).toBe(context.viewPath);
    });    

    test("LinkProcessor should bind existing method.", () => {
        var e = document.createElement("A");
        e.setAttribute('name', 'AddUser')
        var context= contextBuilder.build('a');
        context.viewPath = 'aa';
        context.viewResult.component = meta;

        var sut = new LinkProcessor();
        sut.process(e, context);

        expect(context.methodBuilder.toString()).toContain('AddUser');
    });    
});