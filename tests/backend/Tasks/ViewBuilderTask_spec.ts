import { ViewBuilderTask } from "../../../src/Backend/BuildTasks/ViewBuilderTask";
import { IComponentMeta } from "../../../src/Backend/Services/MetaGenerator";
import { IAnalyzerContext } from "../../../src/Backend/compiler";

describe("ViewBuilderTask", () => {

    test("className is loaded.", async () => {
        var sut = new ViewBuilderTask();
        var errors: string[] = [];
        var componentMeta: IComponentMeta[] = [];

        
        var context: IAnalyzerContext = {
            addError(msg, category) {
                errors.push(msg);
            },
            components: componentMeta,
            outputDirectory: "./output"
        };

        sut.analyze(context);

        
    });


});