import { AttributePrefixModifier } from "../../../../src/Backend/Views/Analyzers/AttributeAnalyzers";
import { registrations } from "../../../../src/Components/Implementation/Decorator";
import { FakeComponentMeta } from "../../Stubs/FakeComponentMeta";
import { ViewStubBuilder } from "../../Stubs/ViewBuilderProcessorContextStub";


describe("AttributeAnalyzer", () => {
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

    test("should treat prefixed attribute a a data variable", () => {
        var e = document.createElement("A");
        var context = contextBuilder.build('a');
        e.setAttribute(":value", "age");

        var sut = new AttributePrefixModifier();
        sut.process(e, context);

        expect(context.methodBuilder.toString()).toContain("data.age")
    });

    test("should ignore attributes without prefixes", () => {
        var e = document.createElement("A");
        var context = contextBuilder.build('a');
        e.setAttribute("value", "age");

        var sut = new AttributePrefixModifier();
        sut.process(e, context);

        expect(context.methodBuilder.toString()).toBe('')
    });

});