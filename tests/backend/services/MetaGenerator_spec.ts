import * as ts from "typescript";
import {generateMeta } from "../../../src/Backend/Services/MetaGenerator";

describe("MetaGenerator", () => {
    const defaultClass = `@component('someName', '/some/value')
    export class SomeClass {
        constructor(private someConstructor: SomeService){
        }
    
        private firstName: string = 'hello';
    
        onSubmit(event: MouseEvent){
    
        }
    
        onForm(){
    
        }
    
    
    }`;

    test("className is loaded.", async () => {
        var sf = ts.createSourceFile("aaa.ts", defaultClass, ts.ScriptTarget.ES5);        
       
        const actual = generateMeta(__dirname, sf);

        expect(actual).toHaveProperty('className', 'SomeClass');
    });

    test("constructorArgument is loaded.", async () => {
        var sf = ts.createSourceFile("aaa.ts", defaultClass, ts.ScriptTarget.ES5);        
       
        const actual = generateMeta(__dirname, sf);

        expect(actual.constructorArguments[0]).toHaveProperty('name', 'someConstructor');
        expect(actual.constructorArguments[0]).toHaveProperty('typeName', 'SomeService');
    });    

    test("tagName from component decorator is loaded.", async () => {
        var sf = ts.createSourceFile("aaa.ts", defaultClass, ts.ScriptTarget.ES5);        
       
        const actual = generateMeta(__dirname, sf);

        expect(actual).toHaveProperty('tagName', 'someName');
    });    

    test("routePath from component decorator is loaded.", async () => {
        var sf = ts.createSourceFile("aaa.ts", defaultClass, ts.ScriptTarget.ES5);        
       
        const actual = generateMeta(__dirname, sf);

        expect(actual).toHaveProperty('routePath', '/some/value');
    });    

    test("methods are parsed.", async () => {
        var sf = ts.createSourceFile("aaa.ts", defaultClass, ts.ScriptTarget.ES5);        
       
        const actual = generateMeta(__dirname, sf);

        expect(actual.methods[0]).toHaveProperty('name', 'onSubmit');
        expect(actual.methods[0].arguments[0]).toHaveProperty('name', 'event');
        expect(actual.methods[0].arguments[0]).toHaveProperty('typeName', 'MouseEvent');
        expect(actual.methods[1]).toHaveProperty('name', 'onForm');
    }); 

    test("properties are parsed.", async () => {
        var sf = ts.createSourceFile("aaa.ts", defaultClass, ts.ScriptTarget.ES5);        
       
        const actual = generateMeta(__dirname, sf);

        expect(actual.properties[0]).toHaveProperty('name', 'firstName');
        expect(actual.properties[0]).toHaveProperty('typeName', 'string');
    });    

});