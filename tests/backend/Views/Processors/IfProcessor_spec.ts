import {IfAttribute} from "../../../../src/Backend/Views/Preprocessors/ControlAttributes";
import { FakeComponentMeta } from "../../Stubs/FakeComponentMeta";
import { ViewStubBuilder } from "../../Stubs/ViewBuilderProcessorContextStub";
import {createTestContext, ITestContext} from "../ProcessorHelper";

describe("IfProcessor", () => {
    var meta = new FakeComponentMeta();
    var contextBuilder = new ViewStubBuilder();
    contextBuilder.componentMeta = meta;

    test("that processor requires if attribute", () => {
        var e = document.createElement("div");
        e.setAttribute("if", "isActive");

        var sut = new IfAttribute();
        var actual = sut.analyze(e);

        expect(actual).toBeTruthy();
    });

    test("that processor ignores nodes without if attribute", () => {
        var e = document.createElement("div");

        var sut = new IfAttribute();
        var actual = sut.analyze(e);

        expect(actual).toBeFalsy();
    });

    test("that processor treats parenthis as method calls", () => {
        var helper = createTestContext('div');
        helper.Element.setAttribute("if", "isActive()");

        var sut = new IfAttribute();
        sut.process(helper.Element, helper.Context);

        expect(helper.result()).toContain("if (context.vm.isActive())) {");
    });

    
    test("that processor treats value as parameter calls", () => {
        var helper = createTestContext('div');
        helper.Element.setAttribute("if", "isActive()");

        var sut = new IfAttribute();
        sut.process(helper.Element, helper.Context);

        expect(helper.result()).toContain("if (context.data.isActive())) {");
    });

});