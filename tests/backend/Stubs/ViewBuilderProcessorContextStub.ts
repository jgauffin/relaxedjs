import { IComponentMeta, IPropertyMeta } from "../../../src/Backend/Services/MetaGenerator";
import { StringBuilder } from "../../../src/Backend/Utils/StringBuilder";
import { GeneratedViewClass, ICompilerLogger, IGeneratedViewClass, IViewBuilderProcessorContext, LogType, ProcessChildNodeCallback } from "../../../src/Backend/Views/Contexts";
import { IViewTemplateItem } from "../../../src/browser";
import { FakeComponentMeta } from "./FakeComponentMeta";


export interface ILogEntry {
    type: LogType;
    source: string;
    message: string;
    level: string;
}

export interface ICallbackCall {
    node: Node;
    context: IViewBuilderProcessorContext;
    createNewScope?: boolean
}

export class ViewStubBuilder {
    public viewResult?: IGeneratedViewClass;
    public callbackCalls: ICallbackCall[] = [];
    public componentMeta: IComponentMeta = new FakeComponentMeta();
    public tagIndexes: Map<string, number> = new Map();
    public parentVariableName = '';
    public variableName?: string;
    public methodBuilder?= new StringBuilder();

    constructor() {
    }
    public testCallback(node: Node, context: IViewBuilderProcessorContext, createNewScope?: boolean) {
        this.callbackCalls.push({ node, context, createNewScope });
    }

    public build(tagName: string, viewResult?: IGeneratedViewClass): ViewBuilderProcessorContextStub {

        if (!viewResult) {
            if (!this.viewResult) {
                this.viewResult = new GeneratedViewClass(this.componentMeta);
            }
            viewResult = this.viewResult;
        }

        var context = new ViewBuilderProcessorContextStub(tagName, this.testCallback, viewResult, this.tagIndexes, this.parentVariableName, this.variableName, this.methodBuilder);
        return context;
    }

}

export class ViewBuilderProcessorContextStub implements IViewBuilderProcessorContext, ICompilerLogger {
    private _variableName?: string;
    public logEntries: ILogEntry[] = [];

    constructor(private tagName: string, private callback: ProcessChildNodeCallback, public viewResult: IGeneratedViewClass, private tagIndexes: Map<string, number>, public parentVariableName: string, variableName?: string, methodBuilder?: StringBuilder) {
        if (!methodBuilder) {
            this.methodBuilder = new StringBuilder(4);
            viewResult.addMethod(this.methodBuilder);
        } else {
            this.methodBuilder = methodBuilder;
        }

        this.viewPath = `/${tagName}`;
        this._variableName = variableName;
        this.data =            viewResult.component.data;
        this.logger = this;
    }
    error(type: LogType, source: string, message: string): void {
        this.logEntries.push({ type, source, message, level: 'error' });
    }
    warning(type: LogType, source: string, message: string): void {
        this.logEntries.push({ type, source, message, level: 'warning' });
    }
    logger: ICompilerLogger;



    queueViewBuild(tagName: string, childViewPath: string, templateItems: IViewTemplateItem[]): void {
        throw new Error("Method not implemented.");
    }
    methodBuilder: StringBuilder = new StringBuilder();
    bindBuilder: StringBuilder = new StringBuilder();
    data: IPropertyMeta[] = [];
    viewPath: string = '';
    get gotName(): boolean {
        throw new Error("Method not implemented.");
    }
    get variableName(): string {
        if (!this._variableName) {
            this._variableName = this.tagName;
        }

        return this._variableName!;
    }

    processChildNode(node: Node, scope?: IViewBuilderProcessorContext | undefined): void {
        if (this.callback) {
            this.callback(node, scope!, false);
        }
    }

    createContext(tagName: string, variableName?: string | undefined, parentVariableName?: string | undefined, methodBuilder?: StringBuilder | undefined, newIndex?: boolean | undefined): IViewBuilderProcessorContext {
        if (!parentVariableName) {
            parentVariableName = this._variableName ?? this.parentVariableName;
        }

        if (!methodBuilder) {
            methodBuilder = this.methodBuilder;
        }

        if (!parentVariableName) {
            throw new Error('Got not parent name');
        }

        var newScope = new ViewBuilderProcessorContextStub(tagName, this.callback, this.viewResult, this.tagIndexes, parentVariableName, variableName, methodBuilder);
        newScope.viewPath = `${this.viewPath}/${tagName}`;
        return newScope;
    }
    toDebug(): string {
        throw new Error("Method not implemented.");
    }

}
