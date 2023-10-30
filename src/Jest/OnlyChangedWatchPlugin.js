const fs = require('fs');
const path = require('path');
const glob = require("glob");
const dependencyTree = require('dependency-tree');

class OnlyChangedJestWatchPlugin {
    constructor({config}) {
        console.log('got config', config)
        this.lastRun = new Date();
        this.watchPathIgnoreGlobs = config.watchPathIgnoreGlobs || [];
        this.firstRun = null;
    }
    
    onFileChange(rootDir, dependencies, modifiedFiles) {
        const files =  glob.sync(rootDir + "/**/*.ts", { ignore: this.watchPathIgnoreGlobs });
        var newDeps = {};
        files.forEach((file) => {
            this.write("FILE: " + file.substring(-5));
            if (file.substring(-5) == '.d.ts'){
                return;
            }

            // Store whether has been modified
            var stats = fs.statSync(file);
            if (stats.mtime > this.lastRun) {
                this.write('adding file', file);
                modifiedFiles.push(file);
            }
            
            // Get dependencies
            const list = dependencyTree.toList({
                filename: file,
                directory: rootDir,
                filter: path => path.indexOf('node_modules') === -1 && path.substring(-5) !== '.d.ts',
            });

      
            //this.write('Dependencies for ', file, ' are ', dependencies);

            // Invert dependencies
            list.forEach((dependency) => {
                if (dependency.substring(-5) == '.d.ts'){
                    return;
                }

                //this.write(file, ', dependnecy: ', dependency);

                if (!(dependency in newDeps)) {
                    newDeps[dependency] = {};
                }

                if (!(file in dependencies[dependency])) {
                    newDeps[dependency][file] = {};
                }
            });
        });

        return { newDeps, modifiedFiles};
    }

    getModifiedDependencies(dependencies, modifiedFiles) {
        const modifiedDependencies = {};
        modifiedFiles.forEach((modifiedFile) => {
            modifiedDependencies[modifiedFile] = dependencies[modifiedFile] || [];
        });
        return modifiedDependencies;
    }

    getTestPaths(modifiedDependencies) {
        this.write('getTestPaths', modifiedDependencies);

        const testPaths = [];
        Object.keys(modifiedDependencies).forEach(key => {
            
            // Loop over dependencies
            Object.keys(modifiedDependencies[key]).forEach(filePath => {
                // Remove file extension
                const testPath = filePath.replace(/\.[^/.]+$/, '');

                if (!testPaths.includes(testPath)) {
                    testPaths.push(testPath);
                }
            });            
        });

        return testPaths;
    }

    apply(jestHooks) {
        jestHooks.onFileChange(({projects}) => {
            this.write('files changed.', this.firstRun, projects);
            this.write('=======================');

            let dependencies = {};
            let modifiedFiles = [];

            // Build the inverted dependency tree and get the files that were modified
            projects.forEach((project) => {
                const result = this.onFileChange(project.config.rootDir, dependencies, modifiedFiles);
                dependencies = result.dependencies;
                modifiedFiles = result.modifiedFiles;
            });

            // Filter the dependencies down to files that were modified only
            const modifiedDependencies = this.getModifiedDependencies(dependencies, modifiedFiles);

            // Get a array of test paths that jest will check tests against to see if it should run the test
            this.testPaths = this.getTestPaths(modifiedDependencies);
        });
        
        jestHooks.shouldRunTestSuite(({testPath}) => {
            for (let i=0;i<this.testPaths.length;i++) {
                if (testPath.includes(this.testPaths[i])) {
                    return true;
                }
            }
        });

        jestHooks.onTestRunComplete(results => {
            // Store the last run date time
            this.lastRun = new Date();
        });
    }

    write(...args){
        var msg = "";
        args.forEach(x => {
            if (typeof x === "string"){
                msg += " " + x;
            }else{
                msg += " " + JSON.stringify(x);
            }
        });

        fs.appendFile('c:/temp/mylog.txt', msg + "\r\n\r\n", err => {
            if (err) {
              console.error(err);
            }
            // file written successfully
          });
        //console.log(msg);
    }
}

module.exports = OnlyChangedJestWatchPlugin;