import { IComponentMeta } from "../../../src/Backend/Services/MetaGenerator";
import { IAnalyzerContext, IComponentAnalyzer } from "../../../src/Backend/compiler";

export class Error {
    constructor(public message: string, public category: "views" | "components" | "routing") {

    }
}

export class AnalyzerContextStub implements IAnalyzerContext {
    components: IComponentMeta[] = [];
    addError(message: string, category: "views" | "components" | "routing"): void {
        this.errors.push(new Error(message, category));
    }
    errors: Error[] = [];
    outputDirectory: string;
}