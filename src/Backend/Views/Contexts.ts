import { IViewTemplateItem } from "../../browser";
import { IComponentMeta, IPropertyMeta } from "../Services/MetaGenerator"
import { StringBuilder } from "../Utils/StringBuilder";

export interface IPreRun {
    noLogic: boolean;
    children: IPreRun[];
    sb: StringBuilder;
}


export type ProcessChildNodeCallback = (node: Node, context: IScope2, createNewScope?: boolean) => void;


export interface IScope2 {

    /**
     * Queue a view generation for a templated child view.
     * @param tagName Component to generate a view for.
     * @param childViewPath Unique path to the generated view (so that the templated view are not mixed up with other generated versions).
     * @param element Element that contains templated items.
     */
    queueViewBuild(tagName: string, childViewPath: string, templateItems: IViewTemplateItem[]): void;

    /**
     * Method currently being built in the view.
     */
    methodBuilder: StringBuilder;
    bindBuilder: StringBuilder;

    /**
     * Variable name for the parent element.
     */
    parentVariableName: string;

    /**
     * Metadata for the 'data' property in the component.
     */
    data: IPropertyMeta[];

    /**
     * Current view path (hierarhical path)
     * 
     * For nested components since they can have templates and must therefore be generated specifically for a specific path.
     * The names are the component/page names
     * 
     * Example: /list-users/modal/create-user
     */
    viewPath: string;

    /**
     * A name has been defined for the currently generated element.
     */
    get gotName(): boolean;

    /**
     * Variable name for the currently generated element.
     */
    get variableName(): string;

    //getNextFieldName(): string;

    /**
     * View being built.
     */
    viewResult: IGeneratedViewClass

    processChildNode(node: Node, scope?: IScope2): void;
    createContext(tagName: string, variableName?: string, parentVariableName?: string, methodBuilder?: StringBuilder, newIndex?: boolean): IScope2;
    toDebug(): string;
}

export interface IRequestedViewBuild {
    templateItems: IViewTemplateItem[],
    tagName: string,
    childViewPath: string
}

export class Scope2 implements IScope2 {
    private _variableName?: string;

    constructor(private tagName: string, private callback: ProcessChildNodeCallback, public viewResult: IGeneratedViewClass, private tagIndexes: Map<string, number>, public parentVariableName: string, variableName?: string, methodBuilder?: StringBuilder) {
        if (!methodBuilder) {
            this.methodBuilder = new StringBuilder(4);
            viewResult.addMethod(this.methodBuilder);
        } else {
            this.methodBuilder = methodBuilder;
        }

        this.viewPath = `/${tagName}`;
        this._variableName = variableName;
        this.data =
            viewResult.component.data;
    }

    queuedViewBuilds: IRequestedViewBuild[] = [];

    queueViewBuild(tagName: string, childViewPath: string, templateItems: IViewTemplateItem[]): void {
        this.queuedViewBuilds.push({
            childViewPath: childViewPath,
            tagName: tagName,
            templateItems: templateItems
        });
    }

    createContext(tagName: string, variableName?: string | undefined, parentVariableName?: string | undefined, methodBuilder?: StringBuilder | undefined): IScope2 {
        if (!parentVariableName) {
            parentVariableName = this._variableName ?? this.parentVariableName;
        }

        if (!methodBuilder) {
            methodBuilder = this.methodBuilder;
        }

        if (!parentVariableName) {
            throw new Error('Got not parent name');
        }

        var newScope = new Scope2(tagName, this.callback, this.viewResult, this.tagIndexes, parentVariableName, variableName, methodBuilder);
        newScope.viewPath = `${this.viewPath}/${tagName}`;
        return newScope;
    }

    get gotName(): boolean {
        return this._variableName != null;
    }

    viewPath = "";
    methodBuilder: StringBuilder;
    bindBuilder = new StringBuilder();
    data: IPropertyMeta[] = [];
    get variableName(): string {
        if (!this._variableName) {
            var name = this.tagName.toLowerCase();
            var number = this.tagIndexes.get(name);
            if (!number) {
                number = 1;
            }
            this._variableName = `${name}${number++}`;
            this.tagIndexes.set(name, number);
        }

        return this._variableName;
    }

    processChildNode(node: Node, scope?: IScope2): void {
        // console.log('ddd', scope);
        // console.log('parentScope', this);
        // var c =scope ?? this.createContext();
        // console.log('renderChildScope', c);
        if (scope) {
            console.log('sss', scope.toDebug());
        }
        console.log('context.render()', this.toDebug());
        this.callback(node, scope ?? this, false);
    }

    toDebug(): string {
        return `parent: ${this.parentVariableName}, name: ${this._variableName}, ${this.tagName}`;
    }
}

/**
 * Represents the class that gets generated while parsing view HTML.
 */
export interface IGeneratedViewClass {
    getNextMethodIndex(): number;
    addMethod(body: StringBuilder): void;
    component: IComponentMeta
}

export class GeneratedViewClass implements IGeneratedViewClass {
    private mIndex = 0;
    public methods: StringBuilder[] = [];
    constructor(public component: IComponentMeta) {

    }
    getNextMethodIndex(): number {
        return this.mIndex++;
    }
    addMethod(body: StringBuilder): void {
        this.methods.push(body);
    }
}