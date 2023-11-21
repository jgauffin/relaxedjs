//import exp from "constants";
//import { Result } from "../../../src/Backend/Views/Preprocessors/Index";
import { ViewBuilder } from "../../../src/Backend/Views/ViewBuilder";
import { registrations } from "../../../src/Components/Implementation/Decorator";
import { TextNodeProcessorStub } from "../Stubs/ElementPreProcessorStub";

// let jsonResponse = { test: 100 };
// let textResponse = '<div>Hello {{world}}</div>';
// let calls = 0;

import { FakeComponentMeta } from "./FakeComponentMeta";

// const fetch = jest.fn(() =>
//     Promise.resolve({
//         json: () => Promise.resolve(jsonResponse),
//         text: () => { calls++; return Promise.resolve(textResponse) }
//     }),
// ) as jest.Mock;
// global.fetch = fetch;

class MyComponent {

    constructor() {

    }

}

describe("ViewEngine", () => {
    var meta = new FakeComponentMeta();

    beforeEach(() => {
        registrations.length = 0;
        meta.functions.push({
            name: 'onAddUser',
            arguments: []
        });
    });

    function addComponentRegistration() {
        registrations.push({
            className: 'MyComponent',
            componentConstructor: MyComponent,
            tagName: 'MyComponent',
        });
    }

    // test("Should not invoke preProcessor if it does not support the element.", async () => {
    //     addComponentRegistration();
    //     meta.setData({ users: [] });
    //     var wrapper = document.createElement('div');
    //     wrapper.innerHTML = `<div></div>`;
    //     var stub = new ElementProcessorStub(false);

    //     var sut = new ViewBuilder(meta, [stub]);
    //     await sut.process('MyView', wrapper);

    //     expect(stub.invoked).toBeFalsy();
    // });

    // test("Should invoke preProcessor if it supports the element.", async () => {
    //     addComponentRegistration();
    //     meta.setData({ users: [] });
    //     var wrapper = document.createElement('div');
    //     wrapper.innerHTML = `<div></div>`;
    //     var stub = new ElementProcessorStub(true);

    //     var sut = new ViewBuilder(meta, [stub]);
    //     await sut.process('MyView', wrapper);

    //     expect(stub.invoked).toBeTruthy();
    // });


    // test("Should not invoke more preProcessors if one says stop.", async () => {
    //     addComponentRegistration();
    //     meta.setData({ users: [] });
    //     var wrapper = document.createElement('div');
    //     wrapper.innerHTML = `<div></div>`;
    //     var stub1 = new ElementProcessorStub(true);
    //     var stub2 = new ElementProcessorStub(true);
    //     stub1.resultToReturn = Result.StopProcessing;

    //     var sut = new ViewBuilder(meta, [stub1, stub2]);
    //     await sut.process('MyView', wrapper);

    //     expect(stub1.invoked).toBeTruthy();
    //     expect(stub2.invoked).toBeFalsy();
    // });    

    

    // test("Should invoke text processors for text.", () => {
    //     addComponentRegistration();
    //     meta.setData({ users: [] });
    //     var wrapper = document.createElement('div');
    //     wrapper.innerHTML = `<div>Hello, this is a a text</div>`;
    //     var stub1 = new TextNodeProcessorStub(true);
    //     stub1.resultToReturn = false;

    //     var sut = new ViewBuilder(meta, undefined, [stub1]);
    //     sut.process('MyView', wrapper);

    //     expect(stub1.invoked).toBeTruthy();
    // });

    test("Should not invoke next for text nodes that says stop.", () => {
        addComponentRegistration();
        meta.setData({ users: [] });
        var wrapper = document.createElement('div');
        wrapper.innerHTML = `<div>this is my text</div>`;
        var stub1 = new TextNodeProcessorStub(true);
        var stub2 = new TextNodeProcessorStub(true);
        stub1.resultToReturn = false;

        var sut = new ViewBuilder(meta, undefined, [stub1, stub2]);
        sut.process('MyView', wrapper);

        expect(stub1.invoked).toBeTruthy();
        expect(stub2.invoked).toBeFalsy();
    });    



    // test("show fetch view from backend", async () => {
    //     var meta = new FakeComponentMeta();
    //     meta.functions.push({
    //         name: 'onAddUser',
    //         arguments: []
    //     });

    //     registrations.push({
    //         className: 'MyComponent',
    //         componentConstructor: MyComponent,
    //         tagName: 'MyComponent',
    //     });

    //     meta.setData({ users: [] });
    //     var wrapper = document.createElement('div');
    //     wrapper.innerHTML = `<div if="users">
    //                             <span>Hello {{world}}!</span>
    //                             <table>
    //                                 <tr for="users">
    //                                     <td :id="item.id">{{item.FirstName}}</td>
    //                                     <td><a name="yo">Test</a></td>
    //                                 </tr>
    //                             </table>
    //                         </div>
    //                         <section else>
    //                             Hello world!
    //                             <MyComponent id="id"><div name="header">{{firstName}}</div></MyComponent>
    //                         </section>
    //                         <form name="AddUser">
                            
    //                             <input name="Name" placeholder="Name">
    //                             <input name="Age" type="number" />
    //                             <button>Submit</button>
    //                         </form>
    //                         `;

    //     var sut = new ViewBuilder(meta);
    //     var actual = await sut.process('MyView', wrapper);

    //     console.log(actual);
    //     expect(actual).toBeDefined();
    // });


    // test("can process view without special tags", async () => {
    //     var meta = new FakeComponentMeta();
    //     meta.functions.push({
    //         name: 'onAddUser',
    //         arguments: []
    //     });

    //     registrations.push({
    //         className: 'MyComponent',
    //         componentConstructor: MyComponent,
    //         tagName: 'MyComponent',
    //     });

    //     meta.setData({users: []});
    //     var wrapper = document.createElement('div');
    //     wrapper.innerHTML = `<div>
    //                             <span></span>
    //                         </div>
    //                         `;

    //     var sut = new ViewBuilder(meta);
    //     var actual = await sut.process('MyView', wrapper);

    //     console.log(actual);
    //     expect(actual).toBeDefined();
    // });

});