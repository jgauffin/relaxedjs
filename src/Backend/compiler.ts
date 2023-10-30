import * as ts from "typescript";
import { ISearchHit, searchFiles } from "./Services/FileSearcher";
import { promises as fs } from 'fs'
import { generateMeta, IComponentMeta } from "./Services/MetaGenerator";

export interface IAnalyzerContext{
    components: IComponentMeta[];
    addError(message: string, category: 'views'|'components'|'routing'): void;

    /**
     * Root directory for all generated files. Ends with a trailing slash.
     */
    outputDirectory: string;
}

interface IError{
    message: string;
     category: 'views'|'components'|'routing';
}

/**
 * Analyze found components.
 * 
 * Component analyzers are used to ensure that all components are well-defined and that their bindings to/from views are correct.
 */
export interface IComponentAnalyzer{
    analyze(context: IAnalyzerContext): Promise<void>;
}


async function generateMappingsFromResult(result: ISearchHit, metas: IComponentMeta[], errors: string[]): Promise<void> {
    for (const fullPath of result.files) {
        let directory = fullPath.substring(0,fullPath.lastIndexOf("\\")+1);

        var file = await fs.readFile(fullPath);
        var contents = file.toString();
        
        const node = ts.createSourceFile(fullPath, contents, ts.ScriptTarget.Latest);
        var meta = generateMeta(directory, node);
        if (meta.tagName || meta.routePath){

            var existing = metas.find(x=>x.className == meta.className);
            if (existing) {
                errors.push(`"${meta.className}" has already been mapped for "${existing.directory}.${existing.className}", cannot be mapped to "${meta.directory}.${meta.className}".`);
            }else{
                metas.push(meta);
            }
        }
    }

    for (let index = 0; index < result.children.length; index++) {
        const child = result.children[index];
        await generateMappingsFromResult(child, metas, errors);
    }
}

async function generateMappings(directory: string): Promise<IComponentMeta[]> {
    const errors: string[] = [];
    const metas: IComponentMeta[] = [];

    const result = await searchFiles(directory, ['ts']);
    console.log('found files:', result);
    if (result.files.length == 0) {
        return [];
    }

    await generateMappingsFromResult(result, metas, errors);

    if (errors.length > 0) {
        throw new Error(errors.join('\r\n'));
    }

    return metas;
}

export async function compile(directory: string, analyzers: IComponentAnalyzer[]): Promise<void>{
    var errors: IError[] = [];

    
    var mappings = await generateMappings(directory);

    var context: IAnalyzerContext = {
        addError(message, category) {
            errors.push({message, category});
        },
        components: mappings,
        outputDirectory: "../..output/"
    };


    for (let index = 0; index < analyzers.length; index++) {
        const analyzer = analyzers[index];
        await analyzer.analyze(context);
    }

    if (errors.length > 0){
        errors.forEach(x=>{
            console.log(x);
        });
        //throw new Error(errors.join("\r\n"));
    }
}