import { promises as fs } from 'fs'

export interface ISearchHit {
    path: string,
    files: string[];
    children: ISearchHit[]
}

export async function searchFiles(folderName: string, extensions?: string[]): Promise<ISearchHit> {
    var root: ISearchHit = {
        files: [],
        path: folderName,
        children: []
    };
    await searchFilesInternal(folderName, extensions ?? [], root);
    return root;
}

async function searchFilesInternal(folderName: string, extensions: string[], parent: ISearchHit): Promise<void> {

    const folderChildren = await fs.readdir(folderName)
    for (const child of folderChildren) {
        const childPath = `${folderName}/${child}`

        const childStats = await fs.lstat(childPath)
        if (childStats.isDirectory()) {
            var childHit: ISearchHit = {
                children: [],
                files: [],
                path: childPath
            };
            parent.children.push(childHit);
            await searchFilesInternal(childPath, extensions, childHit)
        }

        else if (childStats.isFile()) {
            const extension = child.split('.').pop() || ''
            const skipFile = extensions?.length
                ? !extensions.includes(extension)
                : false

            if (skipFile) continue

            //const fullPathToFile = path.resolve(childPath)
            console.log('adding', childPath);
            parent.files.push(childPath);
        }

    }
}
