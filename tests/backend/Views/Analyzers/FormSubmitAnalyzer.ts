import { ButtonEventAnalyzer } from "../../../../src/Backend/Views/Analyzers/AttributeAnalyzers";
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
            name: 'onSubmit',
            arguments: []
        });
        meta.functions.push({
            name: 'onReset',
            arguments: []
        });
    });

    test("that type from input button is used as source", () => {
        var e = document.createElement("input");
        var context = contextBuilder.build(e.tagName);
        e.setAttribute("type", "submit");

        var sut = new ButtonEventAnalyzer();
        sut.process(e, context);

        expect(context.methodBuilder.toString()).toContain("onSubmit");
        expect(context.methodBuilder.toString()).toContain("INPUT.addEventListener");
    });

    test("that name attribute is used as primary source for input button", () => {
        var e = document.createElement("input");
        var context = contextBuilder.build(e.tagName);
        e.setAttribute("type", "button");
        e.setAttribute("name", "checkForm");

        var sut = new ButtonEventAnalyzer();
        sut.process(e, context);

        expect(context.methodBuilder.toString()).toContain("onCheckForm");
    });

    
    test("that input name attribute is used as primary source for button", () => {
        var e = document.createElement("input");
        var context = contextBuilder.build(e.tagName);
        e.setAttribute("type", "reset");
        e.setAttribute("name", "checkForm");

        var sut = new ButtonEventAnalyzer();
        sut.process(e, context);

        expect(context.methodBuilder.toString()).toContain("onCheckForm");
    });

    test("that type attribute is used as source for button", () => {
        var e = document.createElement("input");
        var context = contextBuilder.build(e.tagName);
        e.setAttribute("type", "reset");

        var sut = new ButtonEventAnalyzer();
        sut.process(e, context);

        expect(context.methodBuilder.toString()).toContain("onReset");
    });

    test("that the input itself is used as source for button", () => {
        var e = document.createElement("input");
        var context = contextBuilder.build(e.tagName);

        var sut = new ButtonEventAnalyzer();
        sut.process(e, context);

        expect(context.methodBuilder.toString()).toContain("onClick");
    });



    test("that name attribute is used as primary source for button", () => {
        var e = document.createElement("button");
        var context = contextBuilder.build(e.tagName);
        e.setAttribute("type", "reset");
        e.setAttribute("name", "checkForm");

        var sut = new ButtonEventAnalyzer();
        sut.process(e, context);

        expect(context.methodBuilder.toString()).toContain("onCheckForm");
    });

    test("that type attribute is used as source for button", () => {
        var e = document.createElement("button");
        var context = contextBuilder.build(e.tagName);
        e.setAttribute("type", "reset");

        var sut = new ButtonEventAnalyzer();
        sut.process(e, context);

        expect(context.methodBuilder.toString()).toContain("onReset");
    });

    test("that the button itself is used as source for button", () => {
        var e = document.createElement("button");
        var context = contextBuilder.build(e.tagName);

        var sut = new ButtonEventAnalyzer();
        sut.process(e, context);

        expect(context.methodBuilder.toString()).toContain("onClick");
    });


});