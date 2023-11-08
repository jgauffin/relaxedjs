import { promises as fs } from 'fs'
import { IAnalyzerContext, IComponentAnalyzer } from '../compiler';

/**
 * Generates a JSON index of all found components.
 */
export class ComponentIndexingTask implements IComponentAnalyzer{
    async analyze(context: IAnalyzerContext): Promise<void> {
        
        var json = JSON.stringify(context.components);
        await fs.writeFile(context.outputDirectory + 'componentIndex.json', json);
    }

}
