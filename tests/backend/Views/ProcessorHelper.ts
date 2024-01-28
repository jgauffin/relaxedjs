import { FakeComponentMeta } from "../Stubs/FakeComponentMeta";
import { ViewBuilderProcessorContextStub, ViewStubBuilder } from "../Stubs/ViewBuilderProcessorContextStub";

export interface ITestContext {
    ViewBuilder: ViewStubBuilder
    Context: ViewBuilderProcessorContextStub,
    ParentElement: HTMLDivElement;
    Element: HTMLElement;
    result(): string;
}

export function createTestContext(tagName: string): ITestContext {
    var meta = new FakeComponentMeta();
    var contextBuilder = new ViewStubBuilder();
    contextBuilder.parentVariableName = 'div';
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
