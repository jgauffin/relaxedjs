const fs = require('fs');
const path = require('path');
const glob = require("glob");
const dependencyTree = require('dependency-tree');

class DeltaWatchPlugin {
    constructor({ config }) {
        this.lastRun = new Date();
        this.watchPathIgnoreGlobs = config.watchPathIgnoreGlobs || [];
        this.modifiedFiles = [];
        this.testPaths = [];
        this.lastRun = [];
        //fs.rm('c:/temp/mylog.txt');
    }

    isDefinitionFile(file) {
        return file.substring(file.length - 5) === '.d.ts';
    }

    isModified(file) {
        var stats = fs.statSync(file);
        return stats.mtime > this.lastRun;
    }

    /**
     * Invoked when jest have detected file changes.
     * @param {string} rootDir Project root directory
     * @param {string[]} watchIgnorePatterns Ignore patterns defined in jest.config
     * @param {string[]} testPaths Paths to changed test files (jest seems to think that all have changed.)
     * @returns {string[]} test files that was modified (directly or indirectly through dependencies).
     */
    calculateFiles(rootDir, watchIgnorePatterns, testPaths) {
        let modifiedFiles = [];

        // Get all files since we cannot rely on jest reported files.
        const files = glob.sync(rootDir + "/**/*.ts", { ignore: watchIgnorePatterns });
        files.forEach((file) => {

            // shouldRunTestSuite() below is called with backslashes.
            const fileNameToAdd = file.replace(/\//g, "\\");

            // todo: add to ignore pattern
            if (this.isDefinitionFile(file) || file.indexOf('node_modules') !== -1) {
                return;
            }

            if (this.isModified(file)) {
                console.log('adding org ', fileNameToAdd);

                modifiedFiles.push(fileNameToAdd);

                // No need to check dependencies if the test
                // itself has been modified.
                return;
            }


            const dependencies = dependencyTree.toList({
                filename: file,
                directory: rootDir,
                filter: path => path.indexOf('node_modules') === -1 && !this.isDefinitionFile(path) && this.isModified(path),
            });
            
            // Remove first entry which is the file itself.
            dependencies.shift();

            // consider it to be modified if any of it's dependencies are modified.
            if (dependencies.length > 0) {
                if (!modifiedFiles.includes(fileNameToAdd)) {
                    console.log('adding for dep ', fileNameToAdd, dependencies);

                    modifiedFiles.push(fileNameToAdd);
                }
            }
        });

        return modifiedFiles;
    }

    apply(jestHooks) {
        /** */
        jestHooks.onFileChange(({ projects }) => {
            projects.forEach(project => {
                console.log('files changed', this.lastRun);
                this.write('files changed.', project.config.watchPathIgnorePatterns, project.config.testMatch, project.testPaths);
                this.write('=======================');
                var newFiles = this.calculateFiles(project.config.rootDir, project.config.watchPathIgnorePatterns, project.testPaths);
                if (newFiles.length > 0){
                    this.lastRun = newFiles;
                    this.modifiedFiles = newFiles;
                }else{
                    this.modifiedFiles = this.lastRun;
                }
            });
            this.lastRun = new Date();
        });

        jestHooks.shouldRunTestSuite(({ testPath }) => {
            //console.log(this.modifiedFiles);

            for (let i = 0; i < this.modifiedFiles.length; i++) {
                if (testPath.includes(this.modifiedFiles[i]) || testPath == this.modifiedFiles[i]) {
                    return true;
                }
            }
            return false;
        });

        jestHooks.onTestRunComplete(results => {
            // Store the last run date time
            //console.log('done', results);
            this.lastRun = new Date();
        });
    }

    write(...args) {
        var msg = "";
        args.forEach(x => {
            if (typeof x === "string") {
                msg += " " + x;
            } else {
                msg += " " + JSON.stringify(x);
            }
        });

        //console.log(...args);
        fs.appendFile('c:/temp/mylog.txt', msg + "\r\n\r\n", err => {
            if (err) {
                console.error(err);
            }
            // file written successfully
        });
        //console.log(msg);
    }
}

module.exports = DeltaWatchPlugin;