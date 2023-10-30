import { ComponentIndexingTask } from "../../../src/Backend/BuildTasks/ComponentIndexingTask";
import { AnalyzerContextStub } from "../Stubs/AnalyzerContextStub";
import fs from 'fs';
var crypto = require('crypto');

describe("MetaGenerator", () => {
    var dirName = "";

    beforeEach(() => {
        dirName= 'indexing' + crypto.randomBytes(4).readUInt32LE(0);
        fs.mkdirSync(dirName);
      });
      
      afterEach(() => {
        fs.rmSync(dirName, { recursive: true, force: true });
      });

    test("Should put the file in the output directory.", async () => {
        var sut = new ComponentIndexingTask();
        var context = new AnalyzerContextStub;

        sut.analyze(context);
        
        fs.stat(dirName + "componentIndex.json", function(err, stat) {
            if (err != null) {
              throw new Error("File was not created.");
            }
          });
    });
});
