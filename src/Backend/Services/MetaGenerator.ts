import * as ts from "typescript";

/**
 * Metadata for a method argument.
 */
export interface IArgumentMeta {
    name: string;

    /**
     * For built in js types.
     */
    typeName?: string;
}

/**
 * Meta data for a function.
 */
export interface IFunctionMeta {
    name: string;
    arguments: IArgumentMeta[];
}


/**
 * A class property.
 */
export interface IPropertyMeta {
    name: string;

    /**
     * For built in js meta
     */
    typeName?: string;

    /**
     * For app types, we'll just include properties in the object.
     */
    properties: IPropertyMeta[];
}

/**
 * Metadata for a Relaxed.js component (or page).
 */
export interface IComponentMeta {
    /**
     * Specified if the metadata is for a page.
     */
    routePath?: string;

    /**
     * Specified if the metadata is for a component.
     */
    tagName?: string;

    /** 
     * Data loaded into the page.
    */
    data: IPropertyMeta[];

    /**
     * Page class name
     */
    className: string;

    /**
     * Actual file name (without path).
     */
    fileName: string;

    /**
     * Directory relative to root where the component is located.
     */
    directory: string;

    /**
     * Methods defined in this page.
     * 
     * Used for instance to ensure that functions that are referenced in views are actually defined.
     */
    functions: IFunctionMeta[];

    /**
     * Arguments used in the constructor.
     */
    constructorArguments: IArgumentMeta[];

    /**
     * Properties defined in the page.
     */
    properties: IArgumentMeta[];

    findMethod(name: string): IFunctionMeta | undefined;
}

export function generateMeta(directory: string, sf: ts.SourceFile): IComponentMeta {
    let componentMeta: IComponentMeta = {
        className: '',
        tagName: '',
        directory: directory,
        fileName: sf.fileName,
        constructorArguments: [],
        functions: [],
        properties: [],
        data: [],

        findMethod(name: string): IFunctionMeta | undefined {
            return this.functions.find(x => x.name == name);
        }
    };

    // search all nodes of source file
    sf.forEachChild(function (node: ts.Node) {

        if (node.kind == ts.SyntaxKind.ClassDeclaration) {

            var cls: ts.ClassDeclaration = <ts.ClassDeclaration>node;


            componentMeta.className = cls.name?.getText(sf) ?? "unknown";

            cls.forEachChild(function (m: ts.Node) {

                if (m.kind == ts.SyntaxKind.Decorator) {
                    var decorator = <ts.Decorator>m;
                    var d = <any>decorator;
                    let name = d.expression.expression.escapedText;
                    if (name == 'component') {
                        componentMeta.tagName = d.expression.arguments[0].text;
                        if (d.expression.arguments.length > 1) {
                            componentMeta.routePath = d.expression.arguments[1].text;
                        }
                    }

                    if (name == 'page') {
                        if (d.expression.arguments.length > 1) {
                            componentMeta.routePath = d.expression.arguments[1].text;
                        }
                    }
                }

                if (m.kind == ts.SyntaxKind.Constructor) {
                    var constructor = <ts.ConstructorDeclaration>m;
                    constructor.parameters.forEach(child => {
                        componentMeta.constructorArguments.push({
                            name: child.name.getText(sf),
                            typeName: child.type?.getText(sf)
                        })
                    });
                }

                if (m.kind == ts.SyntaxKind.MethodDeclaration) {
                    var method = <ts.MethodDeclaration>m;

                    var methodMeta: IFunctionMeta = {
                        name: method.name.getText(sf),
                        arguments: []
                    };
                    componentMeta.functions.push(methodMeta);

                    method.parameters.forEach(child => {
                        methodMeta.arguments.push({
                            name: child.name.getText(sf),
                            typeName: child.type?.getText(sf)
                        })

                    });

                } else if (m.kind == ts.SyntaxKind.PropertyDeclaration) {

                    var prop = <ts.PropertyDeclaration>m;
                    componentMeta.properties.push({ name: prop.name.getText(sf), typeName: prop.type?.getText(sf)! });
                }

            });
        }
    });

    return componentMeta;
}
