import { ViewBuilderTask } from "../../../src/Backend/BuildTasks/ViewBuilderTask";
import { IFunctionMeta } from "../../../src/Backend/Services/MetaGenerator";
import { AnalyzerContextStub } from "../Stubs/AnalyzerContextStub";
import fs from 'fs';
var crypto = require('crypto');
var path = require('path');

describe("ViewBuilderTask", () => {
    var dirName = "";

    beforeEach(() => {
        dirName = `indexing${crypto.randomBytes(4).readUInt32LE(0)}/`;
        fs.mkdirSync(dirName);

        var sourceDir=path.dirname(__filename) + '/helpers' ;
        fs.copyFileSync(sourceDir + "/MyComponent.ts", dirName + "/MyComponent.ts");
        fs.copyFileSync(sourceDir + "/MyComponent.html", dirName + "/MyComponent.html");
    });

    afterEach(() => {
       fs.rmSync(dirName, { recursive: true, force: true });
    });


    test("Should put the file in the output directory.", async () => {
        var sut = new ViewBuilderTask();
        var context = new AnalyzerContextStub();
        context.outputDirectory = dirName;
        context.components.push({
            className: 'MyComponent',
            fileName: 'myComponent.ts',
            data: [],
            directory: dirName,
            functions: [],
            constructorArguments: [],
            properties: [],
            findMethod: function (name: string): IFunctionMeta | undefined {
                throw new Error("Function not implemented.");
            }
        });

        await sut.analyze(context);

        if (context.errors){
            console.log(context.errors);
        }
        fs.statSync(dirName + "viewIndex.json");
    });
});