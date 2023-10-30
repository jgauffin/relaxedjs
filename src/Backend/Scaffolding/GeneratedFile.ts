export interface IGeneratedFile {
    /**
     * Relative path to the file (someComponentName/pages/)
     */
    path: string;

    /**
     * Filename
     */
    fileName: string;

    type: 'component'|'page'|'view';



}