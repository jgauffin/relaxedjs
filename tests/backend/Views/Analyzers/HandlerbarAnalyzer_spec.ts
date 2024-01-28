import { HandleBarsInvoker } from "../../../../src/Backend/Views/Analyzers/TextAnalyzers";
import { FakeComponentMeta } from "../../Stubs/FakeComponentMeta";
import { ViewBuilderProcessorContextStub, ViewStubBuilder } from "../../Stubs/ViewBuilderProcessorContextStub";

interface ITestObj {
    ViewBuilder: ViewStubBuilder
    Context: ViewBuilderProcessorContextStub,
    ParentElement: HTMLDivElement;
    Element: HTMLElement;
    result(): string;
}
function createTestObj(tagName: string): ITestObj {
    var meta = new FakeComponentMeta();
    var contextBuilder = new ViewStubBuilder();
    contextBuilder.parentVariableName = 'p';
    contextBuilder.componentMeta = meta;
    var parent = document.createElement("div");
    var e = document.createElement(tagName);
    parent.appendChild(e);
    var context = contextBuilder.build(e.tagName);
    return {
        ViewBuilder: contextBuilder,
        Context: context,
        Element: e,
        ParentElement: parent,
        result(): string {
            return contextBuilder.methodBuilder?.toString() ?? "";
        }
    }
}

describe("AttributeAnalyzer", () => {


    beforeEach(() => {
    });

    test("that a single handlebar value is replaced as innerText", () => {
        var testData = createTestObj('div');
        testData.Element.innerHTML = "{{name}}";

        var sut = new HandleBarsInvoker();
        sut.process(testData.Element, testData.Context);

        expect(testData.result()).toContain(".innerText = context.data.name;");
    });

    test("that multiple fields are concatenated", () => {
        var testData = createTestObj('div');
        testData.Element.innerHTML = "{{firstName}} {{lastName}}";

        var sut = new HandleBarsInvoker();
        sut.process(testData.Element, testData.Context);

        expect(testData.result()).toContain(".innerText = `${context.data.firstName} ${context.data.lastName}`;");
    });

    test("that element with multiple childrens are appended with child nodes", () => {
        var testData = createTestObj('div');
        testData.Element.innerHTML = "{{firstName}} {{lastName}}";
        var sibling = document.createElement('div');
        testData.ParentElement.appendChild(sibling)

        var sut = new HandleBarsInvoker();
        sut.process(testData.Element, testData.Context);

        expect(testData.result()).toContain(".text(`${context.data.firstName} ${context.data.lastName}`);");
    });


});